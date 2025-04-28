const Player = require("../models/player");
const jwt = require("jsonwebtoken");

exports.registerPlayer = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.length < 5) {
      return res
        .status(400)
        .json({ message: "Username must be at least 5 characters" });
    }

    const existingUser = await Player.findOne({ username });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username already exists. Please choose another." });
    }

    const player = new Player({ username });
    await player.save();

    // Generate JWT (no expiration)
    const token = jwt.sign(
      { id: player._id, username: player.username },
      process.env.JWT_SECRET
    );

    // ✅ Send both token and player data
    res.status(201).json({
      message: "Player registered",
      player: {
        id: player._id,
        username: player.username,
        coins: player.coins,
        date_joined: player.date_joined,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering player:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Check username availability
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.length < 5) {
      return res.status(400).json({
        valid: false,
        message: "Username must be at least 5 characters",
      });
    }

    const existing = await Player.findOne({ username });

    if (existing) {
      return res.json({ valid: false, message: "Username is already taken" });
    }

    res.json({ valid: true, message: "Username is available" });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Update player coins
exports.updateCoins = async (req, res) => {
  try {
    const { id, coins } = req.body;

    if (!id || typeof coins !== "number") {
      return res
        .status(400)
        .json({ message: "Invalid ID or coins value provided" });
    }

    const player = await Player.findByIdAndUpdate(id, { coins }, { new: true });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({ message: "Coins updated", player });
  } catch (error) {
    console.error("Error updating coins:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topPlayers = await Player.find().sort({ coins: -1 }).limit(10);
    res.json(topPlayers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get player by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Player ID is required" });
    }

    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get current user using token
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // This comes from the token (middleware sets it)

    const player = await Player.findById(userId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({
      id: player._id,
      username: player.username,
      coins: player.coins,
      date_joined: player.date_joined,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUsername = async (req, res) => {
  try {
    const { id, newUsername } = req.body;

    if (!id || !newUsername || newUsername.length < 5) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Check if the new username is already taken
    const existing = await Player.findOne({ username: newUsername });
    if (existing) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    // Update the username
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { username: newUsername },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({
      message: "Username updated successfully",
      player: {
        id: updatedPlayer._id,
        username: updatedPlayer.username,
        coins: updatedPlayer.coins,
        date_joined: updatedPlayer.date_joined,
      },
    });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateLevelProgress = async (req, res) => {
  try {
    const { id, completedLevel } = req.body;

    if (!id || typeof completedLevel !== "number") {
      return res.status(400).json({ message: "Invalid input" });
    }

    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Unlock next level if not already unlocked
    const nextLevel = completedLevel + 1;
    if (!player.unlocked_levels.includes(nextLevel)) {
      player.unlocked_levels.push(nextLevel);
    }

    await player.save();

    res.json({
      message: "Level progress updated",
      unlocked_levels: player.unlocked_levels,
    });
  } catch (error) {
    console.error("Error updating level progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};
