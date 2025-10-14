const express = require("express");
const router = express.Router();
const session = require("express-session");
const db = require("../db"); // make sure this points to your DB connection file

// Middleware: only allow logged-in users
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).json({ error: "Please log in first" });
  }
}


router.post("/make-payment", isAuthenticated, (req, res) => {
  const { plan_name, amount } = req.body;
  const userId = req.session.user.id;

  // Store payment details
  const query = `
    INSERT INTO payments (user_id, plan_name, amount, payment_date, expiry_date)
    VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))
    ON DUPLICATE KEY UPDATE 
      plan_name = VALUES(plan_name), 
      amount = VALUES(amount), 
      payment_date = NOW(),
      expiry_date = DATE_ADD(NOW(), INTERVAL 30 DAY)
  `;

  db.query(query, [userId, plan_name, amount], (err, result) => {
    if (err) {
      console.error("Payment DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: `Payment successful for ${plan_name} plan!` });
  });
});


router.get("/my-payment", isAuthenticated, (req, res) => {
  const userId = req.session.user.id;

  db.query(
    "SELECT * FROM payments WHERE user_id = ? ORDER BY payment_date DESC LIMIT 1",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ payment: result[0] || null });
    }
  );
});

module.exports = router;
