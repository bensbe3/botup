const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDjcHYcLdHEkuQ9p91T5y02GCFGHOiOOAw');

// Track usage to stay within limits
let apiCallCount = 0;

// Human handover detection phrases
const HUMAN_TRIGGER_PHRASES = [
  'speak to a human',
  'talk to an agent',
  'speak to a person',
  'talk to a representative',
  'connect me with someone',
  'real person',
  'human support',
  'speak to customer service',
  'talk to someone',
  'agent please',
  'human please'
];

/**
 * Generate a chatbot response to a user message
 * @param {string} userMessage - The message from the user
 * @param {number} botId - The ID of the chatbot
 * @param {number} conversationId - The ID of the conversation
 * @returns {Promise<{message: string, requiresHuman: boolean}>} - The bot response and whether it needs human intervention
 */
async function generateChatbotResponse(userMessage, botId, conversationId) {
  try {
    // Check if human is explicitly requested
    if (containsHumanRequest(userMessage)) {
      return {
        message: "I'll connect you with a human agent who can better assist you. Please wait a moment.",
        requiresHuman: true
      };
    }
    
    // Get the chatbot configuration
    const pool = require('../DB/routes/db');
    const [bots] = await pool.query(
      'SELECT * FROM chatbots WHERE id = ?',
      [botId]
    );
    
    if (bots.length === 0) {
      return {
        message: "I'm sorry, I couldn't find the chatbot configuration.",
        requiresHuman: false
      };
    }
    
    const bot = bots[0];
    const botPrompt = bot.prompt || "You are a friendly AI assistant. Answer questions helpfully and concisely.";
    
    // Get conversation history
    const [messages] = await pool.query(
      `SELECT sender, content 
       FROM messages 
       WHERE conversation_id = ? 
       ORDER BY timestamp ASC 
       LIMIT 10`,
      [conversationId]
    );
    
    // Format conversation history for context
    let contextString = `You are an AI assistant named ${bot.name || "Assistant"}. ${botPrompt}\n\n`;
    
    if (messages.length > 0) {
      contextString += "Previous conversation:\n";
      messages.forEach(msg => {
        const role = msg.sender === 'user' ? 'User' : 'Assistant';
        contextString += `${role}: ${msg.content}\n`;
      });
    }
    
    contextString += `\nUser: ${userMessage}\nAssistant:`;
    
    // For development mode
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'AIzaSyDjcHYcLdHEkuQ9p91T5y02GCFGHOiOOAw') {
      console.log('Development mode: Not making real API call');
      console.log(`Bot prompt: ${botPrompt}`);
      console.log(`User message: ${userMessage}`);
      
      // Simulate AI detecting need for human sometimes
      if (userMessage.toLowerCase().includes('complex') || 
          userMessage.toLowerCase().includes('difficult') ||
          userMessage.length > 100) {
        return {
          message: "This seems like a complex question. Let me connect you with a human agent who can help you better.",
          requiresHuman: true
        };
      }
      
      return {
        message: `[Development Mode] This is a mock response to: "${userMessage}"`,
        requiresHuman: false
      };
    }
    
    // Increment usage counter
    apiCallCount++;
    console.log(`API call count: ${apiCallCount}`);
    
    // First, check if message might need human attention
    const needsHumanCheck = await checkIfNeedsHumanAttention(userMessage);
    if (needsHumanCheck) {
      return {
        message: "I'd like to connect you with a human agent for better assistance with this question. Please wait a moment.",
        requiresHuman: true
      };
    }
    
    // Generate response using Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(contextString);
    const response = result.response;
    const text = response.text();
    
    return {
      message: text,
      requiresHuman: false
    };
  } catch (error) {
    console.error("AI API error:", error);
    
    // On error, suggest human assistance
    return {
      message: "I'm having trouble processing your request right now. Let me connect you with a human agent who can help.",
      requiresHuman: true
    };
  }
}

/**
 * Check if the message explicitly requests a human
 * @param {string} message - The user message
 * @returns {boolean} - Whether the message contains a human request
 */
function containsHumanRequest(message) {
  const lowerMessage = message.toLowerCase();
  return HUMAN_TRIGGER_PHRASES.some(phrase => lowerMessage.includes(phrase));
}

/**
 * Check if message might need human attention based on complexity
 * @param {string} message - The user message
 * @returns {Promise<boolean>} - Whether the message needs human attention
 */
async function checkIfNeedsHumanAttention(message) {
  try {
    // Use Gemini to detect if the query is complex or beyond the bot's capabilities
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Task: Determine if the following message requires human attention. 
    Reply with just "YES" if the message is complex, asks for special handling, or would benefit from human judgment. 
    Reply with just "NO" if the message is simple and can be handled by an AI assistant.
    
    Message: "${message}"
    
    Reply (only YES or NO):`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const decision = response.text().trim().toUpperCase();
    
    return decision === 'YES';
  } catch (error) {
    console.error("Error in human needs detection:", error);
    return false; // Default to AI handling on error
  }
}

/**
 * Get current AI usage stats
 * @returns {Object} - The usage statistics
 */
function getUsageStats() {
  return {
    apiCallCount,
  };
}

module.exports = {
  generateChatbotResponse,
  getUsageStats
}; 