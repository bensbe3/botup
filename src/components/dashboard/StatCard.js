import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, icon, color }) => {
  // Color classes based on type
  const colorClasses = {
    indigo: {
      bg: 'bg-n8n-blue/20',
      text: 'text-n8n-blue',
      icon: 'text-n8n-blue',
      glow: 'group-hover:shadow-[0_0_15px_rgba(106,117,202,0.5)]',
      border: 'border-n8n-blue/30',
      dust: 'dust-blue',
    },
    green: {
      bg: 'bg-n8n-green/10',
      text: 'text-n8n-green',
      icon: 'text-n8n-green',
      glow: 'group-hover:shadow-n8n-glow',
      border: 'border-n8n-green/30',
      dust: 'dust-green',
    },
    blue: {
      bg: 'bg-n8n-lightBlue/10',
      text: 'text-n8n-lightBlue',
      icon: 'text-n8n-lightBlue',
      glow: 'group-hover:shadow-[0_0_15px_rgba(58,191,228,0.5)]',
      border: 'border-n8n-lightBlue/30',
      dust: 'dust-blue',
    },
    purple: {
      bg: 'bg-n8n-purple/10',
      text: 'text-n8n-purple',
      icon: 'text-n8n-purple',
      glow: 'group-hover:shadow-[0_0_15px_rgba(132,71,255,0.5)]',
      border: 'border-n8n-purple/30',
      dust: 'dust-purple',
    },
    red: {
      bg: 'bg-n8n-orange/10',
      text: 'text-n8n-orange',
      icon: 'text-n8n-orange',
      glow: 'group-hover:shadow-[0_0_15px_rgba(255,109,90,0.5)]',
      border: 'border-n8n-orange/30',
      dust: 'dust-orange',
    },
    yellow: {
      bg: 'bg-n8n-yellow/10',
      text: 'text-n8n-yellow',
      icon: 'text-n8n-yellow',
      glow: 'group-hover:shadow-[0_0_15px_rgba(255,204,0,0.5)]',
      border: 'border-n8n-yellow/30',
      dust: 'dust-orange',
    },
  };
  
  const selectedColor = colorClasses[color] || colorClasses.green;
  
  // Generate random dust particles
  const generateDustParticles = () => {
    const particles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
        transform: `scale(${0.5 + Math.random() * 0.5})`,
      };
      
      particles.push(
        <div 
          key={i} 
          className={`dust-particle ${selectedColor.dust}`} 
          style={style} 
        />
      );
    }
    
    return particles;
  };
  
  // Render icon based on type
  const renderIcon = () => {
    switch (icon) {
      case 'chat':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        );
      case 'clock':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'thumbs-up':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
          </svg>
        );
      case 'users':
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        );
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group glassmorphism backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-cursor-lightgray/20 transition-all duration-300 hover:border-opacity-50 hover:translate-y-[-5px] metric-card glow-container"
      whileHover={{ scale: 1.02 }}
    >
      <div className="dust-container">
        {generateDustParticles()}
      </div>
      <div className="p-5">
        <div className="flex items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`flex-shrink-0 ${selectedColor.bg} rounded-2xl p-3.5 border ${selectedColor.border} ${selectedColor.glow} transition-all duration-300 animate-pulse-slow`}
          >
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ 
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
                repeat: Infinity,
                repeatDelay: 5
              }}
              className={`${selectedColor.icon}`}
            >
              {renderIcon()}
            </motion.div>
          </motion.div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-cursor-muted truncate">
                {title}
              </dt>
              <dd>
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className={`text-2xl font-semibold ${selectedColor.text} tracking-tight`}
                >
                  {value}
                </motion.div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-cursor-gray/20 backdrop-blur-sm px-5 py-3 rounded-b-2xl border-t border-white/5">
        <div className="text-sm">
          {change !== undefined && (
            <span
              className={
                change >= 0
                  ? 'text-n8n-green font-medium flex items-center'
                  : 'text-n8n-orange font-medium flex items-center'
              }
            >
              {change >= 0 ? (
                <svg
                  className="self-center flex-shrink-0 h-4 w-4 text-n8n-green mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="self-center flex-shrink-0 h-4 w-4 text-n8n-orange mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {change >= 0 ? '+' : ''}
              {typeof change === 'number' && Math.abs(change) < 10 ? change.toFixed(1) : change}
              {typeof change === 'string' ? change : ''}
              <span className="text-cursor-muted ml-1">from last week</span>
            </span>
          )}
          {change === undefined && (
            <span className="text-cursor-muted">-</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;