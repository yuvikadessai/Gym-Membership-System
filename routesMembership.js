const express = require("express");
const router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

// ✅ Add a new plan
router.post("/add", (req, res) => {
  const { type, duration, price } = req.body;
  const membership_id = uuidv4();

  const sql = `
    INSERT INTO membership (membership_id, type, duration, price)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [membership_id, type, duration, price], (err, result) => {
    if (err) {
      console.error("Error adding plan:", err);
      return res.status(500).json({ message: "Failed to add plan" });
    }
    res.json({ success: true, message: "Plan added successfully!" });
  });
});

// ✅ Fetch all plans (to display in Admin Dashboard)
router.get("/all", (req, res) => {
  db.query("SELECT * FROM membership", (err, results) => {
    if (err) {
      console.error("Error fetching plans:", err);
      return res.status(500).json({ message: "Failed to fetch plans" });
    }
    res.json(results);
  });
});

module.exports = router;
