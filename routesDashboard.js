const express = require("express");
const router = express.Router();
const db = require("./db");

console.log("✅ Dashboard route file loaded!");

// Get member dashboard data
router.get("/", (req, res) => {
  console.log("📊 Dashboard route accessed!");
  
  const member_id = req.session?.user?.member_id;
  console.log("Member ID from session:", member_id);

  if (!member_id) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }

  // Fetch member details with membership and payment info
  const query = `
    SELECT 
      r.member_id,
      r.firstName,
      r.lastName,
      r.email,
      r.phone,
      r.enrollment_date,
      r.expiry_date,
      m.type AS membership_type,
      m.duration,
      m.price AS membership_price,
      p.amount AS last_payment_amount,
      p.payment_date AS last_payment_date,
      p.status AS payment_status
    FROM register r
    LEFT JOIN membership m ON r.membership_id = m.membership_id
    LEFT JOIN payment p ON r.member_id = p.member_id
    WHERE r.member_id = ?
    ORDER BY p.payment_date DESC
    LIMIT 1
  `;

  db.query(query, [member_id], (err, results) => {
    if (err) {
      console.error("Dashboard Error:", err);
      return res.status(500).json({ error: "Error fetching dashboard data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    const memberData = results[0];
    console.log("Member data fetched:", memberData);

    // Calculate membership status
    let membershipStatus = "Inactive";
    if (memberData.expiry_date) {
      const expiryDate = new Date(memberData.expiry_date);
      const today = new Date();
      membershipStatus = expiryDate >= today ? "Active" : "Expired";
    }

    // Send response in the format frontend expects
    res.json({
      name: `${memberData.firstName} ${memberData.lastName}`,
      email: memberData.email,
      phone: memberData.phone,
      membership: {
        type: memberData.membership_type,
        exp_date: memberData.expiry_date,
        start_date: memberData.enrollment_date,
        duration: memberData.duration,
        price: memberData.membership_price,
        status: membershipStatus
      },
      payment: {
        last_amount: memberData.last_payment_amount,
        last_date: memberData.last_payment_date,
        status: memberData.payment_status
      }
    });
  });
});

module.exports = router;