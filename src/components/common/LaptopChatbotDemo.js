import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LaptopChatbotDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [isRotated, setIsRotated] = useState(false);

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
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      simulateBotResponse(message);
    }, 1000 + Math.random() * 1000);
  };
  
  const simulateBotResponse = (userMessage) => {
    // Simple logic to generate responses based on user message
    const lowerCaseMessage = userMessage.toLowerCase();
    let botResponseText = '';
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      botResponseText = 'Hello there! How can I assist you today?';
    } else if (lowerCaseMessage.includes('help')) {
      botResponseText = 'I\'m here to help! What do you need assistance with?';
    } else if (lowerCaseMessage.includes('feature') || lowerCaseMessage.includes('can you')) {
      botResponseText = 'Our chatbot features include natural language processing, multi-channel support, analytics dashboard, and customizable responses. What would you like to know more about?';
    } else if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost')) {
      botResponseText = 'We offer several pricing tiers starting at $9.99/month. Would you like to see the full pricing breakdown?';
    } else if (lowerCaseMessage.includes('thank')) {
      botResponseText = 'You\'re welcome! Is there anything else I can help you with?';
    } else {
      botResponseText = `I understand you're asking about "${userMessage}". That's an interesting question! Our team is constantly improving our services to provide the best experience for our users.`;
    }
    
    const botMessage = {
      id: Date.now(),
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setIsTyping(false);
    setMessages(prevMessages => [...prevMessages, botMessage]);
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(timestamp);
  };

  // Handle laptop rotation
  const toggleRotation = () => {
    setIsRotated(!isRotated);
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 no-glow">
      <div className="laptop-container relative no-glow" style={{ perspective: '1500px' }}>
        {/* 3D Laptop */}
        <motion.div 
          className="laptop no-glow"
          animate={{
            rotateX: isRotated ? 20 : 10,
            rotateY: isRotated ? 15 : 0
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onHoverStart={() => setIsRotated(true)}
          onHoverEnd={() => setIsRotated(false)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Laptop Screen */}
          <div className="laptop-screen website-shadow no-glow" style={{
            width: '700px',
            height: '440px',
            background: '#222',
            borderRadius: '16px 16px 0 0',
            border: '12px solid #333',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Laptop Camera */}
            <div className="laptop-camera no-glow"></div>
            
            {/* Website Content */}
            <div className="website-content no-glow" style={{
              width: '100%',
              height: '100%',
              background: '#fff',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Website Header */}
              <div className="no-glow" style={{ background: 'linear-gradient(135deg, #9D4EDD, #3C096C)', padding: '12px 20px', color: 'white' }}>
                <div className="flex justify-between items-center no-glow">
                  <div className="text-xl font-bold no-glow">BotUp</div>
                  <div className="flex space-x-4 no-glow">
                    <span className="no-glow">Home</span>
                    <span className="no-glow">Features</span>
                    <span className="no-glow">Pricing</span>
                    <span className="no-glow">About</span>
                    <span className="no-glow">Contact</span>
                  </div>
                </div>
              </div>

              {/* Website Hero Section */}
              <div className="no-glow" style={{ 
                padding: '30px 20px', 
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div className="text-white max-w-lg no-glow">
                  <h1 className="text-3xl font-bold mb-2 no-glow">Powerful Chatbot Solutions for Your Business</h1>
                  <p className="mb-4 no-glow">Enhance customer experience with AI-powered conversational bots</p>
                  <button className="px-4 py-2 bg-space-purple text-white rounded font-medium no-glow">Get Started</button>
                </div>
              </div>

              {/* Website Content Section */}
              <div className="no-glow" style={{ padding: '20px', color: '#333' }}>
                <h2 className="text-xl font-bold mb-3 no-glow">Why Choose BotUp?</h2>
                <div className="grid grid-cols-3 gap-4 no-glow">
                  <div className="p-3 bg-gray-100 rounded-lg shadow-sm no-glow">
                    <h3 className="font-bold no-glow">24/7 Support</h3>
                    <p className="text-sm no-glow">Always available to help your customers</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg shadow-sm no-glow">
                    <h3 className="font-bold no-glow">Easy Integration</h3>
                    <p className="text-sm no-glow">Works with your existing platforms</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg shadow-sm no-glow">
                    <h3 className="font-bold no-glow">AI-Powered</h3>
                    <p className="text-sm no-glow">Smart responses that learn over time</p>
                  </div>
                </div>
              </div>

              {/* Chatbot Widget Button */}
              <AnimatePresence>
                {!isOpen && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ delay: 1, duration: 0.3 }}
                    className="fixed bottom-4 right-4 z-10 chat-pop-in no-glow"
                    onClick={() => setIsOpen(true)}
                    style={{
                      position: 'absolute',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="bg-space-purple text-white p-3 rounded-full shadow-lg flex items-center justify-center no-glow">
                      <svg className="w-6 h-6 no-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full no-glow">
                      1
                    </div>
                    
                    {/* Message preview bubble */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 2, duration: 0.3 }}
                      className="absolute bottom-16 right-0 bg-white p-3 rounded-lg shadow-lg max-w-xs no-glow"
                      style={{ width: '220px' }}
                    >
                      <div className="text-sm font-medium text-gray-800 no-glow">BotUp Assistant</div>
                      <div className="text-xs text-gray-600 mt-1 no-glow">Hello! How can I help you today?</div>
                      <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white no-glow"></div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chatbot Widget */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 z-20 no-glow"
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      width: '320px',
                      maxHeight: '400px',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Chat Header */}
                    <div className="px-4 py-3 flex items-center justify-between bg-space-purple text-white no-glow">
                      <div className="flex items-center no-glow">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center no-glow">
                          <svg className="w-5 h-5 no-glow" fill="none" stroke="#9D4EDD" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                          </svg>
                        </div>
                        <div className="ml-2 no-glow">
                          <div className="text-sm font-medium no-glow">BotUp Assistant</div>
                          <div className="text-xs opacity-80 no-glow">Online</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-gray-200 no-glow"
                        aria-label="Close chat"
                      >
                        <svg className="w-5 h-5 no-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 no-glow" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {messages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.2 }}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 no-glow`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg no-glow ${
                              msg.sender === 'user'
                                ? 'bg-space-purple text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm no-glow">{msg.text}</p>
                            <p
                              className={`text-xs mt-1 text-right no-glow ${
                                msg.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                              }`}
                            >
                              {formatTimestamp(msg.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start mb-4 no-glow">
                          <div className="bg-gray-200 px-4 py-2 rounded-lg rounded-bl-none no-glow">
                            <div className="flex space-x-1 no-glow">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse no-glow"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-100 no-glow"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200 no-glow"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Chat Input */}
                    <form 
                      onSubmit={handleSendMessage}
                      className="border-t border-gray-200 p-3 flex no-glow"
                    >
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-space-purple no-glow"
                      />
                      <button
                        type="submit"
                        className={`ml-2 p-2 rounded-full no-glow ${message.trim() ? 'bg-space-purple text-white' : 'bg-gray-300 text-gray-500'}`}
                        disabled={!message.trim() || isTyping}
                      >
                        <svg className="w-5 h-5 no-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Laptop Base */}
          <div className="laptop-base no-glow" style={{
            width: '700px',
            height: '30px',
            background: 'linear-gradient(to bottom, #333, #222)',
            borderRadius: '0 0 20px 20px',
            transform: 'rotateX(-90deg) translateZ(-15px) translateY(-15px)',
            transformOrigin: 'top',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <div className="no-glow" style={{
              width: '25%',
              height: '5px',
              background: '#444',
              margin: '0 auto',
              borderRadius: '0 0 5px 5px'
            }}></div>
          </div>
          
          {/* Laptop Bottom */}
          <div className="laptop-bottom no-glow" style={{
            width: '700px',
            height: '440px',
            background: 'linear-gradient(to bottom, #333, #222)',
            borderRadius: '10px',
            transform: 'rotateX(-180deg) translateZ(30px)',
            transformOrigin: 'top',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Apple-like logo (simplified) */}
            <div className="no-glow" style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>
          </div>
        </motion.div>
        
        {/* Laptop Shadow */}
        <div className="no-glow" style={{
          width: '750px',
          height: '60px',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.2), rgba(0,0,0,0) 60%)',
          position: 'absolute',
          bottom: '-70px',
          left: '-25px',
          zIndex: '-1'
        }}></div>
      </div>
    </div>
  );
};

export default LaptopChatbotDemo; 