import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const EmbedCodeGenerator = ({ bot }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  
  // Script tag for embedding the chatbot
  const embedCode = bot.id 
    ? `<script src="${process.env.REACT_APP_WEBSITE_URL || 'http://localhost:5000'}/widget.js" data-botid="${bot.id}"></script>`
    : '<script src="https://www.botup.app/widget.js" data-botid="YOUR_BOT_ID"></script>';
  
  // HTML page sample
  const htmlSample = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <!-- BotUp Chatbot Widget -->
  ${embedCode}
</head>
<body>
  <h1>Welcome to my website</h1>
  <p>This page includes the BotUp chatbot widget.</p>
</body>
</html>`;
  
  // Function to copy the embed code to clipboard
  const copyEmbedCode = () => {
    if (codeRef.current) {
      // Select the text field
      codeRef.current.select();
      codeRef.current.setSelectionRange(0, 99999); // For mobile devices
      
      // Copy the text
      document.execCommand('copy');
      
      // Update state to show copied message
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };
  
  // Custom configuration options
  const customConfig = {
    text: `// Advanced configuration (optional)
<script>
  window.BotUp = window.BotUp || {};
  window.BotUp.config = {
    // Optional customer information
    customerInfo: {
      name: '', // Set dynamically for logged in users
      email: '', // Set dynamically for logged in users
    },
    // Callbacks
    onOpen: function() {
      console.log('Chatbot opened');
    },
    onClose: function() {
      console.log('Chatbot closed');
    },
    onMessage: function(message) {
      console.log('Message sent:', message);
    }
  };
</script>`,
    js: `// Programmatic control with JavaScript
// Open the chatbot
BotUp.open();

// Close the chatbot
BotUp.close();

// Set customer information
BotUp.setCustomerInfo({
  name: 'John Doe',
  email: 'john@example.com',
  id: '12345',
  // Any custom fields you want to track
  plan: 'premium',
  signupDate: '2023-01-15'
});`
  };
  
  return (
    <motion.div 
      className="glassmorphism rounded-2xl overflow-hidden border border-white/10 shadow-xl major-feature-section"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4 border-b border-white/10 bg-n8n-green/10 backdrop-blur-md">
        <h3 className="text-lg leading-6 font-medium text-white flex items-center">
          <svg className="h-5 w-5 mr-2 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Embed Code Generator
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-cursor-muted">
          Add your chatbot to any website with this simple code snippet.
        </p>
      </div>
      
      <div className="px-6 py-5">
        <div className="mb-5">
          <label htmlFor="embed-code" className="block text-sm font-medium text-cursor-text mb-2 flex items-center">
            <svg className="h-4 w-4 mr-1 text-n8n-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Copy this code and paste it right before the closing <code className="text-sm bg-cursor-lightgray/20 px-1 py-0.5 rounded text-n8n-green">&lt;/body&gt;</code> tag:
          </label>
          <div className="mt-2 relative rounded-md shadow-sm">
            <textarea
              ref={codeRef}
              id="embed-code"
              name="embed-code"
              rows={3}
              className="block w-full pr-10 bg-cursor-dark border-cursor-lightgray/40 rounded-lg focus:ring-n8n-green focus:border-n8n-green/50 text-cursor-text font-mono text-sm"
              readOnly
              value={embedCode}
            />
            <motion.button
              type="button"
              onClick={copyEmbedCode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-y-0 right-0 px-3 py-1 flex items-center bg-cursor-lightgray/20 hover:bg-cursor-lightgray/30 rounded-r-lg border-l border-cursor-lightgray/30 focus:outline-none transition-all duration-200"
            >
              {copied ? (
                <span className="text-n8n-green text-sm flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <svg className="h-5 w-5 text-cursor-muted hover:text-n8n-green transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <motion.details 
            className="group bg-cursor-dark/80 rounded-lg overflow-hidden border border-cursor-lightgray/40 transition-all duration-200 hover:border-n8n-green/40"
            whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
          >
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-n8n-green flex items-center justify-between group-hover:bg-cursor-lightgray/10 transition-colors duration-200">
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                View HTML Example
              </span>
              <svg className="h-5 w-5 group-open:rotate-180 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 py-3">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-cursor-muted bg-cursor-black/50 p-3 rounded-lg">
                {htmlSample}
              </pre>
            </div>
          </motion.details>
          
          <motion.details 
            className="group bg-cursor-dark/80 rounded-lg overflow-hidden border border-cursor-lightgray/40 transition-all duration-200 hover:border-n8n-green/40"
            whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
          >
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-n8n-green flex items-center justify-between group-hover:bg-cursor-lightgray/10 transition-colors duration-200">
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Advanced Configuration
              </span>
              <svg className="h-5 w-5 group-open:rotate-180 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 py-3">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-cursor-muted bg-cursor-black/50 p-3 rounded-lg">
                {customConfig.text}
              </pre>
            </div>
          </motion.details>
          
          <motion.details 
            className="group bg-cursor-dark/80 rounded-lg overflow-hidden border border-cursor-lightgray/40 transition-all duration-200 hover:border-n8n-green/40"
            whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
          >
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-n8n-green flex items-center justify-between group-hover:bg-cursor-lightgray/10 transition-colors duration-200">
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                JavaScript API
              </span>
              <svg className="h-5 w-5 group-open:rotate-180 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 py-3">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-cursor-muted bg-cursor-black/50 p-3 rounded-lg">
                {customConfig.js}
              </pre>
            </div>
          </motion.details>
        </div>
        
        {!bot.id && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-n8n-orange/10 border-l-4 border-n8n-orange p-4 rounded-r-lg"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-n8n-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-n8n-orange">
                  You need to create a chatbot first before you can get a unique embed code.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EmbedCodeGenerator;