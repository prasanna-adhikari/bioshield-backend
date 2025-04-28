const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed", err));

// Routes
const playerRoutes = require("./routes/playerRoutes");
const pestRoutes = require("./routes/pestRoutes");
app.use("/api/pests", pestRoutes);

app.use("/api", playerRoutes);

// Port binding for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
