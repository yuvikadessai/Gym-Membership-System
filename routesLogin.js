const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");
const router = express.Router();
const session = require("express-session");

// Login
router.post("/", (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    db.query("SELECT * FROM register WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.length === 0) return res.status(404).json({ error: "User not registered" });

        const user = result[0];

        // Compare hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error comparing passwords" });
            if (!isMatch) return res.status(401).json({ error: "Invalid password" });

            // ✅ Login successful, send user info
            res.json({
                message: "✅ Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstname} ${user.lastname}`
                }
            });
        });
    });
});

module.exports = router;