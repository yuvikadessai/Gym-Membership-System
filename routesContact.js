const express = require("express");
const db = require("./db");  // removed extra space after db
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

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
                service : "gmail",
                auth: {
                    user : process.env.EMAIL_USER,
                    pass : process.env.EMAIL_PASS
                },
            });

            const mailOptions = {
                from : email,
                to : process.env.EMAIL_USER,
                subject : `Feeback from ${full_name}`,
                text: `Name: ${full_name}\nEmail: ${email}\nPhone: ${phone_no}\nMessage: ${message}`,
            };

            transporter.sendMail(mailOptions, (error, info)=> {
                if(error){
                    console.log(error);
                    return res.status(500).json({error: "Message saved but email not sent"});
                }
            })

            res.json({ message: "Contact added successfully", id: result.insertId });
        }
    );
});

module.exports = router;
