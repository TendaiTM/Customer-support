const axios = require("axios");
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const API_VERSION = process.env.API_VERSION;

// Validate environment variables
if (!ACCESS_TOKEN || !PHONE_NUMBER_ID || !API_VERSION) {
  throw new Error("Missing required environment variables: ACCESS_TOKEN, PHONE_NUMBER_ID, or API_VERSION");
}

const BASE_URL = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

/**
 * Validates a phone number in international format.
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid, false otherwise.
 */
const validatePhoneNumber = (phoneNumber) => {
  const regex = /^\+\d{1,15}$/; // Basic international format validation
  return regex.test(phoneNumber);
};

/**
 * Sends a WhatsApp message via the WhatsApp Cloud API.
 * @param {string} to - The recipient's phone number in international format.
 * @param {string} message - The text message to send.
 * @returns {Promise<object>} - The response data from the API.
 * @throws {Error} - If the message fails to send.
 */
const sendWhatsAppMessage = async (to, message) => {
  // Validate phone number
  if (!validatePhoneNumber(to)) {
    throw new Error("Invalid phone number format. Please use international format (e.g., +1234567890)");
  }

  // Validate message length
  if (message.length > 4096) {
    throw new Error("Message length exceeds the maximum allowed limit of 4096 characters");
  }

  const data = {
    messaging_product: "whatsapp",
    to, // Recipient's phone number
    type: "text",
    text: {
      body: message, // Message content
    },
  };

  try {
    const response = await axios.post(BASE_URL, data, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });
    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Failed to send WhatsApp message");
  }
};

module.exports = { sendWhatsAppMessage };