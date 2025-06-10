const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const connectDB = require('../db');
const DriverSession = require('../models/driverSession');



router.get("/tripCount/:driverId", async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const db = await connectDB();
    const tripCount = await db
      .collection("driversessions")
      .countDocuments({ driverId: new ObjectId(driverId) })

    res.json({ tripCount });
  } catch (err) {
    console.error("Error fetching trip count:", err);
    res.status(500).json({ error: "Failed to fetch trip count" });
  }
});

// Example: GET /api/sessions/timelines/:driverId
// GET /api/sessions/timelines/:driverId
router.get("/timelines/:driverId", async (req, res) => {
  try {
    const sessions = await DriverSession.find({ driverId: req.params.driverId }).sort({ startTime: -1 });

    // Optional: Debug logging
    console.log("Fetched sessions:", sessions);

    const timelines = sessions.map((session) => session.startTime);

    res.json({ timelines });
  } catch (err) {
    console.error("Error fetching timelines:", err);
    res.status(500).json({ error: "Failed to fetch timelines" });
  }
});



module.exports = router;