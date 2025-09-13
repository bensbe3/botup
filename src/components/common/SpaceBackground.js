import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SpaceBackground = ({ density = 'low', showNebula = false, showShootingStars = false }) => {
  const [stars, setStars] = useState([]);
  const [nebulae, setNebulae] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  
  // Set star density - reduced counts for better performance
  const getStarCount = () => {
    switch (density) {
      case 'high': return 45;
      case 'medium': return 30;
      case 'low': return 15;
      default: return 15;
    }
  };
  
  // Generate stars
  useEffect(() => {
    const starCount = getStarCount();
    const starArray = [];
    
    for (let i = 0; i < starCount; i++) {
      const size = Math.random() > 0.85 ? 3 : Math.random() > 0.5 ? 2 : 1;
      const opacity = 0.3 + Math.random() * 0.7;
      const animationDuration = 2 + Math.random() * 5;
      const animationDelay = Math.random() * 5;
      
      starArray.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size,
        opacity,
        animationDuration,
        animationDelay,
      });
    }
    
    setStars(starArray);
    
    // Generate nebulae if enabled - reduced count
    if (showNebula) {
      const nebulaArray = [];
      const nebulaCount = 2; // Reduced from 3
      
      for (let i = 0; i < nebulaCount; i++) {
        const size = 100 + Math.random() * 200;
        
        // Different colors for different nebulae
        const colors = [
          'rgba(157, 78, 221, 0.05)', // Purple - reduced opacity
          'rgba(76, 201, 240, 0.04)', // Blue - reduced opacity
        ];
        
        nebulaArray.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size,
          color: colors[i % colors.length],
          animationDuration: 80 + Math.random() * 40,
          blur: 40 + Math.random() * 30, // Reduced blur for better performance
        });
      }
      
      setNebulae(nebulaArray);
    }
  }, [density, showNebula]);
  
  // Generate shooting stars if enabled - reduced frequency
  useEffect(() => {
    if (!showShootingStars) return;
    
    const shootingStarInterval = setInterval(() => {
      const newStar = {
        id: Date.now(),
        left: `${Math.random() * 80}%`,
        top: `${Math.random() * 40}%`,
        size: 1 + Math.random() * 1,
      };
      
      setShootingStars(prev => [...prev, newStar]);
      
      // Remove shooting star after animation
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== newStar.id));
      }, 6000);
    }, 15000); // Reduced frequency from 8000 to 15000
    
    return () => {
      clearInterval(shootingStarInterval);
    };
  }, [showShootingStars]);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: star.size >= 2 ? `0 0 ${star.size}px rgba(255, 255, 255, ${star.opacity})` : 'none', // Reduced shadow size
            animationDelay: `${star.animationDelay}s`,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}
      
      {/* Nebulae - simplified animation by using static divs instead of motion.div */}
      {nebulae.map(nebula => (
        <div
          key={nebula.id}
          className="absolute rounded-full opacity-30 animate-nebula-pulse"
          style={{
            left: nebula.left,
            top: nebula.top,
            width: `${nebula.size}px`,
            height: `${nebula.size}px`,
            background: nebula.color,
            filter: `blur(${nebula.blur}px)`,
            animationDuration: `${nebula.animationDuration}s`,
          }}
        />
      ))}
      
      {/* Shooting Stars */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="absolute animate-shooting-star"
          style={{
            left: star.left,
            top: star.top,
          }}
        >
          <div 
            className="w-1 h-1 bg-white rounded-full relative"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          >
            <div 
              className="absolute top-0 left-0 -rotate-45 origin-left" 
              style={{
                width: `${star.size * 10}px`, // Reduced trail length
                height: `${star.size * 0.5}px`,
                background: 'linear-gradient(to right, white, transparent)',
              }}
            />
          </div>
        </div>
      ))}
      
      {/* Removed space-particles-container for better performance */}
    </div>
  );
};

export default SpaceBackground; 