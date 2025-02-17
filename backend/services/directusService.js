require('dotenv').config();
const axios = require('axios');

const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const DIRECTUS_WEBHOOK_URL = process.env.DIRECTUS_WEBHOOK_URL;

// Validate environment variables
if (!DIRECTUS_TOKEN || !DIRECTUS_WEBHOOK_URL) {
  throw new Error("Missing Directus environment variables");
}

/**
 * Sends data to Directus via webhook
 * @param {object|string} data - Data to send
 * @param {string} type - Data type/category
 * @returns {Promise<object>} - Directus response
 * @throws {Error} - If the operation fails
 */
const sendToDirectus = async (data, type) => {
  try {
    const payload = {
      type,
      data: typeof data === 'string' ? data : JSON.stringify(data)
    };

    const response = await axios.post(DIRECTUS_WEBHOOK_URL, payload, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    console.error('Directus Error:', {
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(error.response?.data?.message || 'Directus operation failed');
  }
};

module.exports = { sendToDirectus };