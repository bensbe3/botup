import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'react-hot-toast';

const BotSettings = () => {
  const [bot, setBot] = useState({
    name: 'My Assistant',
    prompt: 'You are a friendly assistant for my website. Answer customer questions helpfully and concisely.',
    welcomeMessage: 'Hello! How can I help you today?',
    primaryColor: '#23C16B',
    iconStyle: 'chat',
    position: 'right',
    showOnMobile: true,
    showOnDesktop: true,
    collectUserData: true,
    showBranding: true,
    autoReply: false,
    autoOpenDelay: 0,
  });
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBot({
      ...bot,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleColorChange = (color) => {
    setBot({ ...bot, primaryColor: color });
  };
  
  const handlePositionChange = (position) => {
    setBot({ ...bot, position });
  };
  
  const handleIconChange = (iconStyle) => {
    setBot({ ...bot, iconStyle });
  };
  
  const saveChanges = async () => {
    setIsLoading(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast.success('Chatbot settings saved successfully!');
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="glassmorphism-card glow-container">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-cursor-text">
              Bot Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-cursor-text/70">
              Configure how your chatbot looks and behaves.
            </p>
          </div>
          <button
            type="button"
            onClick={saveChanges}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-n8n-green hover:bg-n8n-darkGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-n8n-green ${
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
              'Save Changes'
            )}
          </button>
        </div>
        
        <div className="border-t border-white/10">
          <dl>
            {/* Basic Settings Section */}
            <div className="bg-cursor-dark/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-cursor-text/70">
                Bot Name
              </dt>
              <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={bot.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </dd>
            </div>
            
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-cursor-text/70">
                Welcome Message
              </dt>
              <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="welcomeMessage"
                  id="welcomeMessage"
                  value={bot.welcomeMessage}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </dd>
            </div>
            
            <div className="bg-cursor-dark/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-cursor-text/70">
                Bot Behavior Prompt
              </dt>
              <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={4}
                  value={bot.prompt}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <p className="mt-1 text-xs text-cursor-text/50">
                  This prompt instructs how your chatbot should behave and respond to user questions.
                </p>
              </dd>
            </div>
            
            {/* Appearance Section */}
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-cursor-text/70">
                Primary Color
              </dt>
              <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                <div className="relative">
                  <div
                    className="w-full h-10 rounded-md cursor-pointer border border-white/10 flex items-center justify-between px-3"
                    onClick={() => setShowColorPicker(!showColorPicker)}
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
                  
                  {showColorPicker && (
                    <div className="absolute z-10 mt-2 shadow-xl">
                      <div className="p-3 glassmorphism-card rounded-md shadow-lg border border-white/10">
                        <HexColorPicker color={bot.primaryColor} onChange={handleColorChange} />
                      </div>
                    </div>
                  )}
                </div>
              </dd>
            </div>
            
            <div className="bg-cursor-dark/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-cursor-text/70">
                Bot Position
              </dt>
              <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handlePositionChange('left')}
                    className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      bot.position === 'left'
                        ? 'bg-n8n-green text-white border-transparent'
                        : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray border-cursor-lightgray/30'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePositionChange('right')}
                    className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      bot.position === 'right'
                        ? 'bg-n8n-green text-white border-transparent'
                        : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray border-cursor-lightgray/30'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </dd>
            </div>
            
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-cursor-text/70">
                Icon Style
              </dt>
              <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleIconChange('chat')}
                    className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      bot.iconStyle === 'chat'
                        ? 'bg-n8n-green text-white border-transparent'
                        : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray border-cursor-lightgray/30'
                    }`}
                  >
                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIconChange('robot')}
                    className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      bot.iconStyle === 'robot'
                        ? 'bg-n8n-green text-white border-transparent'
                        : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray border-cursor-lightgray/30'
                    }`}
                  >
                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Robot
                  </button>
                </div>
              </dd>
            </div>
            
            {/* Display Options Section */}
            <div className="bg-cursor-dark/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-cursor-text/70">
                Display Options
              </dt>
              <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2 space-y-4">
                <div className="flex items-center">
                  <input
                    id="showOnMobile"
                    name="showOnMobile"
                    type="checkbox"
                    checked={bot.showOnMobile}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="showOnMobile" className="ml-2 block text-sm text-cursor-text">
                    Show on mobile devices
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="showOnDesktop"
                    name="showOnDesktop"
                    type="checkbox"
                    checked={bot.showOnDesktop}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="showOnDesktop" className="ml-2 block text-sm text-cursor-text">
                    Show on desktop devices
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="showBranding"
                    name="showBranding"
                    type="checkbox"
                    checked={bot.showBranding}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="showBranding" className="ml-2 block text-sm text-cursor-text">
                    Show "Powered by BotUp" branding
                  </label>
                </div>
              </dd>
            </div>
            
            {/* Advanced Options Section */}
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-cursor-text/70">
                Advanced Options
              </dt>
              <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2 space-y-4">
                <div className="flex items-center">
                  <input
                    id="collectUserData"
                    name="collectUserData"
                    type="checkbox"
                    checked={bot.collectUserData}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="collectUserData" className="ml-2 block text-sm text-cursor-text">
                    Collect user data (for analytics)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="autoReply"
                    name="autoReply"
                    type="checkbox"
                    checked={bot.autoReply}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="autoReply" className="ml-2 block text-sm text-cursor-text">
                    Enable auto-reply for common questions
                  </label>
                </div>
                
                <div>
                  <label htmlFor="autoOpenDelay" className="block text-sm text-cursor-text">
                    Auto-open chat after (seconds - 0 to disable)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="autoOpenDelay"
                      id="autoOpenDelay"
                      min="0"
                      max="60"
                      value={bot.autoOpenDelay}
                      onChange={handleInputChange}
                      className="form-input w-24"
                    />
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine text color based on background (for contrast)
function getContrastColor(hexColor) {
  // Remove the hash character if present
  hexColor = hexColor.replace('#', '');
  
  // Parse the hex color to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate the brightness (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return white for dark colors, black for light colors
  return brightness > 125 ? '#000000' : '#FFFFFF';
}

export default BotSettings;