const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// POST /api/book-now
router.post("/book-now", async (req, res) => {
  const { phone, driverUsername, bookedByName, bookedByPhone } = req.body;

  try {
    const message = `🚖 *Ride Booking Request*

👤 *Passenger:* ${bookedByName}
📞 *Phone:* ${bookedByPhone}

🧑‍✈️ *Driver:* ${driverUsername}

Please reach out to confirm the booking.

Thank you for choosing *SafetyOnWheels*!`;

    await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886",         // Twilio sandbox WhatsApp number
      to: `whatsapp:+91${phone}`             // Driver's phone (India format)
    });

    res.status(200).json({ message: "WhatsApp message sent successfully!" });
  } catch (err) {
    console.error("Twilio error:", err);
    res.status(500).json({ error: "Failed to send WhatsApp message." });
  }
});

module.exports = router;
