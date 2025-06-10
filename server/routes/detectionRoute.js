const express = require("express");
const { spawn } = require("child_process");
const DriverSession = require("../models/driverSession");
const router = express.Router();
const { ObjectId } = require("mongodb");
const connectDB = require("../db");

router.post("/start-detection", async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ error: "driverId is required" });
    }

    // Save a new session record with timestamp
    const session = new DriverSession({ driverId });
    await session.save();

    // Start the Python detection script with driverId as argument
    const python = spawn("python", ["../python/drowsy_detect.py", driverId]);

    python.stdout.on("data", (data) => {
      console.log(`stdout: ${data.toString()}`);
    });

    python.stderr.on("data", (data) => {
      console.error(`stderr: ${data.toString()}`);
    });

    python.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
    });

    res.json({ status: "Detection started", sessionId: session._id });
  } catch (err) {
    console.error("Error starting detection:", err);
    res.status(500).json({ error: "Failed to start detection" });
  }
});

router.get("/detections/:driverId", async (req, res) => {
  try {
    const db = await connectDB();
    const driverId = req.params.driverId;

    const driversCollection = db.collection("drivers");

    const driver = await driversCollection.findOne(
      { _id: new ObjectId(driverId) },
      { projection: { yawn: 1, sleepy: 1, drowsy: 1, active: 1 } }
    );

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
