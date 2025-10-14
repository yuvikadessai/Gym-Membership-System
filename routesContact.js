const express = require("express");
const db = require("./db");
const router = express.Router();
const nodemailer = require("nodemailer");

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS ? "PASS OK" : "PASS MISSING");

// GET all contacts
router.get("/", (req, res) => {
    db.query("SELECT * FROM contacts", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// POST a new contact
router.post("/", (req, res) => {
    console.log(req.body);
    const { full_name, email, phone_no, message } = req.body;

    if (!full_name || !email || !phone_no) {
        return res.status(400).json({ error: "Name, email, and phone number are required" });
    }

    db.query(
        "INSERT INTO contacts (full_name, email, phone_no, message) VALUES (?, ?, ?, ?)",
        [full_name, email, phone_no, message],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,  // your Gmail
                to: process.env.EMAIL_USER,    // receive feedback here
                subject: `Feedback from ${full_name}`,
                text: `Name: ${full_name}\nEmail: ${email}\nPhone: ${phone_no}\nMessage: ${message}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Email error: ", error);
                    // Respond successfully anyway
                    return res.json({ 
                        message: "Contact saved, but email could not be sent", 
                        id: result.insertId 
                    });
                }

                console.log("Email sent: ", info.response);
                res.json({ message: "Contact added successfully", id: result.insertId });
            });
        }
    );
});

module.exports = router;
