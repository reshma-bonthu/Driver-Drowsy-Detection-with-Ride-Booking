const express = require("express");
const router = express.Router();
const Driver = require("../models/Driver");
const multer = require("multer");
const path = require("path");
const connectDB = require("../db");
const { ObjectId } = require("mongodb");

// Storage engine setup for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files to "uploads/" directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.fieldname + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * SIGNUP ROUTE
 */
router.post(
  "/signup",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "registration", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { fullName, username, email, password, place, phone } = req.body;

      const existingUser = await Driver.findOne({ username });
      if (existingUser) return res.status(400).json({ error: "Username exists" });

      const newDriver = new Driver({
        fullName,
        username,
        email,
        password,
        place,
        phone,
        profilePicture: req.files.profilePicture?.[0]?.path,
        aadhar: req.files.aadhar?.[0]?.path,
        license: req.files.license?.[0]?.path,
        registration: req.files.registration?.[0]?.path,
        insurance: req.files.insurance?.[0]?.path,
        active: 0,
        yawn: 0,
        sleepy: 0,
        drowsy: 0,
      });

      await newDriver.save();
      res.status(201).json({ message: "Signup successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * LOGIN ROUTE
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const driver = await Driver.findOne({ username });

    if (!driver || driver.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: driver._id,
        username: driver.username,
        email: driver.email,
        fullName: driver.fullName,
        phone: driver.phone,
        place: driver.place,
        profilePicture: driver.profilePicture,
        active: driver.active,
        yawn: driver.yawn,
        sleepy: driver.sleepy,
        drowsy: driver.drowsy,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * UPDATE DRIVER ROUTE
 */
router.put("/update/:id", upload.single("profilePicture"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      place: req.body.place,
    };

    if (req.file) {
      updateData.profilePicture = req.file.path;
    }

    const updatedDriver = await Driver.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.status(200).json({
      message: "Driver updated successfully",
      driver: updatedDriver,
    });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Server error during update" });
  }
});

/**
 * GET ALL DRIVERS
 */
router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (err) {
    console.error("Error fetching drivers:", err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

/**
 * GET DRIVER BY ID
 */
router.get("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const driverId = req.params.id;
    const driversCollection = db.collection("drivers");

    const driver = await driversCollection.findOne(
      { _id: new ObjectId(driverId) },
      { projection: { fullName: 1 } }
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