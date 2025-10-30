/*const express = require("express");
const router = express.Router();
const db = require("./db");

console.log("✅ Dashboard route file loaded!");

// Get member dashboard data with ALL subscriptions
router.get("/", (req, res) => {
  console.log("📊 Dashboard route accessed!");
  
  const member_id = req.session?.user?.member_id;
  console.log("Member ID from session:", member_id);

  if (!member_id) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }

  // First, get member basic info
  const memberQuery = `
    SELECT firstName, lastName, email, phone
    FROM register
    WHERE member_id = ?
  `;

  db.query(memberQuery, [member_id], (err, memberResults) => {
    if (err) {
      console.error("Member fetch error:", err);
      return res.status(500).json({ error: "Error fetching member data" });
    }

    if (memberResults.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    const memberData = memberResults[0];

    // Then get ALL payment records with membership details
    const subscriptionsQuery = `
      SELECT 
        p.payment_id,
        p.amount,
        p.payment_date,
        p.status AS payment_status,
        r.enrollment_date,
        r.expiry_date,
        m.type AS membership_type,
        m.duration,
        m.price AS membership_price,
        m.membership_id
      FROM payment p
      INNER JOIN register r ON p.member_id = r.member_id
      LEFT JOIN membership m ON r.membership_id = m.membership_id
      WHERE p.member_id = ?
      ORDER BY p.payment_date DESC
    `;

    db.query(subscriptionsQuery, [member_id], (subErr, subResults) => {
      if (subErr) {
        console.error("Subscriptions fetch error:", subErr);
        return res.status(500).json({ error: "Error fetching subscriptions" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Process each subscription to determine status
      const subscriptions = subResults.map(sub => {
        let status = "Inactive";
        
        if (sub.enrollment_date && sub.expiry_date) {
          const startDate = new Date(sub.enrollment_date);
          const endDate = new Date(sub.expiry_date);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          if (today >= startDate && today <= endDate) {
            status = "Active";
          } else if (today > endDate) {
            status = "Expired";
          } else if (today < startDate) {
            status = "Inactive"; // Future subscription
          }
        }

        return {
          payment_id: sub.payment_id,
          membership_type: sub.membership_type,
          duration: sub.duration,
          price: sub.membership_price,
          amount_paid: sub.amount,
          payment_date: sub.payment_date,
          enrollment_date: sub.enrollment_date,
          expiry_date: sub.expiry_date,
          status: status
        };
      });

      // Find active subscription
      const activeSubscription = subscriptions.find(s => s.status === "Active");

      res.json({
        name: `${memberData.firstName} ${memberData.lastName}`,
        email: memberData.email,
        phone: memberData.phone,
        subscriptions: subscriptions,
        active_subscription: activeSubscription || null
      });
    });
  });
});

module.exports = router; */

const express = require("express");
const router = express.Router();
const db = require("./db");

console.log("✅ Dashboard route file loaded!");

// Get member dashboard data with ALL subscriptions
router.get("/", (req, res) => {
  console.log("📊 Dashboard route accessed!");

  const member_id = req.session?.user?.member_id;
  console.log("Member ID from session:", member_id);

  if (!member_id) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }

  // First, get member basic info + assigned trainer
  const memberQuery = `
    SELECT firstName, lastName, email, phone, assigned_trainer
    FROM register
    WHERE member_id = ?
  `;

  db.query(memberQuery, [member_id], (err, memberResults) => {
    if (err) {
      console.error("Member fetch error:", err);
      return res.status(500).json({ error: "Error fetching member data" });
    }

    if (memberResults.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    const memberData = memberResults[0];

    // Then get ALL payment records with membership details
    const subscriptionsQuery = `
      SELECT 
        p.payment_id,
        p.amount,
        p.payment_date,
        p.status AS payment_status,
        r.enrollment_date,
        r.expiry_date,
        m.type AS membership_type,
        m.duration,
        m.price AS membership_price,
        m.membership_id
      FROM payment p
      INNER JOIN register r ON p.member_id = r.member_id
      LEFT JOIN membership m ON r.membership_id = m.membership_id
      WHERE p.member_id = ?
      ORDER BY p.payment_date DESC
    `;

    db.query(subscriptionsQuery, [member_id], (subErr, subResults) => {
      if (subErr) {
        console.error("Subscriptions fetch error:", subErr);
        return res.status(500).json({ error: "Error fetching subscriptions" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Process each subscription to determine status
      const subscriptions = subResults.map(sub => {
        let status = "Inactive";

        if (sub.enrollment_date && sub.expiry_date) {
          const startDate = new Date(sub.enrollment_date);
          const endDate = new Date(sub.expiry_date);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          if (today >= startDate && today <= endDate) {
            status = "Active";
          } else if (today > endDate) {
            status = "Expired";
          } else if (today < startDate) {
            status = "Inactive"; // Future subscription
          }
        }

        return {
          payment_id: sub.payment_id,
          membership_type: sub.membership_type,
          duration: sub.duration,
          price: sub.membership_price,
          amount_paid: sub.amount,
          payment_date: sub.payment_date,
          enrollment_date: sub.enrollment_date,
          expiry_date: sub.expiry_date,
          status: status
        };
      });

      // Find active subscription
      const activeSubscription = subscriptions.find(s => s.status === "Active");

      res.json({
        name: `${memberData.firstName} ${memberData.lastName}`,
        email: memberData.email,
        phone: memberData.phone,
        assigned_trainer: memberData.assigned_trainer || "Assigned Soon",
        subscriptions: subscriptions,
        active_subscription: activeSubscription || null
      });
    });
  });
});

module.exports = router;
