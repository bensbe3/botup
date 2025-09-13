import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Helper function to get contrast color for text over the picked color
function getContrastColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  
  // Calculate luminance - using the formula from WCAG 2.0
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white for dark colors and black for light colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

const BotCustomizer = ({ bot, onUpdate }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSecondaryColorPicker, setShowSecondaryColorPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };
  
  const handleColorChange = (color) => {
    onUpdate({ primaryColor: color });
  };
  
  const handleSecondaryColorChange = (color) => {
    onUpdate({ secondaryColor: color });
  };
  
  const handlePositionChange = (position) => {
    onUpdate({ position });
  };
  
  const handleIconChange = (iconStyle) => {
    onUpdate({ iconStyle });
  };
  
  const saveChanges = async () => {
    setIsLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast.success('Chatbot settings saved successfully!');
    setIsLoading(false);
  };
  
  return (
    <motion.div 
      className="glassmorphism rounded-2xl border border-white/10 overflow-hidden shadow-lg divide-y divide-cursor-lightgray/20 major-feature-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="px-6 py-5 flex justify-between items-center bg-n8n-green/10 backdrop-blur-md">
        <div>
          <h3 className="text-lg leading-6 font-medium text-white flex items-center">
            <svg className="h-5 w-5 mr-2 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Customize Your Chatbot
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-cursor-muted">
            Configure how your chatbot looks and behaves.
          </p>
        </div>
        <motion.button
          type="button"
          onClick={saveChanges}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-n8n-green hover:bg-n8n-darkGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-n8n-green transition-all duration-200 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </motion.button>
      </div>
      
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Bot Name */}
          <motion.div 
            className="sm:col-span-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label htmlFor="name" className="block text-sm font-medium text-cursor-text flex items-center">
              <svg className="h-4 w-4 mr-1.5 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Bot Name
            </label>
            <div className="mt-1.5">
              <input
                type="text"
                name="name"
                id="name"
                value={bot.name}
                onChange={handleInputChange}
                className="block w-full bg-cursor-dark/80 border border-cursor-lightgray/30 rounded-lg shadow-sm text-cursor-text focus:ring-n8n-green focus:border-n8n-green/50 sm:text-sm transition-all duration-200"
              />
            </div>
            <p className="mt-1.5 text-xs text-cursor-muted">
              This name will be visible to your users.
            </p>
          </motion.div>
          
          {/* Welcome Message */}
          <motion.div 
            className="sm:col-span-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <label htmlFor="welcomeMessage" className="block text-sm font-medium text-cursor-text flex items-center">
              <svg className="h-4 w-4 mr-1.5 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Welcome Message
            </label>
            <div className="mt-1.5">
              <input
                type="text"
                name="welcomeMessage"
                id="welcomeMessage"
                value={bot.welcomeMessage}
                onChange={handleInputChange}
                className="block w-full bg-cursor-dark/80 border border-cursor-lightgray/30 rounded-lg shadow-sm text-cursor-text focus:ring-n8n-green focus:border-n8n-green/50 sm:text-sm transition-all duration-200"
              />
            </div>
            <p className="mt-1.5 text-xs text-cursor-muted">
              First message users will see when opening the chat.
            </p>
          </motion.div>
          
          {/* Bot Behavior Prompt */}
          <motion.div 
            className="sm:col-span-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            style={{ width: '100%', maxWidth: '100%', position: 'relative', overflow: 'visible' }}
          >
            <label htmlFor="prompt" className="block text-sm font-medium text-cursor-text flex items-center">
              <svg className="h-4 w-4 mr-1.5 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Bot Behavior Prompt
            </label>
            <div className="mt-1.5 w-full" style={{ position: 'relative', zIndex: 0 }}>
              <textarea
                id="prompt"
                name="prompt"
                rows={4}
                value={bot.prompt}
                onChange={handleInputChange}
                className="block w-full bg-cursor-dark/80 border border-cursor-lightgray/30 rounded-lg shadow-sm text-cursor-text focus:ring-n8n-green focus:border-n8n-green/50 sm:text-sm transition-all duration-200"
                style={{ 
                  minHeight: '120px', 
                  resize: 'vertical',
                  maxHeight: '400px',
                  overflow: 'auto'
                }}
              />
            </div>
            <p className="mt-1.5 text-xs text-cursor-muted">
              This prompt instructs how your chatbot should behave and respond to user questions.
            </p>
          </motion.div>
          
          {/* Color Picker */}
          <motion.div 
            className="sm:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <label htmlFor="color" className="block text-sm font-medium text-cursor-text flex items-center">
              <svg className="h-4 w-4 mr-1.5 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Primary Color
            </label>
            <div className="mt-1.5 relative">
              <div
                className="w-full h-10 rounded-lg cursor-pointer border border-cursor-lightgray/30 flex items-center justify-between px-3 transition-all duration-200 hover:border-n8n-green"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowSecondaryColorPicker(false);
                }}
                style={{ backgroundColor: bot.primaryColor }}
              >
                <span className="text-sm" style={{ color: getContrastColor(bot.primaryColor) }}>
                  {bot.primaryColor}
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: bot.primaryColor }}
                  ></div>
                </div>
              </div>
              
              {/* Color presets */}
              <div className="mt-2 flex gap-2 flex-wrap">
                {['#4f46e5', '#10b981', '#f97316', '#ec4899', '#dc2626', '#2563eb', '#6366f1', '#8b5cf6', '#d946ef', '#14b8a6'].map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${bot.primaryColor === color ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
              
              {showColorPicker && (
                <motion.div 
                  className="absolute z-10 mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-cursor-dark border border-cursor-lightgray rounded-lg shadow-lg">
                    <HexColorPicker color={bot.primaryColor} onChange={handleColorChange} />
                  </div>
                  <div className="absolute top-[-6px] right-3 w-3 h-3 bg-cursor-dark border-t border-l border-cursor-lightgray transform rotate-45"></div>
                </motion.div>
              )}
            </div>
            <p className="mt-1.5 text-xs text-cursor-muted">
              Choose the main color for your chatbot's UI.
            </p>
          </motion.div>
          
          {/* Secondary Color Picker */}
          <motion.div 
            className="sm:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-cursor-text flex items-center">
              <svg className="h-4 w-4 mr-1.5 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Secondary Color
            </label>
            <div className="mt-1.5 relative">
              <div
                className="w-full h-10 rounded-lg cursor-pointer border border-cursor-lightgray/30 flex items-center justify-between px-3 transition-all duration-200 hover:border-n8n-green"
                onClick={() => {
                  setShowSecondaryColorPicker(!showSecondaryColorPicker);
                  setShowColorPicker(false);
                }}
                style={{ backgroundColor: bot.secondaryColor || '#3730a3' }}
              >
                <span className="text-sm" style={{ color: getContrastColor(bot.secondaryColor || '#3730a3') }}>
                  {bot.secondaryColor || '#3730a3'}
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: bot.secondaryColor || '#3730a3' }}
                  ></div>
                </div>
              </div>
              
              {/* Secondary color presets */}
              <div className="mt-2 flex gap-2 flex-wrap">
                {['#3730a3', '#047857', '#c2410c', '#be185d', '#7f1d1d', '#1d4ed8', '#4338ca', '#6d28d9', '#a21caf', '#0f766e'].map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${bot.secondaryColor === color ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-900' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleSecondaryColorChange(color)}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
              
              {showSecondaryColorPicker && (
                <motion.div 
                  className="absolute z-10 mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-cursor-dark border border-cursor-lightgray rounded-lg shadow-lg">
                    <HexColorPicker color={bot.secondaryColor || '#3730a3'} onChange={handleSecondaryColorChange} />
                  </div>
                  <div className="absolute top-[-6px] right-3 w-3 h-3 bg-cursor-dark border-t border-l border-cursor-lightgray transform rotate-45"></div>
                </motion.div>
              )}
            </div>
            <p className="mt-1.5 text-xs text-cursor-muted">
              Choose the secondary color for gradients and accents.
            </p>
          </motion.div>
          
          {/* Position */}
          <motion.div 
            className="sm:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-cursor-text flex items-center">
              <svg className="h-4 w-4 mr-1.5 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Widget Position
            </label>
            <div className="mt-1.5 flex space-x-3">
              <motion.button
                type="button"
                onClick={() => handlePositionChange('left')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 p-2 border ${
                  bot.position === 'left' 
                    ? 'border-n8n-green bg-n8n-green/10 text-n8n-green' 
                    : 'border-cursor-lightgray/30 bg-cursor-dark/80 text-cursor-muted hover:bg-cursor-lightgray/10'
                } rounded-lg text-sm transition-all duration-200`}
              >
                Left
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handlePositionChange('right')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 p-2 border ${
                  bot.position === 'right' 
                    ? 'border-n8n-green bg-n8n-green/10 text-n8n-green' 
                    : 'border-cursor-lightgray/30 bg-cursor-dark/80 text-cursor-muted hover:bg-cursor-lightgray/10'
                } rounded-lg text-sm transition-all duration-200`}
              >
                Right
              </motion.button>
            </div>
            <p className="mt-1.5 text-xs text-cursor-muted">
              Choose which corner to display the chat widget.
            </p>
          </motion.div>
          
          {/* Icon Style */}
          <motion.div 
            className="sm:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <label className="block text-sm font-medium text-cursor-text flex items-center">
              <svg className="h-4 w-4 mr-1.5 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Icon Style
            </label>
            <div className="mt-1.5 grid grid-cols-3 gap-3">
              <motion.button
                type="button"
                onClick={() => handleIconChange('chat')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 border ${
                  bot.iconStyle === 'chat' 
                    ? 'border-n8n-green bg-n8n-green/10 text-n8n-green' 
                    : 'border-cursor-lightgray/30 bg-cursor-dark/80 text-cursor-muted hover:bg-cursor-lightgray/10'
                } rounded-lg flex justify-center transition-all duration-200`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleIconChange('message')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 border ${
                  bot.iconStyle === 'message' 
                    ? 'border-n8n-green bg-n8n-green/10 text-n8n-green' 
                    : 'border-cursor-lightgray/30 bg-cursor-dark/80 text-cursor-muted hover:bg-cursor-lightgray/10'
                } rounded-lg flex justify-center transition-all duration-200`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleIconChange('bot')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 border ${
                  bot.iconStyle === 'bot' 
                    ? 'border-n8n-green bg-n8n-green/10 text-n8n-green' 
                    : 'border-cursor-lightgray/30 bg-cursor-dark/80 text-cursor-muted hover:bg-cursor-lightgray/10'
                } rounded-lg flex justify-center transition-all duration-200`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.button>
            </div>
            <p className="mt-1.5 text-xs text-cursor-muted">
              Select the icon displayed in the chat bubble.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BotCustomizer;