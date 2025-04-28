const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  coins: { type: Number, default: 0 },
  date_joined: { type: Date, default: Date.now },
  unlocked_levels: { type: [Number], default: [1] },
});

module.exports = mongoose.model("Player", playerSchema);
