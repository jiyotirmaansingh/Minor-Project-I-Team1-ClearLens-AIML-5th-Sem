// routes/streakRoutes.js
const express = require("express");
const Session = require("../models/Session");
const router = express.Router();

// GET /api/streak/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId })
      .sort({ date: -1 }); // newest first

    if (!sessions.length) return res.json({ streak: 0 });

    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let session of sessions) {
      let sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      if (sessionDate.getTime() === today.getTime()) {
        streak++;
        today.setDate(today.getDate() - 1); // move to yesterday
      } else if (sessionDate.getTime() === today.getTime() - 86400000) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else {
        break; // gap found
      }
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate streak" });
  }
});

module.exports = router;
