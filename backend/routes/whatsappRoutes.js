const express = require("express");
const router = express.Router();
const { sendWhatsAppMessage } = require("../services/WhatsAppService");


// Validation functions (moved directly into the routes file)
const validatePhoneNumber = (phoneNumber) => {
  // Trim leading/trailing spaces and validate
  const trimmedPhoneNumber = phoneNumber.trim();
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return phoneRegex.test(trimmedPhoneNumber);
};

const validateMessageContent = (message) => {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: "Message content cannot be empty" };
  }
  if (message.length > 1000) {
    return { isValid: false, error: "Message is too long (max 1000 characters)" };
  }
  return { isValid: true };
};

const validatePhoneNumberMiddleware = (req, res, next) => {
  const { phoneNumber } = req.body;
  if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
  }
  next();
};

// Send a WhatsApp message
router.post("/send-message", validatePhoneNumberMiddleware, async (req, res) => {
  const { phoneNumber, message } = req.body;

   // Validate message content
   const messageValidation = validateMessageContent(message);
   if (!messageValidation.isValid) {
     return res.status(400).json({ error: messageValidation.error });
   }

  try {
    // Call the service to send the message
    const result = await sendWhatsAppMessage(phoneNumber, message);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({ 
      error: "Failed to send WhatsApp message",
      details: error.message // Provide more details if safe to do so
    });
  }
});

module.exports = router;