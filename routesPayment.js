const express = require("express");
const router = express.Router();
const db = require("./db");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();


router.post("/", (req, res) => {
  const {
    plan_name,
    enrollment_date,
    expiry_date,
    amount,
    payment_method,
    transaction_id,
  } = req.body;

  // ✅ Get member_id from session
  const member_id = req.session?.user?.member_id;

  if (!member_id) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }

  // ✅ Validate required fields
  if (!plan_name || !enrollment_date || !expiry_date || !amount || !payment_method) {
    console.log("Missing fields:", {
      plan_name,
      enrollment_date,
      expiry_date,
      amount,
      payment_method,
    });
    return res.status(400).json({
      error: "Missing required fields",
      received: { plan_name, enrollment_date, expiry_date, amount, payment_method },
    });
  }

  // 1️⃣ Fetch membership_id from membership table using plan name
  db.query("SELECT membership_id FROM membership WHERE type = ?", [plan_name], (err, results) => {
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

            // ✅ 4️⃣ Fetch member email + name for confirmation mail
            db.query(
              "SELECT firstName, email FROM register WHERE member_id = ?",
              [member_id],
              async (emailErr, memberResult) => {
                if (emailErr || memberResult.length === 0) {
                  console.error("Email Fetch Error:", emailErr);
                  return res.status(500).json({ error: "Error fetching member email" });
                }

                const { name, email } = memberResult[0];

                // ✅ 5️⃣ Send payment confirmation email
                try {
                  const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: process.env.EMAIL_USER,
                      pass: process.env.EMAIL_PASS,
                    },
                  });


                  const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "🎉 FitHUB - Payment Successful!",
                    html: `
                      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                        <h2>Hi ${name},</h2>
                        <p>We're happy to let you know that your payment was successful!</p>
                        <hr>
                        <p><strong>Plan:</strong> ${plan_name}</p>
                        <p><strong>Amount Paid:</strong> ₹${amount}</p>
                        <p><strong>Payment Method:</strong> ${payment_method}</p>
                        <p><strong>Transaction ID:</strong> ${transaction_id || "N/A"}</p>
                        <p><strong>Enrollment Date:</strong> ${enrollment_date}</p>
                        <p><strong>Expiry Date:</strong> ${expiry_date}</p>
                        <hr>
                        <p>Thank you for joining <strong>FitHUB</strong> 💪<br>Let’s crush your fitness goals together!</p>
                        <p>– Team FitHUB</p>
                      </div>
                    `,
                  };

                  await transporter.sendMail(mailOptions);
                } catch (mailErr) {
                  console.error("Email Error:", mailErr);
                }

                // ✅ 6️⃣ Send final success response
                res.status(201).json({
                  message: "✅ Payment successful and confirmation email sent!",
                  payment_id,
                  membership_id,
                  member_id,
                  plan_name,
                });
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;
