const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: String,
  coins: { type: Number, default: 0 },
  date_joined: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Player", playerSchema);
