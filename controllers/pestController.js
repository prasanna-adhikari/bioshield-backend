const Pest = require("../models/pest");
exports.addPests = async (req, res) => {
  try {
    const pestList = req.body.pests;

    if (!Array.isArray(pestList) || pestList.length === 0) {
      return res.status(400).json({ message: "No pest data provided" });
    }

    const insertedPests = await Pest.insertMany(pestList, { ordered: false });

    res.status(201).json({
      message: "Pests inserted successfully",
      pests: insertedPests,
    });
  } catch (error) {
    console.error("Error inserting pests:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate level found", error });
    }

    res.status(500).json({ message: "Server error", error });
  }
};

exports.getPestByLevel = async (req, res) => {
  try {
    const level = parseInt(req.params.level);

    if (isNaN(level)) {
      return res.status(400).json({ message: "Invalid level" });
    }

    const pest = await Pest.findOne({ level });

    if (!pest) {
      return res.status(404).json({ message: "Pest not found for this level" });
    }

    res.json(pest);
  } catch (error) {
    console.error("Error fetching pest:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPestById = async (req, res) => {
  try {
    const id = req.params.id;

    const pest = await Pest.findById(id);

    if (!pest) {
      return res.status(404).json({ message: "Pest not found for this ID" });
    }

    res.json(pest);
  } catch (error) {
    console.error("Error fetching pest by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
