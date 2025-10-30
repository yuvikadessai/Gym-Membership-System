const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/", (req, res) => {
  const query = `
    SELECT 
      CONCAT(t_fname, ' ', t_minit, '. ', t_lname) AS name,
      experience,
      phone,
      specialisation
    FROM trainer
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching trainers:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router; // ✅ now router is defined
