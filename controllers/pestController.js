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
