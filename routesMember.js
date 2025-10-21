const express = require("express");
const router = express.Router();
const db = require("./db");


router.get("/", (req, res) => {
    if(!req.session.user){
        return res.status(401).json({ error: "Not logged in" });
    }
const member_id = req.session.user.member_id;

const sql = "SELECT * FROM register WHERE member_id=?";
db.query(sql,[member_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if(results.length === 0)
        return res.status(404).json({ error: "Member not found" });

    res.json(results[0]);
});
});

module.exports = router;