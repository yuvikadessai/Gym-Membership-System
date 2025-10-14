const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");
const router = express.Router();
const session = require("express-session");

// ---------------- LOGIN ----------------

// Get all login records
router.get("/", (req, res) => {
    db.query("SELECT * FROM login", (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(result);
    });
});

// Login
router.post("/", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM register WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.length === 0) return res.status(404).json({ error: "User not registered" });

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error comparing passwords" });
            if (!isMatch) return res.status(401).json({ error: "Invalid password" });

            req.session.user = {
                id: user.if,
                email: user.email,
                full_name: user.full_name
            };

            const insertLogin =`INSERT INTO login (email,password, login_time) VALUES (?,?, NOW())
            ON DUPLICATE KEY UPDATE login_time = NOW()`;
            db.query(insertLogin, [email, user.password], (err2) => {
                if (err2) {
                    console.log("Insert Error: ", err2);
                    return res.status(500).json({ error: err2.sqlMessage });
            }
                res.json({
                    message: "✅ Login successful",
                    user: { id: user.id, email: user.email }
                });
            });
        });
    });
});

// Get login record by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM login WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(result[0]);
    });
});

// Delete login record
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM login WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Login record deleted successfully" });
    });
});

function isAuthenticated(req, res, next){
    if(req.session.user){
        return next();
    }
    else{
        res.status(401).json({error: "You must login first"});
    }
}


module.exports = router;
