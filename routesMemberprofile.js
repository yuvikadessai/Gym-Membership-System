const express = require('express');
const db = require("./db");
const router = express.Router();

router.post("/", (req,res)=>{
    if(!req.session.user){
        return res.status(401).json({ error: "Not logged in" });
    }

    const member_id = req.session.user.member_id;
    const {firstName, lastName, email, phone, dob, gender, address} = req.body;

    const sql = `UPDATE register SET firstName = ?, lastName = ?, email = ?, phone = ?, dob = ?, gender = ?, address = ?
    WHERE member_id = ?`;

    db.query(sql, [firstName, lastName, email, phone, dob, gender, address,member_id], (err,result) => {
        console.log("SQL Error:", err); 
        if (err) return res.status(500).json({ error: "Database error" });

        req.session.user.firstname = firstName;
        req.session.user.lastName = lastName;   // from req.body.lastName
        req.session.user.email = email;
        req.session.user.phone = phone;
        req.session.user.dob = dob;
        req.session.user.gender = gender;
        req.session.user.address = address;

        res.json({ success: true });
    });
});


module.exports = router;