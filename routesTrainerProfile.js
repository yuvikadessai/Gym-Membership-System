const express = require("express");
const router = express.Router();
const db = require("./db");

// ✅ Get assigned trainer details for logged-in member
router.get("/", (req, res) => {
  const member_id = req.session?.user?.member_id;

  if (!member_id) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }

  const query = `
    SELECT 
      r.assigned_trainer,
      t.t_fname,
      t.t_lname,
      t.experience,
      t.specialisation,
      t.email,
      t.phone
    FROM register r
    LEFT JOIN trainer t 
      ON r.assigned_trainer = CONCAT(t.t_fname, ' ', t.t_lname) 
    WHERE r.member_id = ?
  `;

  db.query(query, [member_id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching trainer details:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // 🟡 No trainer or no match found
    if (
      results.length === 0 ||
      !results[0].assigned_trainer ||
      results[0].assigned_trainer.toLowerCase() === "no trainer"
    ) {
      return res.json({ message: "No trainer assigned for this plan" });
    }

    const trainer = results[0];
    if (!trainer.t_fname) {
      return res.json({ message: "No trainer assigned for this plan" });
    }

    // 🟢 Trainer found
    res.json({
      name: `${trainer.t_fname} ${trainer.t_lname}`,
      experience: trainer.experience,
      specialisation: trainer.specialisation,
      email: trainer.email,
      phone: trainer.phone,
    });
  });
});

module.exports = router;
