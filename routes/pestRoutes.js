const express = require("express");
const router = express.Router();

const { addPests } = require("../controllers/pestController");

// Add pests (bulk insert)
router.post("/add", addPests);

module.exports = router;
