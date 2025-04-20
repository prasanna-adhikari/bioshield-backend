const express = require("express");
const router = express.Router();

const {
  registerPlayer,
  checkUsername,
  updateCoins,
  getLeaderboard,
  getUserById,
  getCurrentUser,
} = require("../controllers/playerController");

const { verifyToken } = require("../middleware/auth");

// Public routes
router.post("/register", registerPlayer);
router.get("/check-username", checkUsername);
router.get("/leaderboard", getLeaderboard);

// Protected routes
router.post("/update-coins", verifyToken, updateCoins);
router.get("/user/:id", verifyToken, getUserById);
router.get("/currentuser/profile", verifyToken, getCurrentUser);

module.exports = router;
