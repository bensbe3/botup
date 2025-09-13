const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const chatbotRoutes = require('./routes/chatbots');
const conversationRoutes = require('./routes/conversations');

// Load environment variables
dotenv.config();

// Initialize the database connection (this will test the connection)
require('./db');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/chatbots', chatbotRoutes);
app.use('/api/conversations', conversationRoutes);

// Root route for API status
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'BotUp API is running',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║   🤖 BotUp API Server                        ║
║   Running on port ${PORT}                      ║
║                                              ║
╚══════════════════════════════════════════════╝
  `);
});