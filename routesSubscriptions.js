/*const express = require("express");
const router = express.Router();
const db = require("./db");

// Generate new membership ID automatically (MEM001, MEM002, ...)
function generateMembershipId(callback) {
  const q = "SELECT membership_id FROM membership ORDER BY membership_id DESC LIMIT 1"; // ✅ pick last inserted
  db.query(q, (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, "MEM001");

    const lastId = results[0].membership_id;
    const num = parseInt(lastId.replace("MEM", "")) + 1;
    const newId = "MEM" + String(num).padStart(3, "0");
    callback(null, newId);
  });
}

// ✅ Admin adds new plan
router.post("/", (req, res) => {
  const { type, duration, price } = req.body;

  if (!type || !duration || !price) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  generateMembershipId((err, newId) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error generating ID" });
    }

    const query = "INSERT INTO membership (membership_id, type, duration, price) VALUES (?, ?, ?, ?)";
    db.query(query, [newId, type, duration, price], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      res.json({ success: true, message: "Plan added successfully!" });
    });
  });
});

// ✅ Fetch all plans (for members)
router.get("/", (req, res) => {
  const query = "SELECT * FROM membership";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching data" });
    res.json(results);
  });
});


router.put("/update", (req, res) => {
  const { type, price } = req.body;

  if (!type || !price) {
    return res.status(400).json({ message: "Type and price are required" });
  }

  const query = "UPDATE membership SET price = ? WHERE type = ?";
  db.query(query, [price, type], (err, result) => {
    if (err) {
      console.error("Error updating plan:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "✅ Plan updated successfully!" });
  });
});

module.exports = router;
*/

const express = require("express");
const router = express.Router();
const db = require("./db");

// Generate new membership ID automatically (MEM001, MEM002, ...)
function generateMembershipId(callback) {
  const q = "SELECT membership_id FROM membership ORDER BY membership_id DESC LIMIT 1";
  db.query(q, (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, "MEM001");

    const lastId = results[0].membership_id;
    const num = parseInt(lastId.replace("MEM", "")) + 1;
    const newId = "MEM" + String(num).padStart(3, "0");
    callback(null, newId);
  });
}

// ✅ Admin adds new plan (with description)
router.post("/", (req, res) => {
  const { type, duration, price, description } = req.body;

  if (!type || !duration || !price || !description) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  generateMembershipId((err, newId) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error generating ID" });
    }

    const query = `
      INSERT INTO membership (membership_id, type, duration, price, description)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [newId, type, duration, price, description], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      res.json({ success: true, message: "✅ Plan added successfully!" });
    });
  });
});

// ✅ Fetch all plans (for members)
router.get("/", (req, res) => {
  const query = "SELECT * FROM membership";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching data" });
    res.json(results);
  });
});

// ✅ Update plan (name, price, and description)
router.put("/update", (req, res) => {
  const { oldType, newType, price, description } = req.body;

  if (!oldType || !newType || !price || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    UPDATE membership 
    SET type = ?, price = ?, description = ?
    WHERE type = ?
  `;

  db.query(query, [newType, price, description, oldType], (err, result) => {
    if (err) {
      console.error("Error updating plan:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "✅ Plan updated successfully!" });
  });
});


// ✅ Delete a plan
router.delete("/:membership_id", (req, res) => {
  const { membership_id } = req.params;

  if (!membership_id) {
    return res.status(400).json({ message: "Membership ID is required" });
  }

  // Step 1: Unlink plan from members who are using it
  const unlinkMembers = "UPDATE register SET membership_id = NULL WHERE membership_id = ?";
  db.query(unlinkMembers, [membership_id], (unlinkErr) => {
    if (unlinkErr) {
      console.error("❌ Error unlinking members:", unlinkErr);
      return res.status(500).json({ message: "Error while unlinking members" });
    }

    // Step 2: Delete plan from membership table
    const deleteQuery = "DELETE FROM membership WHERE membership_id = ?";
    db.query(deleteQuery, [membership_id], (deleteErr, result) => {
      if (deleteErr) {
        console.error("❌ Error deleting plan:", deleteErr);
        return res.status(500).json({ message: "Database error while deleting plan" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Plan not found" });
      }

      res.json({ success: true, message: "✅ Plan deleted successfully!" });
    });
  });
});

module.exports = router;
