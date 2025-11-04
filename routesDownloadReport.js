// routesReports.js - Reports API for PDF Generation
const express = require("express");
const router = express.Router();
const db = require("./db");

// GET all members complete data for report
router.get("/all-members", (req, res) => {
  // Optional: Add admin authentication check
  // if (!req.session?.user?.isAdmin) {
  //   return res.status(403).json({ error: "Access denied" });
  // }
  
  const query = `
  SELECT 
    r.member_id,
    r.firstName as name,
    r.gender,
    r.dob,
    r.enrollment_date,
    r.expiry_date,
    COALESCE(m.type, 'No Plan') as plan_name,
    COALESCE(m.duration, 'N/A') as duration,
    COALESCE(p.status, 'Not Paid') as payment_status,
    p.payment_date,
    CASE 
      WHEN r.expiry_date IS NULL THEN 'Inactive'
      WHEN r.expiry_date < CURDATE() THEN 'Expired'
      WHEN r.expiry_date = CURDATE() THEN 'Expiring Today'
      WHEN r.expiry_date > CURDATE() AND r.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'Expiring Soon'
      ELSE 'Active'
    END as plan_status
  FROM register r
  LEFT JOIN membership m ON r.membership_id = m.membership_id
  LEFT JOIN payment p ON r.member_id = p.member_id
  ORDER BY r.member_id ASC;
`;

  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching members for report:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    // Format dates for better display
    const formattedResults = results.map(member => ({
      ...member,
      enrollment_date: member.enrollment_date ? 
        new Date(member.enrollment_date).toLocaleDateString('en-GB') : 'N/A',
      expiry_date: member.expiry_date ? 
        new Date(member.expiry_date).toLocaleDateString('en-GB') : 'N/A',
      payment_date: member.payment_date ? 
        new Date(member.payment_date).toLocaleDateString('en-GB') : 'N/A',
      dob: member.dob ? 
        new Date(member.dob).toLocaleDateString('en-GB') : 'N/A'
    }));
    
    console.log(`✅ Generated report data for ${formattedResults.length} members`);
    res.json(formattedResults);
  });
});

// GET single member report data
router.get("/member/:id", (req, res) => {
  const memberId = req.params.id;
  
  const query = `
    SELECT 
      r.member_id,
      r.firstName as name,
      r.email,
      r.phone,
      r.gender,
      r.dob,
      r.enrollment_date,
      r.expiry_date,
      r.assigned_trainer,
      COALESCE(m.type, 'No Plan') as plan_name,
      COALESCE(m.duration, 'N/A') as duration,
      COALESCE(m.amount, 0) as plan_amount,
      COALESCE(p.status, 'Not Paid') as payment_status,
      p.payment_date,
      p.amount as payment_amount,
      CASE 
        WHEN r.expiry_date >= CURDATE() THEN 'Active'
        WHEN r.expiry_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() THEN 'Expiring Soon'
        ELSE 'Inactive'
      END as plan_status
    FROM register r
    LEFT JOIN membership m ON r.membership_id = m.membership_id
    LEFT JOIN payment p ON r.member_id = p.member_id
    WHERE r.member_id = ?
  `;
  
  db.query(query, [memberId], (err, results) => {
    if (err) {
      console.error("Error fetching member report:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    
    // Format dates
    const member = results[0];
    member.enrollment_date = member.enrollment_date ? 
      new Date(member.enrollment_date).toLocaleDateString('en-GB') : 'N/A';
    member.expiry_date = member.expiry_date ? 
      new Date(member.expiry_date).toLocaleDateString('en-GB') : 'N/A';
    member.payment_date = member.payment_date ? 
      new Date(member.payment_date).toLocaleDateString('en-GB') : 'N/A';
    member.dob = member.dob ? 
      new Date(member.dob).toLocaleDateString('en-GB') : 'N/A';
    
    res.json(member);
  });
});

module.exports = router;