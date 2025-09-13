/**
 * BotUp - Chatbot Platform
 * Copyright (c) 2024 Mohamed Bensbaa. All rights reserved.
 * 
 * This file is part of the BotUp chatbot platform.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 */

const express = require('express');
const router = express.Router();

// Response templates for chatbot interactions
const CHATBOT_RESPONSES = [
  "I'm here to help you with any questions about our service. How can I assist you today?",
  
  "That's an interesting question! Let me help you with that. Could you provide a bit more detail so I can give you the best possible answer?",
  
  "Thank you for reaching out! I'm designed to help answer your questions and provide support. What would you like to know?",
  
  "I understand you're looking for information. Let me help you find what you need. Could you tell me more about what you're trying to accomplish?",
  
  "I'm here to assist you! Based on your message, I can help you with our services, answer questions, or connect you with the right resources.",
  
  "Thanks for your message! I'm designed to provide helpful responses and support. What specific information are you looking for?",
  
  "I appreciate you taking the time to reach out. I'm here to help make your experience better. How can I assist you today?",
  
  "I'm ready to help you with any questions or concerns you might have. What would you like to know about our services?"
];

// Generate chatbot response
router.post('/generate', async (req, res) => {
  try {
    const { prompt, botConfig } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Return a contextual response
    const response = CHATBOT_RESPONSES[Math.floor(Math.random() * CHATBOT_RESPONSES.length)];
    
    // Get custom name from bot config
    const botName = botConfig?.name || 'Assistant';
    
    // Add a small delay to simulate processing
    setTimeout(() => {
      res.json({
        success: true,
        response: response
      });
    }, 1000);

  } catch (error) {
    console.error('Chatbot response generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 