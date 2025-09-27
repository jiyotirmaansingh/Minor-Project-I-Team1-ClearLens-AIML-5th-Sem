const express = require("express");
const FocusLog = require("../models/FocusLog");

const router = express.Router();

// ✅ Get all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await FocusLog.find().sort({ timestamp: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// ✅ Create a new session
router.post("/", async (req, res) => {
  try {
    const { user, room, startedAt, durationSeconds, focusedSeconds, focusPercent } = req.body;

    if (!durationSeconds || !focusedSeconds || focusPercent == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSession = new FocusLog({
      user,
      room,
      startedAt,
      durationSeconds,
      focusedSeconds,
      focusPercent,
    });

    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error saving session:", error.message);
    res.status(500).json({ error: "Failed to save session" });
  }
});

module.exports = router;
