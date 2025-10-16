const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/payment", (req, res) => {
    const { plan_name,plan_price, payment_mode, transaction_id } = req.body;

    const sql = `
        INSERT INTO payments (plan_name, plan_price, payment_mode, transaction_id)
        VALUES (?, ?, ?, ?)
    `;

    const values = [plan_name, plan_price, payment_mode, transaction_id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.send(`<h2>Payment Saved Successfully!</h2><a href="homepage.html">Go Back Home</a>`);
    });
});

module.exports = router;