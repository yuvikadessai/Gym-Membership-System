const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("bcryptjs");

// ✅ Admin Registration Route
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    // Check if email already exists
    db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length > 0)
        return res.status(400).json({ message: "Email already registered" });

      // Generate Admin ID (ADM001, ADM002, etc.)
      db.query("SELECT admin_id FROM admin ORDER BY admin_id DESC LIMIT 1", async (err, rows) => {
        if (err) return res.status(500).json({ message: "Error generating admin ID" });

        let newId = "ADM001";
        if (rows.length > 0) {
          const lastId = rows[0].admin_id; // e.g. ADM005
          const num = parseInt(lastId.replace("ADM", "")) + 1;
          newId = "ADM" + num.toString().padStart(3, "0");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin data
        db.query(
          "INSERT INTO admin (admin_id, name, email, password) VALUES (?, ?, ?, ?)",
          [newId, name, email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json({ message: "Database insertion error" });
            res.status(200).json({ message: "Admin registered successfully!", admin_id: newId });
          }
        );
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
