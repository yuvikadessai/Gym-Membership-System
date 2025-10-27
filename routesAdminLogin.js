const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("bcryptjs");

// ✅ Admin Login Route
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Check if both fields are filled
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  // Check if admin exists
  db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    // If no matching admin found
    if (results.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const admin = results[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Success
    res.status(200).json({
      message: "Login successful",
      admin_id: admin.admin_id,
      name: admin.name,
      email: admin.email
    });
  });
});

module.exports = router;
