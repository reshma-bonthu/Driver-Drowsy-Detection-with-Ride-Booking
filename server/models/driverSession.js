// models/driverSession.js
const mongoose = require('mongoose');

const driverSessionSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver', // assuming your driver model is named 'Driver'
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('DriverSession', driverSessionSchema);