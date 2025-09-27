const mongoose = require("mongoose");

const FocusSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  durationSeconds: { type: Number, required: true },
  focusedSeconds: { type: Number, required: true },
  focusPercent: { type: Number, required: true },
  startedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FocusSession", FocusSessionSchema);
