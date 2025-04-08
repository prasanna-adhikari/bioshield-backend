// index.js
require("dotenv").config(); // Load env variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection failed ❌", err));

// Define schema and model
const playerSchema = new mongoose.Schema({
  username: String,
  coins: { type: Number, default: 0 },
  date_joined: { type: Date, default: Date.now },
});

const Player = mongoose.model("Player", playerSchema);

// Routes
app.post("/register", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send("Username is required");

  const player = new Player({ username });
  await player.save();
  res.json({ message: "Player registered", id: player._id });
});

app.post("/update-coins", async (req, res) => {
  const { id, coins } = req.body;
  const player = await Player.findByIdAndUpdate(id, { coins }, { new: true });
  res.json({ message: "Coins updated", player });
});

app.get("/leaderboard", async (req, res) => {
  const topPlayers = await Player.find().sort({ coins: -1 }).limit(10);
  res.json(topPlayers);
});

// Check if username is already taken
app.get("/check-username", async (req, res) => {
  const { username } = req.query;

  if (!username || username.length < 5) {
    return res
      .status(400)
      .json({
        valid: false,
        message: "Username must be at least 5 characters",
      });
  }

  const existing = await Player.findOne({ username });

  if (existing) {
    return res.json({ valid: false, message: "Username is already taken" });
  }

  res.json({ valid: true, message: "Username is available" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
