require('dotenv').config();
const express = require('express');
const cors = require('cors');
const whatsappRoutes = require('./routes/whatsappRoutes');
const directusRoutes = require('./routes/directusRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/directus', directusRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Configured Services:`);
  console.log(`- WhatsApp: ${process.env.PHONE_NUMBER_ID ? 'Enabled' : 'Disabled'}`);
  console.log(`- Directus: ${process.env.DIRECTUS_WEBHOOK_URL ? 'Enabled' : 'Disabled'}`);
});