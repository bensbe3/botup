const express = require('express');
const router = express.Router();
const pool = require('./db');
const { verifyToken } = require('./auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API with the API key
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDjcHYcLdHEkuQ9p91T5y02GCFGHOiOOAw';
const genAI = new GoogleGenerativeAI(API_KEY);

// Default model configuration
const DEFAULT_MODEL = 'gemini-pro';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 1000;

// Utility functions for data transformation
const toCamelCase = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/(_\w)/g, m => m[1].toUpperCase());
    
    // Handle boolean values from MySQL
    if (typeof obj[key] === 'number' && (key.startsWith('is_') || key.startsWith('show_') || key.includes('_data') || key.includes('_reply'))) {
      newObj[camelKey] = obj[key] === 1;
    } else if (key === 'created_at' || key === 'updated_at') {
      newObj[key] = new Date(obj[key]); // Keep date fields as is
    } else {
      newObj[camelKey] = obj[key];
    }
  });
  return newObj;
};

const toSnakeCase = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, m => '_' + m.toLowerCase());
    
    // Convert boolean values to 0/1 for MySQL
    if (typeof obj[key] === 'boolean') {
      newObj[snakeKey] = obj[key] ? 1 : 0;
    } else {
      newObj[snakeKey] = obj[key];
    }
  });
  return newObj;
};

// Get Gemini AI model instance
const getAIModel = () => {
  return genAI.getGenerativeModel({ 
    model: DEFAULT_MODEL,
    generationConfig: {
      temperature: DEFAULT_TEMPERATURE,
      maxOutputTokens: DEFAULT_MAX_TOKENS,
    }
  });
};

// Get all chatbots for the authenticated client
router.get('/', verifyToken, async (req, res) => {
  try {
    // Get all chatbots for this client
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE client_id = ?',
      [req.user.id]
    );
    
    // Format date fields and convert to camelCase for frontend
    const formattedChatbots = chatbots.map(bot => toCamelCase(bot));
    
    res.json(formattedChatbots);
  } catch (err) {
    console.error('Error fetching chatbots:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific chatbot by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const chatbotId = req.params.id;
    
    // Get chatbot with client verification (security check)
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ? AND client_id = ?',
      [chatbotId, req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Format to camelCase for frontend
    const chatbot = toCamelCase(chatbots[0]);
    
    res.json(chatbot);
  } catch (err) {
    console.error('Error fetching chatbot:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public endpoint to get chatbot configuration for embedding
router.get('/public/:id', async (req, res) => {
  try {
    const chatbotId = req.params.id;
    
    // Get public chatbot configuration
    const [chatbots] = await pool.query(
      `SELECT id, name, welcome_message, primary_color, 
       icon_style, position, show_on_mobile, show_on_desktop, 
       show_branding, auto_reply, auto_open_delay
       FROM chatbots WHERE id = ?`,
      [chatbotId]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Convert to camelCase for frontend
    const chatbot = toCamelCase(chatbots[0]);
    
    res.json(chatbot);
  } catch (err) {
    console.error('Error fetching public chatbot configuration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new chatbot (public endpoint for widget)
router.post('/', async (req, res) => {
  try {
    // Extract chatbot data from request
    const data = req.body;
    
    // Convert to snake_case for database
    const dbData = toSnakeCase(data);
    
    // Create a default client if none exists
    let [clients] = await pool.query('SELECT id FROM clients LIMIT 1');
    let clientId;

    if (clients.length === 0) {
      // Create default client
      const [result] = await pool.query(
        'INSERT INTO clients (name, email, plan) VALUES (?, ?, ?)',
        ['Default Client', 'default@botup.app', 'free']
      );
      clientId = result.insertId;
    } else {
      clientId = clients[0].id;
    }
    
    // Set default values
    const chatbotData = {
      client_id: clientId,
      name: dbData.name || 'My Assistant',
      prompt: dbData.prompt || 'You are a friendly assistant for my website. Answer customer questions helpfully and concisely.',
      welcome_message: dbData.welcome_message || 'Hello! How can I help you today?',
      primary_color: dbData.primary_color || '#4f46e5',
      icon_style: dbData.icon_style || 'chat',
      position: dbData.position || 'right',
      show_on_mobile: dbData.show_on_mobile !== undefined ? dbData.show_on_mobile : 1,
      show_on_desktop: dbData.show_on_desktop !== undefined ? dbData.show_on_desktop : 1,
      collect_user_data: dbData.collect_user_data !== undefined ? dbData.collect_user_data : 1,
      show_branding: dbData.show_branding !== undefined ? dbData.show_branding : 1,
      auto_reply: dbData.auto_reply !== undefined ? dbData.auto_reply : 0,
      auto_open_delay: dbData.auto_open_delay !== undefined ? dbData.auto_open_delay : 0
    };
    
    // Build SQL query
    const fields = Object.keys(chatbotData).join(', ');
    const placeholders = Object.keys(chatbotData).map(() => '?').join(', ');
    const values = Object.values(chatbotData);
    
    // Insert new chatbot
    const [result] = await pool.query(
      `INSERT INTO chatbots (${fields}) VALUES (${placeholders})`,
      values
    );
    
    // Get the newly created chatbot
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [result.insertId]
    );
    
    // Format for frontend
    const chatbot = toCamelCase(chatbots[0]);
    
    res.status(201).json(chatbot);
  } catch (err) {
    console.error('Error creating chatbot:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a chatbot
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const chatbotId = req.params.id;
    
    // Verify chatbot belongs to client
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ? AND client_id = ?',
      [chatbotId, req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Convert camelCase to snake_case for database
    const updates = toSnakeCase(req.body);
    
    // Build dynamic update query
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), chatbotId];
    
    // Update chatbot
    await pool.query(
      `UPDATE chatbots SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    // Get the updated chatbot
    const [updatedChatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [chatbotId]
    );
    
    // Format for frontend
    const chatbot = toCamelCase(updatedChatbots[0]);
    
    res.json(chatbot);
  } catch (err) {
    console.error('Error updating chatbot:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a chatbot
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const chatbotId = req.params.id;
    
    // Verify chatbot belongs to client
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ? AND client_id = ?',
      [chatbotId, req.user.id]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Delete chatbot (cascading delete will remove related conversations and messages)
    await pool.query(
      'DELETE FROM chatbots WHERE id = ?',
      [chatbotId]
    );
    
    res.json({ message: 'Chatbot deleted successfully' });
  } catch (err) {
    console.error('Error deleting chatbot:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start new conversation with chatbot
router.post('/:id/conversation', async (req, res) => {
  try {
    const chatbotId = req.params.id;
    const { customerInfo = {} } = req.body;
    
    // Check if chatbot exists
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [chatbotId]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }
    
    // Create a new conversation
    const [result] = await pool.query(
      `INSERT INTO conversations (chatbot_id, customer_name, customer_email, message_count, is_test) 
       VALUES (?, ?, ?, 0, 0)`,
      [
        chatbotId, 
        customerInfo.name || null, 
        customerInfo.email || null
      ]
    );
    
    const conversationId = result.insertId;
    
    // Add welcome message if chatbot has one
    if (chatbots[0].welcome_message) {
      await pool.query(
        `INSERT INTO messages (conversation_id, sender, content)
         VALUES (?, ?, ?)`,
        [conversationId, 'bot', chatbots[0].welcome_message]
      );
      
      // Update message count in conversation
      await pool.query(
        `UPDATE conversations SET message_count = 1 WHERE id = ?`,
        [conversationId]
      );
    }
    
    // Return the conversationId for future messages
    res.status(201).json({ 
      success: true, 
      conversationId: conversationId
    });
  } catch (err) {
    console.error('Error starting conversation:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error'
    });
  }
});

// Process a message from the embedded widget
router.post('/:id/message', async (req, res) => {
  try {
    const chatbotId = req.params.id;
    const { message, conversationId, customerInfo = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required'
      });
    }
    
    // Check if chatbot exists and get its configuration
    const [chatbots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [chatbotId]
    );
    
    if (chatbots.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chatbot not found'
      });
    }
    
    // Get or create conversation
    let actualConversationId = conversationId;
    
    if (!actualConversationId) {
      // Create a new conversation if none was provided
      const [result] = await pool.query(
        `INSERT INTO conversations (chatbot_id, customer_name, customer_email, message_count, is_test)
         VALUES (?, ?, ?, 0, 0)`,
        [
          chatbotId, 
          customerInfo.name || null, 
          customerInfo.email || null
        ]
      );
      
      actualConversationId = result.insertId;
    } else {
      // Verify the conversation belongs to this chatbot
      const [conversations] = await pool.query(
        'SELECT * FROM conversations WHERE id = ? AND chatbot_id = ?',
        [actualConversationId, chatbotId]
      );
      
      if (conversations.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Conversation not found'
        });
      }
    }
    
    // Store user message
    await pool.query(
      `INSERT INTO messages (conversation_id, sender, content)
       VALUES (?, ?, ?)`,
      [actualConversationId, 'user', message]
    );
    
    // Update conversation message count and last activity
    await pool.query(
      `UPDATE conversations 
       SET message_count = message_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [actualConversationId]
    );
    
    // Get conversation history for context
    const [messages] = await pool.query(
      `SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC`,
      [actualConversationId]
    );
    
    try {
      // Prepare prompt with context
      const model = getAIModel();
      const chatbot = chatbots[0];
      
      // Prepare message context for AI
      let context = `You are ${chatbot.name}, a helpful AI assistant. ${chatbot.prompt}\n\n`;
      context += "Previous conversation:\n";
      
      messages.forEach(msg => {
        context += `${msg.sender === 'user' ? 'User' : chatbot.name}: ${msg.content}\n`;
      });
      
      // Format as a structured conversation for the Gemini API
      const contents = [{
        role: 'user',
        parts: [{ text: context }]
      }];
      
      // Generate AI response
      const result = await model.generateContent({
        contents,
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      });
      
      const response = result.response;
      const aiMessage = response.text();
      
      // Store AI response
      await pool.query(
        `INSERT INTO messages (conversation_id, sender, content)
         VALUES (?, ?, ?)`,
        [actualConversationId, 'bot', aiMessage]
      );
      
      // Update conversation message count again
      await pool.query(
        `UPDATE conversations 
         SET message_count = message_count + 1
         WHERE id = ?`,
        [actualConversationId]
      );
      
      // Return AI response to client
      res.json({
        success: true,
        message: aiMessage,
        conversationId: actualConversationId
      });
    } catch (aiError) {
      console.error('AI processing error:', aiError);
      
      // Store error as bot message
      const errorMessage = "I'm sorry, I encountered an error processing your request. Please try again.";
      
      await pool.query(
        `INSERT INTO messages (conversation_id, sender, content)
         VALUES (?, ?, ?)`,
        [actualConversationId, 'bot', errorMessage]
      );
      
      // Update conversation message count
      await pool.query(
        `UPDATE conversations 
         SET message_count = message_count + 1
         WHERE id = ?`,
        [actualConversationId]
      );
      
      res.status(500).json({ 
        success: false, 
        message: errorMessage,
        conversationId: actualConversationId
      });
    }
  } catch (err) {
    console.error('Error processing message:', err);
    res.status(500).json({ 
      success: false, 
      message: "I'm sorry, something went wrong. Please try again later."
    });
  }
});

module.exports = router;