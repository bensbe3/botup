import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ChatbotWidget = ({
  botId,
  name = 'BotUp Assistant',
  primaryColor = '#4F46E5',
  position = 'right',
  iconStyle = 'chat',
  welcomeMessage = 'Hello! How can I help you today?',
  collectUserData = true,
  showBranding = true,
  autoReply = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userInfoCollected, setUserInfoCollected] = useState(!collectUserData);
  const messagesEndRef = useRef(null);
  
  // Add welcome message on component mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: welcomeMessage,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [welcomeMessage]);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      simulateBotResponse(message);
    }, 1000 + Math.random() * 1000);
  };
  
  const simulateBotResponse = (userMessage) => {
    // Simple echo bot with some predefined responses
    let botResponseText = '';
    
    // Simple logic to generate responses based on user message
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      botResponseText = 'Hello there! How can I assist you today?';
    } else if (lowerCaseMessage.includes('help')) {
      botResponseText = 'I\'m here to help! What do you need assistance with?';
    } else if (lowerCaseMessage.includes('pricing') || lowerCaseMessage.includes('cost')) {
      botResponseText = 'Our pricing starts at $9.99/month for the basic plan. Would you like to see all our pricing options?';
    } else if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('support')) {
      botResponseText = 'You can reach our support team at support@example.com or call us at (555) 123-4567.';
    } else if (lowerCaseMessage.includes('thank')) {
      botResponseText = 'You\'re welcome! Is there anything else I can help you with?';
    } else {
      botResponseText = `I understand you're asking about "${userMessage}". Let me check that for you. Based on the information I have, I would recommend checking our documentation for more details.`;
    }
    
    const botMessage = {
      id: Date.now(),
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setIsTyping(false);
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };
  
  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to your server
    setUserInfoCollected(true);
    
    // Add a greeting message with the user's name
    const greetingMessage = {
      id: Date.now(),
      text: `Thanks, ${userName}! How can I help you today?`,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, greetingMessage]);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  
  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(timestamp);
  };
  
  const renderMessages = () => {
    return messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${
          msg.sender === 'user' ? 'justify-end' : 'justify-start'
        } mb-4`}
      >
        <div
          className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
            msg.sender === 'user'
              ? 'text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
          style={{ backgroundColor: msg.sender === 'user' ? primaryColor : '' }}
        >
          <p className="text-sm">{msg.text}</p>
          <p
            className={`text-xs mt-1 text-right ${
              msg.sender === 'user' ? 'opacity-80' : 'text-gray-500'
            }`}
          >
            {formatTimestamp(msg.timestamp)}
          </p>
        </div>
      </div>
    ));
  };
  
  return (
    <>
      {/* Chatbot Button */}
      <div 
        className={`fixed ${position === 'left' ? 'left-5' : 'right-5'} bottom-5 z-10`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="interactive-button w-15 h-15 rounded-full shadow-lg flex items-center justify-center text-white relative hover-glow"
          style={{ 
            backgroundColor: primaryColor,
            boxShadow: '0 5px 15px rgba(0,0,0,0.4), 0 0 20px rgba(79, 70, 229, 0.4)',
            width: '60px',
            height: '60px'
          }}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <>
              {iconStyle === 'chat' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              )}
              {!isOpen && messages.filter(m => m.sender === 'bot' && !m.read).length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {messages.filter(m => m.sender === 'bot' && !m.read).length}
                </span>
              )}
            </>
          )}
        </button>
      </div>
      
      {/* Chatbot Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`fixed ${position === 'left' ? 'left-5' : 'right-5'} bottom-24 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 z-10 flex flex-col`}
            style={{ 
              maxHeight: 'calc(100vh - 120px)',
              backgroundColor: '#1a1f2e', 
              borderColor: 'rgba(255, 255, 255, 0.07)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Chat Header */}
            <div 
              className="px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                  {iconStyle === 'chat' ? (
                    <svg className="w-5 h-5" fill="none" stroke={primaryColor} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke={primaryColor} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  )}
                </div>
                <div className="ml-2">
                  <div className="text-sm font-medium text-white">{name}</div>
                  <div className="text-xs text-white opacity-80">Online</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ backgroundColor: '#121622', color: '#e6e8f0' }}>
              {renderMessages()}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="bg-gray-500 rounded-full h-2 w-2 animate-bounce"></div>
                      <div className="bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="bg-gray-500 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* User Information Form */}
            {collectUserData && !userInfoCollected && (
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleUserInfoSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="userEmail"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Start Conversation
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Chat Input */}
            {(!collectUserData || userInfoCollected) && (
              <div className="p-4 border-t border-gray-200" style={{ borderColor: 'rgba(255, 255, 255, 0.07)', backgroundColor: '#1a1f2e' }}>
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    style={{ 
                      backgroundColor: '#202736', 
                      borderColor: 'rgba(255, 255, 255, 0.07)',
                      color: '#e6e8f0'
                    }}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-r-lg text-white hover-glow"
                    style={{ backgroundColor: primaryColor }}
                    aria-label="Send message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </form>
              </div>
            )}
            
            {/* Branding Footer */}
            {showBranding && (
              <div className="px-4 py-2 text-center text-xs text-gray-500 border-t border-gray-200">
                Powered by <a href="https://botup.io" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-indigo-600">BotUp</a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;