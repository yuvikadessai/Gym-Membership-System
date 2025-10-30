const express = require("express");
const router = express.Router();
const db = require("./db");

// ✅ Payment Dashboard Route (shows members even without payments)
router.get("/", (req, res) => {
  console.log("📥 /paymentdash route hit");

  const query = `
    SELECT 
      r.firstName,
      r.lastName,
      m.type AS planName,
      IFNULL(p.amount, 0) AS amount,
      IFNULL(p.status, 'Not Paid') AS status
    FROM register r
    LEFT JOIN membership m ON r.membership_id = m.membership_id
    LEFT JOIN payment p ON r.member_id = p.member_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ SQL Error:", err.sqlMessage || err);
      return res.status(500).json({ error: err.sqlMessage || "Database error" });
    }

    console.log("✅ Payments fetched successfully:", results.length);
    res.status(200).json(results);
  });
});

module.exports = router;
