const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const db = require("./db");
const router = express.Router();
const bcrypt = require("bcrypt");

// Get all records
router.get("/", (req, res) => {
    db.query("SELECT * FROM login", (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(result);
    });
});

// Insert new record
router.post("/", (req, res) => {
    const { email, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "Error hashing password" });

        db.query("INSERT INTO login (email, password) VALUES(?, ?)", [email, hashedPassword], (err, result) => {
            if (err) return res.status(400).json({ error: "Database Error" });
            res.status(201).json({ message: "User added successfully" });
        });
    });
});

// Get by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM login WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(result[0]);
    });
});

// Update record
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;

    if (password) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: "Error hashing password" });

            db.query("UPDATE login SET email=?, password=? WHERE id=?", [email, hashedPassword, id], (err, result) => {
                if (err) return res.status(500).json({ error: "Database error" });
                res.json({ message: "User updated successfully" });
            });
        });
    } else {
        db.query("UPDATE login SET email=? WHERE id=?", [email, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "User updated successfully" });
        });
    }
});

// Delete record
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM login WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "User deleted successfully" });
    });
});

module.exports = router;
