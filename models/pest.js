const mongoose = require("mongoose");

const pestSchema = new mongoose.Schema({
  level: { type: Number, required: true, unique: true }, // S.No. = Level
  common_name: { type: String, required: true },
  scientific_name: { type: String },
  species_affected: { type: String },
  symptoms: { type: String },
  profile: { type: String },
  identification: { type: String },
  threat: { type: String },
  action: { type: String },
  image_url: { type: String },
  source: { type: String },
});

module.exports = mongoose.model("Pest", pestSchema);
