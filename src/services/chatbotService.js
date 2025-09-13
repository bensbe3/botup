/**
 * BotUp - Chatbot Platform
 * Copyright (c) 2024 Mohamed Bensbaa. All rights reserved.
 * 
 * This file is part of the BotUp chatbot platform.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 */

// Service for handling chatbot responses
class ChatbotService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    console.log('Chatbot Service initialized');
  }

  // Generate a response from the chatbot
  async generateResponse(prompt, conversationHistory = [], botConfig = {}) {
    try {
      if (!prompt || typeof prompt !== 'string') {
        throw new Error('Invalid prompt: Prompt must be a non-empty string');
      }

      // Prepare the conversation context
      const context = this._prepareContext(prompt, conversationHistory, botConfig);
      console.log('Prepared context:', context);
      
      // Call the backend API
      const response = await fetch(`${this.apiUrl}/chatbot/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: context,
          botConfig
        }),
      });

      if (!response.ok) {
        throw new Error(`Chatbot service error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error from chatbot service');
      }

      return {
        text: data.response,
        success: true
      };
    } catch (error) {
      console.error('Chatbot response generation error:', error);
      return {
        text: 'I apologize, but I encountered an error while processing your request.',
        success: false,
        error: error.message
      };
    }
  }

  // Prepare the conversation context with bot configuration
  _prepareContext(prompt, conversationHistory, botConfig) {
    try {
      const { name = 'Assistant', prompt: botPrompt = '', welcomeMessage = '' } = botConfig;
      
      // Build the system prompt
      let context = `You are ${name}, a helpful chatbot assistant. `;
      
      if (botPrompt) {
        context += `${botPrompt} `;
      }
      
      context += `\n\nYou should respond in a helpful, concise, and friendly manner.`;
      
      // Add welcome message if this is the first message
      if (conversationHistory.length === 0 && welcomeMessage) {
        context += `\n\nYour welcome message is: "${welcomeMessage}"`;
      }
      
      // Add conversation history
      if (conversationHistory.length > 0) {
        context += '\n\nPrevious conversation:\n';
        conversationHistory.forEach(msg => {
          context += `${msg.role === 'user' ? 'User' : name}: ${msg.content}\n`;
        });
      }
      
      // Add the current prompt
      context += `\nUser: ${prompt}\n${name}:`;
      
      return context;
    } catch (error) {
      console.error('Error preparing context:', error);
      return `You are a helpful assistant. User asked: ${prompt}`;
    }
  }
}

// Create and export a singleton instance
const chatbotService = new ChatbotService();
export default chatbotService;
