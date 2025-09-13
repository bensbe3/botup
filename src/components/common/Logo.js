import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = ({ size = 'medium', withText = true, className = '' }) => {
  // Define size classes
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };
  
  // Define text size classes
  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-3xl',
  };
  
  return (
    <Link 
      to="/"
      className={`flex items-center ${className}`}
    >
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className={`bg-cursor-accent rounded-lg ${sizeClasses[size]} flex items-center justify-center shadow-lg hover:shadow-glow transition-shadow duration-300`}
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -5, 0, 5, 0] }}
          transition={{ 
            duration: 0.5, 
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Infinity,
            repeatDelay: 10
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${sizeClasses[size]} text-white p-1`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </motion.div>
        <motion.div 
          className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-cursor-dark shadow-sm"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut", 
            repeat: Infinity,
          }}
        />
      </motion.div>
      
      {withText && (
        <motion.span 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`ml-2 font-bold text-cursor-text ${textSizeClasses[size]}`}
        >
          Bot<motion.span 
            className="text-cursor-accent"
            animate={{ color: ['#4D4DFF', '#3333FF', '#4D4DFF'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >Up</motion.span>
        </motion.span>
      )}
    </Link>
  );
};

export default Logo;