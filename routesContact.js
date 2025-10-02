const express = require("express");
const db = require("./db");  // removed extra space after db
const router = express.Router();

// GET all contacts
router.get("/", (req, res) => {
    db.query("SELECT * FROM contacts", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// POST a new contact
router.post("/", (req, res) => {
    const { full_name, email, phone_no, message } = req.body;

    if (!full_name || !email || !phone_no) {
        return res.status(400).json({ error: "Name, email, and phone number are required" });
    }

    db.query(
        "INSERT INTO contacts (full_name, email, phone_no, message) VALUES (?, ?, ?, ?)",
        [full_name, email, phone_no, message],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Contact added successfully", id: result.insertId });
        }
    );
});

module.exports = router;
