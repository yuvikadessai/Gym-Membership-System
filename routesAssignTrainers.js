router.get("/", (req, res) => {
    const member_id = req.session?.user?.member_id;
    if (!member_id) return res.status(401).json({ error: "Unauthorized" });
  
    const query = `
      SELECT 
        r.name,
        r.gender,
        COALESCE(m.type, 'No Plan Selected') AS plan,
        COALESCE(m.duration, '-') AS duration,
        COALESCE(p.status, 'Unpaid') AS payment_status,
        COALESCE(r.assigned_trainer, 'Not Assigned') AS trainer
      FROM register r
      LEFT JOIN membership m ON r.membership_id = m.membership_id
      LEFT JOIN payment p ON r.member_id = p.member_id
      WHERE r.member_id = ?
    `;
  
    db.query(query, [member_id], (err, results) => {
      if (err) {
        console.error("Error fetching member dashboard data:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results[0]);
    });
  });
  