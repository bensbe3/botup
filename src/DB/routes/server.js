/**
 * BotUp - Chatbot Platform
 * Copyright (c) 2024 Mohamed Bensbaa. All rights reserved.
 * 
 * This file is part of the BotUp chatbot platform.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

// Try to load environment variables with debugging
console.log('Current working directory:', process.cwd());
const envPath = path.resolve(process.cwd(), '.env');
console.log('Looking for .env file at:', envPath);

if (fs.existsSync(envPath)) {
  console.log('.env file exists');
  const envConfig = dotenv.config({ path: envPath });
  
  if (envConfig.error) {
    console.error('Error loading .env file:', envConfig.error);
  } else {
    console.log('Loaded .env file successfully');
  }
} else {
  console.error('.env file does not exist at path:', envPath);
}

// Set default environment variables if not already set
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || '';
process.env.DB_NAME = process.env.DB_NAME || 'botup';
process.env.JWT_SECRET = process.env.JWT_SECRET || '4fc2721d4b3282b66f0ffb9d11fc750ede902d179c37d34fe27e44a90d687dca';
process.env.PORT = process.env.PORT || '5000';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDjcHYcLdHEkuQ9p91T5y02GCFGHOiOOAw';

console.log('Using environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '[REDACTED]' : 'undefined');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '[REDACTED]' : 'undefined');
console.log('PORT:', process.env.PORT);

// Create Express app
const app = express();

// Create HTTP server with Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
const publicPath = path.join(process.cwd(), 'public');
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Serve widget.js specifically as a static file
app.get('/widget.js', (req, res) => {
  res.sendFile(path.join(publicPath, 'widget.js'));
});

// Import database connection from db.js
const pool = require('./db');

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('Could not connect to MySQL database:', err);
  }
}

testConnection();

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Set up socket connections
io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);
  
  // Visitor connection
  socket.on('join_conversation', (data) => {
    const { conversationId, botId, visitorId } = data;
    console.log(`Visitor joined conversation: ${conversationId}, Bot: ${botId}, Visitor: ${visitorId}`);
    socket.join(`conv_${conversationId}`);
    
    // Track visitor presence if visitor ID provided
    if (visitorId) {
      pool.query(
        'UPDATE visitors SET is_online = TRUE, last_seen = NOW() WHERE id = ?',
        [visitorId]
      ).catch(err => console.error('Error updating visitor status:', err));
    }
  });
  
  // Agent connection
  socket.on('agent_login', (data) => {
    const { agentId, clientId } = data;
    console.log(`Agent logged in: ${agentId}, Client: ${clientId}`);
    socket.join(`agent_${agentId}`);
    socket.join(`client_${clientId}`);
    
    // Update agent status
    pool.query(
      'UPDATE agents SET status = "online", last_active = CURRENT_TIMESTAMP WHERE id = ?',
      [agentId]
    ).catch(err => console.error('Error updating agent status:', err));
  });
  
  // Client message handling
  socket.on('client_message', async (data) => {
    try {
      const { conversationId, message } = data;
      console.log(`Client message in conversation ${conversationId}: ${message}`);
      
      // Store message in database
      const [result] = await pool.query(
        'INSERT INTO messages (conversation_id, sender, content) VALUES (?, "user", ?)',
        [conversationId, message]
      );
      
      // Update message count
      await pool.query(
        'UPDATE conversations SET message_count = message_count + 1, updated_at = NOW() WHERE id = ?',
        [conversationId]
      );
      
      // Get conversation details
      const [conversations] = await pool.query(
        'SELECT handling_type, agent_id, chatbot_id FROM conversations WHERE id = ?',
        [conversationId]
      );
      
      if (conversations.length === 0) return;
      
      const conv = conversations[0];
      
      // Route message appropriately
      if (conv.handling_type === 'agent' && conv.agent_id) {
        // Forward to human agent
        io.to(`agent_${conv.agent_id}`).emit('new_message', {
          conversationId: conversationId,
          message: message,
          sender: 'visitor',
          messageId: result.insertId,
          timestamp: new Date()
        });
      } else {
        // Process with AI
        const aiService = require('../../services/aiBackendService');
        const botResponse = await aiService.generateChatbotResponse(message, conv.chatbot_id, conversationId);
        
        // Store bot response
        const [botMsgResult] = await pool.query(
          'INSERT INTO messages (conversation_id, sender, content) VALUES (?, "bot", ?)',
          [conversationId, botResponse.message]
        );
        
        // Send response back to visitor
        io.to(`conv_${conversationId}`).emit('bot_response', {
          messageId: botMsgResult.insertId,
          message: botResponse.message,
          timestamp: new Date()
        });
        
        // If AI indicates need for human, transfer
        if (botResponse.requiresHuman) {
          // Get the chatbot owner
          const [chatbots] = await pool.query(
            'SELECT c.id as client_id FROM chatbots b JOIN clients c ON b.client_id = c.id WHERE b.id = ?',
            [conv.chatbot_id]
          );
          
          if (chatbots.length > 0) {
            await pool.query(
              'UPDATE conversations SET handling_type = "transferred", transfer_time = NOW() WHERE id = ?',
              [conversationId]
            );
            
            // Notify all online agents for this client
            io.to(`client_${chatbots[0].client_id}`).emit('new_conversation', {
              conversationId,
              botId: conv.chatbot_id,
              lastMessage: botResponse.message,
              timestamp: new Date()
            });
          }
        }
      }
    } catch (err) {
      console.error('Error processing client message:', err);
    }
  });
  
  // Agent message
  socket.on('agent_message', async (data) => {
    try {
      const { conversationId, message, agentId, agentName } = data;
      console.log(`Agent ${agentName} (${agentId}) sent message in ${conversationId}: ${message}`);
      
      // Store in database
      const [result] = await pool.query(
        'INSERT INTO messages (conversation_id, sender, content, agent_id) VALUES (?, "agent", ?, ?)',
        [conversationId, message, agentId]
      );
      
      // Send to visitor
      io.to(`conv_${conversationId}`).emit('agent_response', {
        messageId: result.insertId,
        message: message,
        agentName: agentName,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error sending agent message:', err);
    }
  });
  
  // Typing indicators
  socket.on('visitor_typing', (data) => {
    const { conversationId, isTyping } = data;
    // Get conversation details
    pool.query(
      'SELECT agent_id FROM conversations WHERE id = ?',
      [conversationId]
    ).then(([conversations]) => {
      if (conversations.length > 0 && conversations[0].agent_id) {
        // Forward typing indicator to agent
        io.to(`agent_${conversations[0].agent_id}`).emit('typing_indicator', {
          conversationId,
          isTyping,
          sender: 'visitor'
        });
      }
    }).catch(err => console.error('Error getting conversation for typing indicator:', err));
  });
  
  socket.on('agent_typing', (data) => {
    const { conversationId, isTyping } = data;
    // Forward to visitor
    io.to(`conv_${conversationId}`).emit('typing_indicator', {
      isTyping,
      sender: 'agent'
    });
  });
  
  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('socketio', io);

// Routes - Fix paths to use local files since we're already in the routes directory
const { router: authRouter } = require('./auth');
app.use('/api/auth', authRouter);
app.use('/api/clients', require('./clients'));
app.use('/api/chatbots', require('./chatbots'));
app.use('/api/conversations', require('./conversations'));
app.use('/api/chatbot', require('./ai'));
app.use('/api/visitors', require('./visitors'));
app.use('/api/agents', require('./agents'));

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

// Export io for use in other modules
module.exports.io = io;

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║   🤖 BotUp API Server with WebSockets        ║
║   Running on port ${PORT}                      ║
║                                              ║
╚══════════════════════════════════════════════╝
  `);
});