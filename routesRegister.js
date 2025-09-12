const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");
const router = express.Router();

// Get all registered users
router.get("/", (req, res) => {
    db.query("SELECT * FROM register", (err, result) => {
        if (err) return res.status(400).send({ error: err.message });
        res.json(result);
    });
});

// Register new user
router.post("/", (req, res) => {
    const { firstname, lastname, dob, email, phone, gender, password, address } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send({ error: "Error hashing password" });

        db.query(
            "INSERT INTO register (firstname, lastname, dob, email, phone, gender, password, address) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
            [firstname, lastname, dob, email, phone, gender, hashedPassword, address],
            (err) => {
                if (err) return res.status(500).send({ error:"Databse Error" });
                res.send("✅ User registered successfully!");
            }
        );
    });
});

// Get registered user by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM register WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(400).send({ error: err.message });
        if (result.length === 0) return res.status(404).send("User not found");
        res.json(result[0]);
    });
});

// Update registered user
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, dob, email, phone, gender, password, address } = req.body;

    if (password) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).send("Error hashing password");

            const sql = `UPDATE register 
                         SET firstname=?, lastname=?, dob=?, email=?, phone=?, gender=?, password=?, address=? 
                         WHERE id=?`;

            db.query(sql, [firstname, lastname, dob, email, phone, gender, hashedPassword, address, id], (err) => {
                if (err) return res.status(500).send("Database error");
                res.send("✅ User updated successfully!");
            });
        });
    } else {
        const sql = `UPDATE register 
                     SET firstname=?, lastname=?, dob=?, email=?, phone=?, gender=?, address=? 
                     WHERE id=?`;

        db.query(sql, [firstname, lastname, dob, email, phone, gender, address, id], (err) => {
            if (err) return res.status(500).send("Database error");
            res.send("✅ User updated successfully (without password change)!");
        });
    }
});

// Delete registered user
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM register WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send("Database error");
        if (result.affectedRows === 0) return res.status(404).send("User not found");
        res.send("✅ User deleted successfully!");
    });
});

module.exports = router;
 