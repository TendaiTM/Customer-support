const express = require('express');
const router = express.Router();
const { sendToDirectus } = require('../services/directusService');

// Send data to Directus
router.post('/send', async (req, res) => {
  try {
    const { data, type } = req.body;
    
    if (!data || !type) {
      return res.status(400).json({ error: 'Data and type are required' });
    }

    const result = await sendToDirectus(data, type);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ 
      error: 'Directus operation failed',
      details: error.message
    });
  }
});

// Webhook listener
router.post('/webhook', (req, res) => {
  console.log('Directus Webhook:', req.body);

  // Extract the event type and data from the webhook payload
  const eventType = req.body.event;
  const data = req.body.data;

  // Process the webhook based on the event type
  switch (eventType) {
    case 'items.create':
      handleItemCreate(data);
      break;
    case 'items.update':
      handleItemUpdate(data);
      break;
    case 'items.delete':
      handleItemDelete(data);
      break;
    default:
      console.log('Unhandled event type:', eventType);
  }

  // Respond to the webhook request
  res.status(200).json({ status: 'received' });
});

// Function to handle item creation
function handleItemCreate(data) {
  console.log('New item created:', data);

  // Example: Send a welcome email if the item is a new user
  if (data.collection === 'whatsappdashboard') {
    const userEmail = data.email;
    sendWelcomeEmail(userEmail);
  }

  // Add more logic here as needed
}

// Function to handle item update
function handleItemUpdate(data) {
  console.log('Item updated:', data);

  // Example: Notify an admin if a user's role is changed
  if (data.collection === 'whatsappdashboard' && data.role) {
    notifyAdminOfRoleChange(data.id, data.role);
  }

  // Add more logic here as needed
}

// Function to handle item deletion
function handleItemDelete(data) {
  console.log('Item deleted:', data);

  // Example: Log the deletion for audit purposes
  logDeletion(data.collection, data.id);

  // Add more logic here as needed
}

// Example function to send a welcome email
function sendWelcomeEmail(email) {
  console.log(`Sending welcome email to ${email}`);
  // Implement your email sending logic here
}

// Example function to notify an admin of a role change
function notifyAdminOfRoleChange(userId, newRole) {
  console.log(`User ${userId} role changed to ${newRole}`);
  // Implement your notification logic here
}

// Example function to log deletions
function logDeletion(collection, itemId) {
  console.log(`Item ${itemId} deleted from collection ${collection}`);
  // Implement your logging logic here
}
module.exports = router;