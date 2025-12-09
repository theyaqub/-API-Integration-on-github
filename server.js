require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express framework
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
const repoRoutes = require('./routes/repoRoutes');// Import repository routes
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Continuing without MongoDB...');
  });

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (HTML form)
app.use(express.static('public'));

// Use repository routes
app.use('/api', repoRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
