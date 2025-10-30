/*const express = require("express");
const router = express.Router();
const db = require("./db");

// ✅ Fetch all members with plan, duration, payment, trainer info
router.get("/", (req, res) => {
  const query = `
    SELECT 
      r.member_id,
      r.firstName,
      r.gender,
      COALESCE(m.type, 'No Plan Selected') AS plan,
      COALESCE(m.duration, '-') AS duration,
      COALESCE(p.status, 'Unpaid') AS payment_status,
      COALESCE(r.assigned_trainer, 'Not Assigned') AS trainer
    FROM register r
    LEFT JOIN membership m ON r.membership_id = m.membership_id
    LEFT JOIN payment p ON r.member_id = p.member_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching members:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Assign trainer
router.post("/assign-trainer", (req, res) => {
  const { member_id, trainer_name } = req.body;

  const query = "UPDATE register SET assigned_trainer = ? WHERE member_id = ?";
  db.query(query, [trainer_name, member_id], (err) => {
    if (err) {
      console.error("❌ Error assigning trainer:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "✅ Trainer assigned successfully" });
  });
});

module.exports = router; */

const express = require("express");
const router = express.Router();
const db = require("./db");

// ✅ Fetch all members with plan, duration, payment, trainer info
router.get("/", (req, res) => {
  const query = `
    SELECT 
      r.member_id,
      r.firstName,
      r.gender,
      COALESCE(m.type, 'No Plan Selected') AS plan,
      COALESCE(m.duration, '-') AS duration,
      COALESCE(p.status, 'Unpaid') AS payment_status,
      COALESCE(r.assigned_trainer, 'Assigned soon') AS trainer
    FROM register r
    LEFT JOIN membership m ON r.membership_id = m.membership_id
    LEFT JOIN payment p ON r.member_id = p.member_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching members:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Assign or update trainer
router.post("/assign-trainer", (req, res) => {
  let { member_id, trainer_name } = req.body;

  // Trim and normalize trainer_name
  trainer_name = trainer_name ? trainer_name.trim() : "";

  if (!trainer_name) {
    trainer_name = "Assigned soon"; // Default if empty
  } else if (trainer_name.toLowerCase() === "no trainer") {
    trainer_name = "No Trainer";
  }

  const query = "UPDATE register SET assigned_trainer = ? WHERE member_id = ?";
  db.query(query, [trainer_name, member_id], (err) => {
    if (err) {
      console.error("❌ Error assigning trainer:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: `✅ Trainer status updated to '${trainer_name}'` });
  });
});

module.exports = router;

