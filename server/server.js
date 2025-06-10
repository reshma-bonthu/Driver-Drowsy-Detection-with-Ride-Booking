require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// MiddlewareHa
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Routes
const bookRoutes = require("./routes/bookRoutes");
const driverRoutes = require("./routes/driverRoutes");
const userRoutes = require("./routes/userRoutes");
const detectionRoute = require("./routes/detectionRoute");
const driverSessionRoute = require("./routes/driverSessionRoute");

app.use("/api", bookRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/user", userRoutes);
app.use("/api", detectionRoute);
app.use("/api/sessions", driverSessionRoute);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
