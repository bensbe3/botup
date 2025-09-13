import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import chatbotService from '../../services/chatbotService';
import './BotTester.css';

const DashboardBotTester = ({ botConfig }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [restartingChat, setRestartingChat] = useState(false);
  const [demoMode, setDemoMode] = useState(false); // State for demo mode
  const [screenSize, setScreenSize] = useState('large');
  const [chatSize, setChatSize] = useState(50); // Chat size as percentage
  const [reduceMotion, setReduceMotion] = useState(false); // New state for reduced motion
  const [isUserInteracting, setIsUserInteracting] = useState(false); // Track user interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Track mouse position

  // Add welcome and sample messages when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessages = [
        {
          role: 'assistant',
          content: botConfig.welcomeMessage || 'Hello! How can I help you today?',
          timestamp: new Date().toISOString()
        },
        {
          role: 'system',
          content: 'Try asking about products, services, or company information',
          timestamp: new Date().toISOString(),
          isDemo: true
        }
      ];
      setMessages(initialMessages);
    }
  }, [botConfig.welcomeMessage, messages.length]);

  // Track mouse position for subtle button movement
  useEffect(() => {
    // Set center values once on mount
    document.documentElement.style.setProperty('--center-x', `${window.innerWidth / 2}px`);
    document.documentElement.style.setProperty('--center-y', `${window.innerHeight / 2}px`);
    
    const handleMouseMove = (e) => {
      // Update state
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      
      // Update CSS variables for mouse follower effect with px units
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    // Update center values on window resize
    const handleResize = () => {
      document.documentElement.style.setProperty('--center-x', `${window.innerWidth / 2}px`);
      document.documentElement.style.setProperty('--center-y', `${window.innerHeight / 2}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Detect if user prefers reduced motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduceMotion(prefersReducedMotion);
    
    // Check for low-end devices
    if ('deviceMemory' in navigator) {
      // If device has less than 4GB of RAM, enable reduced motion
      if (navigator.deviceMemory < 4) {
        setReduceMotion(true);
      }
    }
  }, []);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('small');
      } else if (window.innerWidth < 1200) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Optimized scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesEndRef.current.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  };

  // Scroll to bottom when messages change - optimized with debounce
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Track user interaction to optimize animations
  useEffect(() => {
    const handleUserInteraction = () => {
      setIsUserInteracting(true);
      // Reset the flag after animations would be complete
      setTimeout(() => {
        setIsUserInteracting(false);
      }, 3000);
    };
    
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Get chatbot response
      const response = await chatbotService.generateResponse(
        inputMessage,
        messages,
        botConfig
      );
      
      if (response.success) {
        // Add AI response
        const aiMessage = {
          role: 'assistant',
          content: response.text,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle error
        const errorMessage = {
          role: 'assistant',
          content: `Sorry, I encountered an error. Please try again. (Error: ${response.error || 'Unknown error'})`,
          timestamp: new Date().toISOString(),
          isError: true
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error. Please try again. (Error: ${error.message || 'Unknown error'})`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSend = (text) => {
    setInputMessage(text);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(timestamp));
  };

  const restartConversation = () => {
    setRestartingChat(true);
    setTimeout(() => {
      setMessages([{
        role: 'assistant',
        content: botConfig.welcomeMessage || 'Hello! How can I help you today?',
        timestamp: new Date().toISOString()
      }]);
      setRestartingChat(false);
    }, 500);
  };

  // Get appropriate animation settings based on user preferences
  const getAnimationSettings = () => {
    if (reduceMotion) {
      return {
        duration: 0.15,
        ease: 'linear',
      };
    }
    
    return {
      duration: isUserInteracting ? 0.4 : 0.3,
      ease: [0.16, 1, 0.3, 1], // Fast spring curve
    };
  };

  // Optimize pulse animation with JS instead of CSS
  const pulseAnimation = {
    scale: reduceMotion ? 1 : [1, 1.02, 1], // Reduced scale range for smoother effect
    transition: {
      scale: {
        duration: 3.5, // Increased duration for slower animation
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut", // Smooth easing
      }
    }
  };

  return (
    <div className={`w-full mx-auto flex flex-col items-center ${reduceMotion ? 'reduce-animations' : ''} major-feature-section`} style={{ background: 'var(--dark-bg-color, #121622)' }}>
      {/* Title */}
      <div className="text-center mb-4 w-full max-w-6xl px-4">
        <h2 className="text-2xl font-bold mb-2 text-white">
          Interactive Chat Preview
        </h2>
        <p className="text-gray-300 mb-4 mx-auto">
          This is how your chatbot will appear on your website. Test functionality and appearance below.
        </p>
        
        {/* Size Controls - Only chat size slider */}
        <div className="flex flex-col items-center space-y-3 mb-5 max-w-md mx-auto bg-gray-800/30 p-4 rounded-lg border border-gray-700">
          <div className="w-full">
            <label className="text-gray-300 text-sm mb-1 block">Chat Size: {chatSize}%</label>
            <input 
              type="range" 
              min="30" 
              max="80" 
              value={chatSize} 
              onChange={(e) => setChatSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {/* Main container with optimized centering and responsive sizing */}
      <div className="flex flex-col items-center justify-center w-full" style={{ 
          position: 'relative',
          overflow: 'visible',
          padding: '0 10px'
        }}>
        {/* Device Information Panel - Centered with consistent width */}
        <div className="w-full max-w-6xl p-4 bg-gray-800/50 border border-gray-700 rounded-xl mb-6">
          <h3 className="text-xl font-semibold mb-3 text-white flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Device Information
            </div>
            <span className="text-sm font-normal text-gray-400">Configuration details for your chatbot preview</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Chat Position</div>
              <div className="text-white font-medium capitalize">{botConfig.position || 'Right'}</div>
            </div>
            
            <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Color Scheme</div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: botConfig.primaryColor }}></div>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: botConfig.secondaryColor }}></div>
              </div>
            </div>
            
            <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Icon Style</div>
              <div className="text-white font-medium flex items-center">
                <span className="mr-2 capitalize">{botConfig.iconStyle || 'Chat'}</span>
                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                  {botConfig.iconStyle === 'message' ? (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" stroke="currentColor"></path>
                    </svg>
                  ) : botConfig.iconStyle === 'bot' ? (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor"></path>
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke="currentColor"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Bot Name</div>
              <div className="text-white font-medium">{botConfig.name || 'Chatbot Assistant'}</div>
            </div>
            
            <div className="bg-gray-900/70 p-4 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Messages</div>
              <div className="text-white font-medium">{messages.length} messages</div>
            </div>
          </div>
        </div>

        {/* Laptop Container - Full width and flexible - Optimized for performance */}
        <div className="w-full max-w-6xl flex justify-center">
          {/* Laptop - Fully adaptive with optimized animations */}
          <div className="dashboard-laptop-container relative mx-auto w-full"
               style={{ 
                 display: 'flex', 
                 justifyContent: 'center',
                 width: '100%',
                 perspective: reduceMotion ? 'none' : '1500px'
               }}>
            {/* Static Laptop with flexible dimensions - Optimized animations */}
            <motion.div 
              className="dashboard-laptop w-full max-w-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.8, ease: "easeOut" }}
              style={{ transformStyle: reduceMotion ? 'flat' : 'preserve-3d' }}
            >
              {/* Laptop Screen - Adaptable size with dark borders */}
              <div className="premium-laptop-screen w-full" style={{
                maxWidth: '100%',
                height: 'auto',
                minHeight: '400px',
                aspectRatio: '16/10',
                background: 'linear-gradient(160deg, #121622, #0a0a0a)', // Darker gradient
                borderRadius: '16px 16px 0 0',
                border: '12px solid #2d3748', // Darker border
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 5px 15px rgba(0, 0, 0, 0.4), inset 0 0 2px rgba(255, 255, 255, 0.2)',
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}>
                {/* Enhanced Laptop Camera */}
                <div className="laptop-camera" style={{
                  width: '10px',
                  height: '10px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: 'inset 0 0 3px #000, 0 0 2px rgba(255,255,255,0.3)'
                }}>
                  <div style={{
                    width: '4px',
                    height: '4px',
                    background: '#222',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}></div>
                </div>
                
                {/* Enhanced Website Content - Modern and Clean with smaller text - Optimized */}
                <div className="website-content" style={{
                  width: '100%',
                  height: '100%',
                  background: '#f5f5f5', // Slightly darker background
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '80%', // Reducing overall text size further
                  transform: 'translateZ(0)',
                  willChange: 'transform'
                }}>
                  {/* Website Header - Enhanced Modern Design with darker colors */}
                  <div style={{ 
                    background: `linear-gradient(135deg, ${botConfig.primaryColor || '#7B36D9'}, ${botConfig.secondaryColor || '#2D0B6D'})`, // Darker purple gradient
                    padding: '14px 20px',
                    color: 'white'
                  }}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="text-base font-bold">{botConfig.siteName || 'YourBrand'}</div>
                      </div>
                      <div className="flex space-x-4">
                        <span className="font-medium text-sm">Home</span>
                        <span className="font-medium text-sm">Services</span>
                        <span className="font-medium text-sm">About</span>
                        <span className="font-medium text-sm">Contact</span>
                      </div>
                    </div>
                  </div>

                  {/* Website Hero Section - Enhanced Modern Design with darker overlay */}
                  <div style={{ 
                    padding: '20px 30px', 
                    background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80")', // Darker overlay
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '80px'
                  }}>
                    <div className="max-w-2xl">
                      <h1 className="text-xl text-white font-bold mb-1">Welcome to {botConfig.siteName || 'YourBrand'}</h1>
                      <p className="mb-2 text-white/90 font-medium text-xs">We provide industry-leading solutions for your business needs.</p>
                      <div className="flex space-x-3">
                        <button className="px-3 py-1 text-white rounded-lg font-medium text-xs" style={{ backgroundColor: botConfig.primaryColor || '#7B36D9' }}>
                          Get Started
                        </button>
                        <button className="px-3 py-1 text-white bg-white/20 rounded-lg font-medium text-xs backdrop-blur-sm">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Website Content Section - Enhanced Modern Grid with smaller text and darker bg */}
                  <div className="p-5 flex-grow overflow-auto" style={{ 
                    color: '#333', 
                    background: '#f0f0f0', // Slightly darker background
                    position: 'relative'
                  }}>
                    <h2 className="text-base font-bold mb-3">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <div className="w-6 h-6 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${botConfig.primaryColor || '#7B36D9'}20` }}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" style={{ color: botConfig.primaryColor || '#7B36D9' }}>
                            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h3 className="font-bold text-xs mb-1">Service 1</h3>
                        <p className="text-gray-600 text-xxs">Premium quality service tailored to your needs</p>
                      </div>
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <div className="w-6 h-6 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${botConfig.primaryColor || '#7B36D9'}20` }}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" style={{ color: botConfig.primaryColor || '#7B36D9' }}>
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h3 className="font-bold text-xs mb-1">Service 2</h3>
                        <p className="text-gray-600 text-xxs">Expert solutions with guaranteed results</p>
                      </div>
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <div className="w-6 h-6 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${botConfig.primaryColor || '#7B36D9'}20` }}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" style={{ color: botConfig.primaryColor || '#7B36D9' }}>
                            <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h3 className="font-bold text-xs mb-1">Service 3</h3>
                        <p className="text-gray-600 text-xxs">Innovative approaches to maximize efficiency</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Chatbot Widget - With darker colors */}
                  <AnimatePresence mode="wait">
                    {chatOpen && (
                      <motion.div
                        initial={{ y: 10, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 10, opacity: 0, scale: 0.95 }}
                        transition={getAnimationSettings()}
                        className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 z-30"
                        style={{
                          position: 'absolute',
                          bottom: '20px',
                          [botConfig.position === 'left' ? 'left' : 'right']: '20px',
                          width: `${chatSize}%`,
                          maxWidth: '380px',
                          minWidth: '280px',
                          height: 'min(60%, 430px)',
                          minHeight: '350px',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.25), 0 3px 12px rgba(0,0,0,0.12)', // Darker shadow
                          transition: 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                          willChange: 'transform, opacity',
                          transform: 'translateZ(0)'
                        }}
                      >
                        {/* Chat content with size slider */}
                        <div className="px-4 py-3 flex items-center justify-between text-white" style={{ 
                          background: `linear-gradient(135deg, ${botConfig.primaryColor || '#7B36D9'}, ${botConfig.secondaryColor || '#2D0B6D'})`,
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          flexShrink: 0
                        }}>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                              {botConfig.iconStyle === 'message' ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ stroke: botConfig.primaryColor || '#7B36D9' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                </svg>
                              ) : botConfig.iconStyle === 'bot' ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ stroke: botConfig.primaryColor || '#7B36D9' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ stroke: botConfig.primaryColor || '#7B36D9' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                </svg>
                              )}
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium">{botConfig.name || 'Chatbot Assistant'}</div>
                              <div className="text-xs opacity-80">Online</div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={restartConversation}
                              className="text-white/90 hover:text-white transition-colors"
                              aria-label="Restart conversation"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => setChatOpen(false)}
                              className="text-white/90 hover:text-white transition-colors"
                              aria-label="Close chat"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {/* Chat size slider */}
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                          <input 
                            type="range" 
                            min="30" 
                            max="80" 
                            value={chatSize} 
                            onChange={(e) => setChatSize(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                            style={{ accentColor: botConfig.primaryColor || '#7B36D9' }}
                          />
                        </div>
                        
                        {/* Enhanced Chat Messages with Smooth Animations - Optimized */}
                        <AnimatePresence mode="wait">
                          {restartingChat ? (
                            <motion.div 
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex-1 p-4 overflow-y-auto bg-gray-50 flex items-center justify-center"
                              style={{ 
                                flex: '1 1 auto',
                                overflow: 'hidden',
                                flexShrink: 0
                              }}
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
                                <p className="text-sm text-gray-500">Restarting conversation...</p>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="messages"
                              className="flex-1 p-4 bg-gray-50 overflow-y-auto" 
                              style={{ 
                                flex: '1 1 auto',
                                height: '0',
                                minHeight: '0',
                                display: 'flex',
                                flexDirection: 'column',
                                transform: 'translateZ(0)',
                                willChange: 'transform'
                              }}
                            >
                              <div className="flex flex-col flex-grow overflow-y-auto" style={{
                                WebkitOverflowScrolling: 'touch',
                                willChange: 'transform',
                                transform: 'translateZ(0)'
                              }}>
                                {messages.map((msg, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                      delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.3),
                                      duration: 0.2, 
                                      ease: "easeOut" 
                                    }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'} mb-3`}
                                  >
                                    {msg.role === 'system' ? (
                                      <div className="bg-yellow-50 text-yellow-700 text-xs px-3 py-1 rounded-full border border-yellow-200">
                                        {msg.content}
                                      </div>
                                    ) : (
                                      <div
                                        className={`max-w-xs px-4 py-2 rounded-xl ${
                                          msg.role === 'user'
                                            ? 'text-white rounded-br-none'
                                            : 'bg-white shadow-md text-gray-800 rounded-bl-none border border-gray-100'
                                        }`}
                                        style={{ 
                                          backgroundColor: msg.role === 'user' ? botConfig.primaryColor || '#7B36D9' : undefined,
                                          borderColor: msg.isError ? 'rgba(239, 68, 68, 0.5)' : undefined,
                                          maxWidth: '260px'
                                        }}
                                      >
                                        <p className="text-sm">{msg.content}</p>
                                        <p
                                          className={`text-xs mt-1 text-right ${
                                            msg.role === 'user' ? 'opacity-80' : 'text-gray-500'
                                          }`}
                                        >
                                          {formatTimestamp(msg.timestamp)}
                                        </p>
                                      </div>
                                    )}
                                  </motion.div>
                                ))}

                                {isLoading && (
                                  <div className="flex justify-start mb-3">
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.2 }}
                                      className="bg-white px-4 py-2.5 rounded-xl rounded-bl-none shadow-md border border-gray-100"
                                    >
                                      <div className="flex space-x-1.5">
                                        <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                                        <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                                        <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                                      </div>
                                    </motion.div>
                                  </div>
                                )}
                                <div ref={messagesEndRef} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Enhanced Quick Response Options */}
                        <div className="border-t border-gray-200 p-2 bg-white flex items-center space-x-2 overflow-x-auto" style={{ flexShrink: 0 }}>
                          <button 
                            onClick={() => handleQuickSend("What services do you offer?")}
                            className="px-3 py-1.5 text-xs rounded-full border text-gray-600 hover:bg-gray-50 flex-shrink-0 transition-colors"
                          >
                            What services do you offer?
                          </button>
                          <button 
                            onClick={() => handleQuickSend("How does pricing work?")}
                            className="px-3 py-1.5 text-xs rounded-full border text-gray-600 hover:bg-gray-50 flex-shrink-0 transition-colors"
                          >
                            How does pricing work?
                          </button>
                          <button 
                            onClick={() => handleQuickSend("Can you help me?")}
                            className="px-3 py-1.5 text-xs rounded-full border text-gray-600 hover:bg-gray-50 flex-shrink-0 transition-colors"
                          >
                            Can you help me?
                          </button>
                        </div>
                        
                        {/* Enhanced Chat Input */}
                        <form 
                          onSubmit={handleSendMessage}
                          className="border-t border-gray-200 p-3 flex items-center bg-white"
                          style={{ flexShrink: 0 }}
                        >
                          <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 rounded-full bg-gray-100 border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm"
                            style={{ 
                              outlineColor: botConfig.primaryColor || '#7B36D9',
                              focusRing: botConfig.primaryColor || '#7B36D9',
                            }}
                          />
                          <button
                            type="submit"
                            className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center ${
                              inputMessage.trim() ? 'text-white' : 'bg-gray-200 text-gray-400'
                            } transition-colors`}
                            style={{ 
                              backgroundColor: inputMessage.trim() ? (botConfig.primaryColor || '#7B36D9') : undefined,
                            }}
                            disabled={!inputMessage.trim() || isLoading}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Chat toggle button - Optimized animation */}
                  <AnimatePresence>
                    {!chatOpen && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: 1, 
                          scale: reduceMotion ? 1 : pulseAnimation.scale,
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ 
                          duration: 0.3, // Slower initial animation
                          ...(!reduceMotion && pulseAnimation.transition)
                        }}
                        onClick={() => setChatOpen(true)}
                        className="absolute rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover-glow"
                        style={{
                          bottom: '20px',
                          right: botConfig.position === 'left' ? 'auto' : '20px',
                          left: botConfig.position === 'left' ? '20px' : 'auto',
                          width: '60px', // Bigger chat button
                          height: '60px', // Bigger chat button
                          backgroundColor: botConfig.primaryColor || '#7B36D9', // Darker purple
                          boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 0 8px rgba(123, 54, 217, 0.15), inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -2px 3px rgba(0,0,0,0.2)', // Less bright glow
                          transform: 'translate3d(0,0,0)',
                          willChange: 'transform, opacity'
                        }}
                      >
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Control buttons - Optimized hover effects with darker colors */}
        <div className="flex justify-center space-x-8 mt-8 mb-12 w-full">
          <motion.button
            whileHover={reduceMotion ? {} : { scale: 1.05, boxShadow: '0 10px 25px -3px rgba(79, 70, 229, 0.4)', backgroundColor: '#4338ca' }}
            whileTap={reduceMotion ? {} : { scale: 0.95 }}
            onClick={() => setChatOpen(!chatOpen)}
            className="px-6 py-3 rounded-lg bg-indigo-700 text-white flex items-center space-x-3 shadow-md transition-all duration-200"
          >
            {chatOpen ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Close Chat</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Open Chat</span>
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={reduceMotion ? {} : { scale: 1.05, boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3)', backgroundColor: '#374151' }}
            whileTap={reduceMotion ? {} : { scale: 0.95 }}
            onClick={restartConversation}
            className="px-6 py-3 rounded-lg bg-gray-800 text-white flex items-center space-x-3 shadow-md transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Restart Conversation</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default DashboardBotTester; 