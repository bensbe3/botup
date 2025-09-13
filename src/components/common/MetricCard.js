import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, change, icon, color }) => {
  // Color classes based on type
  const colorClasses = {
    indigo: {
      bg: 'bg-space-purple/10',
      text: 'text-cursor-text',
      icon: 'text-space-purple',
      dust: 'dust-purple',
      border: 'border-space-purple/30',
      glow: 'group-hover:shadow-[0_0_15px_rgba(157,78,221,0.5)]',
    },
    green: {
      bg: 'bg-space-teal/10',
      text: 'text-cursor-text',
      icon: 'text-space-teal',
      dust: 'dust-teal',
      border: 'border-space-teal/30',
      glow: 'group-hover:shadow-teal-glow',
    },
    blue: {
      bg: 'bg-space-blue/10',
      text: 'text-cursor-text',
      icon: 'text-space-blue',
      dust: 'dust-blue',
      border: 'border-space-blue/30',
      glow: 'group-hover:shadow-[0_0_15px_rgba(76,201,240,0.5)]',
    },
    purple: {
      bg: 'bg-space-violet/10',
      text: 'text-cursor-text',
      icon: 'text-space-violet',
      dust: 'dust-purple',
      border: 'border-space-violet/30',
      glow: 'group-hover:shadow-[0_0_15px_rgba(199,125,255,0.5)]',
    },
    red: {
      bg: 'bg-space-pink/10',
      text: 'text-cursor-text',
      icon: 'text-space-pink',
      dust: 'dust-pink',
      border: 'border-space-pink/30',
      glow: 'group-hover:shadow-[0_0_15px_rgba(247,37,133,0.5)]',
    },
  };
  
  const selectedColor = colorClasses[color] || colorClasses.indigo;
  
  // Generate random dust particles
  const generateDustParticles = () => {
    const particles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
        transform: `scale(${0.3 + Math.random() * 0.7})`,
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
  
  // Generate stars
  const generateStars = () => {
    const stars = [];
    const starCount = 10;
    
    for (let i = 0; i < starCount; i++) {
      const sizeClass = Math.random() > 0.7 ? 'star-lg' : Math.random() > 0.5 ? '' : 'star-sm';
      const animationDelay = `${Math.random() * 4}s`;
      
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay,
      };
      
      stars.push(
        <div 
          key={i} 
          className={`star ${sizeClass}`} 
          style={style} 
        />
      );
    }
    
    return stars;
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

  // Add a random floating animation delay for each card
  const floatDelay = Math.random() * 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group glassmorphism-card hover:shadow-xl border border-white/10 transition-all duration-300 hover:border-opacity-50 hover:translate-y-[-5px] metric-card space-float glow-container"
      style={{ animationDelay: `${floatDelay}s` }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="dust-container">
        {generateDustParticles()}
        {generateStars()}
      </div>
      <div className="p-5 relative overflow-hidden">
        <div className="shooting-star absolute" style={{ top: '10%', right: '10%' }}></div>
        <div className="flex items-center">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`flex-shrink-0 rounded-md p-3 ${selectedColor.bg} border ${selectedColor.border} ${selectedColor.glow} transition-all duration-300`}
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.1, 1, 0.9, 1]
              }}
              transition={{ 
                duration: 6,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
              className={selectedColor.icon}
            >
              {renderIcon()}
            </motion.div>
          </motion.div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-cursor-text/70 truncate">
                {title}
              </dt>
              <dd>
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="text-lg font-medium text-cursor-text"
                >
                  {value}
                </motion.div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-cursor-dark/50 backdrop-blur-md border-t border-white/10 px-5 py-3">
        <div className="text-sm">
          {change !== undefined && (
            <span
              className={
                change >= 0
                  ? 'text-space-teal font-medium flex items-center'
                  : 'text-space-pink font-medium flex items-center'
              }
            >
              {change >= 0 ? (
                <svg
                  className="self-center flex-shrink-0 h-4 w-4 text-space-teal mr-1"
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
                  className="self-center flex-shrink-0 h-4 w-4 text-space-pink mr-1"
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
              <span className="text-cursor-text/70 ml-1">from last week</span>
            </span>
          )}
          {change === undefined && (
            <span className="text-cursor-text/70">-</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard; 