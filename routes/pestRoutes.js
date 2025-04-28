const express = require("express");
const router = express.Router();

const {
  addPests,
  getPestByLevel,
  getPestById,
} = require("../controllers/pestController");

// Add pests (bulk insert)
router.post("/add", addPests);
router.get("/level/:level", getPestByLevel);
router.get("/id/:id", getPestById);
module.exports = router;
