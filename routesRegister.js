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
  
    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).send({ error: "Error hashing password" });
  
      // Step 1: Insert new user WITHOUT member_id
      db.query(
        "INSERT INTO register (firstname, lastname, dob, email, phone, gender, password, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [firstname, lastname, dob, email, phone, gender, hashedPassword, address],
        (err, result) => {
            console.error("Database Error:", err); 
          if (err) return res.status(500).send({ error: "Database Error" });
  
          console.log("Inserted ID:", result.insertId); // ✅ Debugging
  
          if (!result.insertId) {
            return res.status(500).send({ error: "Failed to get insert ID" });
          }
  
          // Step 2: Generate member ID
          const memberId = `FIT${String(result.insertId).padStart(3, "0")}`;
  
          // Step 3: Update the same row with member_id
          db.query(
            "UPDATE register SET member_id = ? WHERE id = ?",
            [memberId, result.insertId],
            (updateErr, updateResult) => {
              if (updateErr) return res.status(500).send({ error: "Error adding member ID" });
  
              console.log("Update result:", updateResult); // ✅ Debugging
  
              if (updateResult.affectedRows === 0) {
                return res.status(500).send({ error: "Failed to update member ID" });
              }
  
              // Step 4: Success response
              res.send(`✅ User registered successfully! Member ID: ${memberId}`);
            }
          );
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
 