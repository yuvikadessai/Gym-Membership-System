// routesAdminDashboard.js - Enhanced Dashboard with All Stats
/*const express = require("express");
const router = express.Router();
const db = require("./db");

// 📊 GET Dashboard Stats
router.get("/", (req, res) => {
  console.log("📊 Dashboard route hit");
  
  // First, check if expiry_date column exists
  db.query("SHOW COLUMNS FROM register LIKE 'expiry_date'", (err, columnCheck) => {
    if (err) {
      console.error("Error checking columns:", err);
      return res.status(500).json({ error: "Database error checking columns" });
    }
    
    const hasExpiryDate = columnCheck && columnCheck.length > 0;
    console.log("Has expiry_date column:", hasExpiryDate);
    
    const data = {};

    const queries = {
      // Total counts
      trainers: "SELECT COUNT(*) AS total_trainers FROM trainer",
      totalMembers: "SELECT COUNT(*) AS total_members FROM register",
      memberships: "SELECT COUNT(*) AS total_memberships FROM membership",
      
      // Gender distribution
      gender: "SELECT gender, COUNT(*) AS count FROM register GROUP BY gender",
      
      // Monthly members joined (Bar Chart Data)
      monthly: `
        SELECT 
          DATE_FORMAT(enrollment_date, '%b %Y') AS month,
          COUNT(*) AS count
        FROM register
        WHERE enrollment_date IS NOT NULL
        GROUP BY DATE_FORMAT(enrollment_date, '%b %Y')
        ORDER BY MIN(enrollment_date)
        LIMIT 12
      `,
      
      // Payment status (Pie Chart Data)
      payments: `
        SELECT 
          COALESCE(status, 'Unpaid') as status,
          COUNT(*) AS count
        FROM payment
        GROUP BY status
      `,
      
      // Membership status - conditional based on column existence
      membershipStatus: hasExpiryDate ? `
        SELECT 
          CASE 
            WHEN expiry_date IS NULL THEN 'inactive'
            WHEN expiry_date >= CURDATE() THEN 'active'
            WHEN expiry_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() THEN 'expiring'
            ELSE 'inactive'
          END as status,
          COUNT(*) AS count
        FROM register
        GROUP BY 
          CASE 
            WHEN expiry_date IS NULL THEN 'inactive'
            WHEN expiry_date >= CURDATE() THEN 'active'
            WHEN expiry_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() THEN 'expiring'
            ELSE 'inactive'
          END
      ` : `
        SELECT 'active' as status, COUNT(*) as count FROM register
        UNION ALL SELECT 'inactive' as status, 0 as count
        UNION ALL SELECT 'expiring' as status, 0 as count
      `,
      
      // Active memberships
      activeMemberships: hasExpiryDate ? `
        SELECT COUNT(*) AS active
        FROM register
        WHERE expiry_date >= CURDATE()
      ` : `SELECT COUNT(*) AS active FROM register`,
      
      // Expiring soon (within 7 days)
      expiringSoon: hasExpiryDate ? `
        SELECT COUNT(*) AS expiring
        FROM register
        WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      ` : `SELECT 0 AS expiring`
    };

    // Run all queries in parallel
    Promise.all(
      Object.entries(queries).map(([key, sql]) =>
        new Promise((resolve, reject) => {
          db.query(sql, (err, result) => {
            if (err) {
              console.error(`Error in query ${key}:`, err);
              reject(err);
            } else {
              resolve({ key, result });
            }
          });
        })
      )
    )
      .then((results) => {
        results.forEach(({ key, result }) => {
          data[key] = result;
        });

        // Format membership status data
        const membershipStatus = {
          active: 0,
          inactive: 0,
          expiring: 0
        };
        
        if (data.membershipStatus && data.membershipStatus.length > 0) {
          data.membershipStatus.forEach(row => {
            membershipStatus[row.status] = row.count;
          });
        }

        console.log("Membership status formatted:", membershipStatus);

        // ✅ Send formatted response
        const response = {
          total_trainers: data.trainers[0].total_trainers,
          total_members: data.totalMembers[0].total_members,
          total_memberships: data.memberships[0].total_memberships,
          gender: data.gender,
          monthly: data.monthly,
          payments: data.payments,
          membership_status: membershipStatus,
          active_members: data.activeMemberships[0].active,
          expiring_soon: data.expiringSoon[0].expiring
        };

        console.log("✅ Dashboard data prepared successfully");
        res.json(response);
      })
      .catch((err) => {
        console.error("❌ Dashboard fetch error:", err);
        res.status(500).json({ error: "Database query failed", details: err.message });
      });
  });
});

module.exports = router;
*/

// routesAdminDashboard.js - Enhanced Dashboard with All Stats
const express = require("express");
const router = express.Router();
const db = require("./db");

// 📊 GET Dashboard Stats
router.get("/", (req, res) => {
  console.log("📊 Dashboard route hit");
  
  // First, check if expiry_date column exists
  db.query("SHOW COLUMNS FROM register LIKE 'expiry_date'", (err, columnCheck) => {
    if (err) {
      console.error("Error checking columns:", err);
      return res.status(500).json({ error: "Database error checking columns" });
    }
    
    const hasExpiryDate = columnCheck && columnCheck.length > 0;
    console.log("Has expiry_date column:", hasExpiryDate);
    
    const data = {};

    const queries = {
      // Total counts
      trainers: "SELECT COUNT(*) AS total_trainers FROM trainer",
      totalMembers: "SELECT COUNT(*) AS total_members FROM register",
      memberships: "SELECT COUNT(*) AS total_memberships FROM membership",
      
      // Gender distribution
      gender: "SELECT gender, COUNT(*) AS count FROM register GROUP BY gender",
      
      // Monthly members joined (Bar Chart Data)
      monthly: `
        SELECT 
          DATE_FORMAT(enrollment_date, '%b %Y') AS month,
          COUNT(*) AS count
        FROM register
        WHERE enrollment_date IS NOT NULL
        GROUP BY DATE_FORMAT(enrollment_date, '%b %Y')
        ORDER BY MIN(enrollment_date)
        LIMIT 12
      `,
      
      // Payment status (Pie Chart Data) - Completed, Pending, Not Paid
      payments: `
        SELECT 
          CASE 
            WHEN LOWER(status) IN ('paid', 'completed', 'complete') THEN 'Completed'
            WHEN LOWER(status) IN ('pending', 'processing') THEN 'Pending'
            WHEN status IS NULL OR LOWER(status) IN ('unpaid', 'not paid', 'failed') THEN 'Not Paid'
            ELSE 'Not Paid'
          END as status,
          COUNT(*) AS count
        FROM payment
        GROUP BY 
          CASE 
            WHEN LOWER(status) IN ('paid', 'completed', 'complete') THEN 'Completed'
            WHEN LOWER(status) IN ('pending', 'processing') THEN 'Pending'
            WHEN status IS NULL OR LOWER(status) IN ('unpaid', 'not paid', 'failed') THEN 'Not Paid'
            ELSE 'Not Paid'
          END
      `,
      
      // Membership status - conditional based on column existence
      membershipStatus: hasExpiryDate ? `
        SELECT 
          CASE 
            WHEN expiry_date IS NULL THEN 'inactive'
            WHEN expiry_date >= CURDATE() THEN 'active'
            WHEN expiry_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() THEN 'expiring'
            ELSE 'inactive'
          END as status,
          COUNT(*) AS count
        FROM register
        GROUP BY 
          CASE 
            WHEN expiry_date IS NULL THEN 'inactive'
            WHEN expiry_date >= CURDATE() THEN 'active'
            WHEN expiry_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE() THEN 'expiring'
            ELSE 'inactive'
          END
      ` : `
        SELECT 'active' as status, COUNT(*) as count FROM register
        UNION ALL SELECT 'inactive' as status, 0 as count
        UNION ALL SELECT 'expiring' as status, 0 as count
      `,
      
      // Active memberships
      activeMemberships: hasExpiryDate ? `
        SELECT COUNT(*) AS active
        FROM register
        WHERE expiry_date >= CURDATE()
      ` : `SELECT COUNT(*) AS active FROM register`,
      
      // Expiring soon (within 7 days)
      expiringSoon: hasExpiryDate ? `
        SELECT COUNT(*) AS expiring
        FROM register
        WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      ` : `SELECT 0 AS expiring`
    };

    // Run all queries in parallel
    Promise.all(
      Object.entries(queries).map(([key, sql]) =>
        new Promise((resolve, reject) => {
          db.query(sql, (err, result) => {
            if (err) {
              console.error(`Error in query ${key}:`, err);
              reject(err);
            } else {
              resolve({ key, result });
            }
          });
        })
      )
    )
      .then((results) => {
        results.forEach(({ key, result }) => {
          data[key] = result;
        });

        // Format membership status data
        const membershipStatus = {
          active: 0,
          inactive: 0,
          expiring: 0
        };
        
        if (data.membershipStatus && data.membershipStatus.length > 0) {
          data.membershipStatus.forEach(row => {
            membershipStatus[row.status] = row.count;
          });
        }

        console.log("Membership status formatted:", membershipStatus);

        // ✅ Send formatted response
        const response = {
          total_trainers: data.trainers[0].total_trainers,
          total_members: data.totalMembers[0].total_members,
          total_memberships: data.memberships[0].total_memberships,
          gender: data.gender,
          monthly: data.monthly,
          payments: data.payments,
          membership_status: membershipStatus,
          active_members: data.activeMemberships[0].active,
          expiring_soon: data.expiringSoon[0].expiring
        };

        console.log("✅ Dashboard data prepared successfully");
        res.json(response);
      })
      .catch((err) => {
        console.error("❌ Dashboard fetch error:", err);
        res.status(500).json({ error: "Database query failed", details: err.message });
      });
  });
});

module.exports = router;
