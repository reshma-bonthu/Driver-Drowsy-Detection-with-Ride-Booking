const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  place: { type: String, required: true },
  phone: { type: String, required: true },
  profilePicture: { type: String },
  aadhar: { type: String },
  license: { type: String },
  registration: { type: String },
  insurance: { type: String },
  active: { type: Number, default: 0 },
  yawn: { type: Number, default: 0 },
  sleepy: { type: Number, default: 0 },
  drowsy: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema);