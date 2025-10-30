// routesAdminMembers.js
const express = require("express");
const router = express.Router();
const db = require("./db");

// GET all members
router.get("/", (req, res) => {
  // You can add authentication check here if needed (to ensure only admin can access)
  const query = "SELECT member_id, firstName,lastName, email, phone, membership_id, enrollment_date, expiry_date FROM register";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching members:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(results); // send all member data to frontend
  });
});

module.exports = router;
