const mongoose = require("mongoose");

const FocusLogSchema = new mongoose.Schema({
  user: {
    id: { type: String, required: false },
    name: { type: String, required: false },
  },
  room: { type: String, default: "default" },
  startedAt: { type: Date, default: Date.now },
  durationSeconds: { type: Number, required: true },
  focusedSeconds: { type: Number, required: true },
  focusPercent: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FocusLog", FocusLogSchema);
