const express = require("express");
const router = express.Router();
const db = require("./db");
const { v4: uuidv4 } = require("uuid");

router.post("/", (req, res) => {
  const { plan_name, enrollment_date, expiry_date, amount, payment_method, transaction_id } = req.body;
  
  // ✅ Get member_id from session
  const member_id = req.session?.user?.member_id;
  
  if (!member_id) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }

  // ✅ Validate required fields
  if (!plan_name || !enrollment_date || !expiry_date || !amount || !payment_method) {
    console.log("Missing fields:", { plan_name, enrollment_date, expiry_date, amount, payment_method });
    return res.status(400).json({
      error: "Missing required fields",
      received: { plan_name, enrollment_date, expiry_date, amount, payment_method }
    });
  }

  // 1️⃣ Fetch membership_id from membership table using plan name
  db.query(
    "SELECT membership_id FROM membership WHERE type = ?",
    [plan_name],
    (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Database error fetching membership" });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: `Membership plan "${plan_name}" not found` });
      }

      const membership_id = results[0].membership_id;

      // 2️⃣ Update member table with membership_id, enrollment_date, expiry_date
      db.query(
        "UPDATE register SET membership_id = ?, enrollment_date = ?, expiry_date = ? WHERE member_id = ?",
        [membership_id, enrollment_date, expiry_date, member_id],
        (updateErr) => {
          if (updateErr) {
            console.error("Update Error:", updateErr);
            return res.status(500).json({ error: "Error updating member membership" });
          }

          // 3️⃣ Insert payment record
          const payment_id = "PAY" + uuidv4().slice(0, 6).toUpperCase();
          
          db.query(
            `INSERT INTO payment (payment_id, member_id, amount, payment_date, payment_method, status, transaction_id)
             VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
            [payment_id, member_id, amount, payment_method, "Completed", transaction_id || null],
            (paymentErr) => {
              if (paymentErr) {
                console.error("Payment Error:", paymentErr);
                return res.status(500).json({ error: "Error recording payment" });
              }

              res.status(201).json({
                message: "✅ Payment successful and membership updated!",
                payment_id,
                membership_id,
                member_id,
                plan_name
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;