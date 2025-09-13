/**
 * BotUp Widget Loader
 * This script loads the BotUp chatbot widget on your website.
 * Simply add this script to your website and set the data-botid attribute.
 * 
 * Example:
 * <script src="https://yourwebsite.com/widget.js" data-botid="YOUR_BOT_ID"></script>
 */

(function() {
  // Configuration
  const API_URL = 'http://localhost:5000/api'; // Replace with your API URL in production
  const CDN_URL = 'http://localhost:5000'; // Replace with your CDN URL in production
  
  // Get the current script element
  const currentScript = document.currentScript;
  const botId = currentScript ? currentScript.getAttribute('data-botid') : null;
  
  if (!botId) {
    console.error('BotUp: Missing data-botid attribute. Please specify your bot ID.');
    return;
  }
  
  // Fetch bot configuration
  async function fetchBotConfig() {
    try {
      const response = await fetch(`${API_URL}/chatbots/public/${botId}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Show creation UI if bot doesn't exist
          showBotCreationUI();
          return null;
        }
        throw new Error(`Failed to load bot configuration: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('BotUp: Error loading bot configuration', error);
      return null;
    }
  }
  
  // Show bot creation UI
  function showBotCreationUI() {
    const container = document.getElementById('botup-widget-container');
    if (!container) return;

    // Create creation UI
    const creationUI = document.createElement('div');
    creationUI.className = 'botup-creation-ui';
    creationUI.innerHTML = `
      <div class="botup-creation-content">
        <h3>Create Your Chatbot</h3>
        <p>You need to create a chatbot first before using the widget.</p>
        <div class="botup-creation-form">
          <input type="text" id="botup-bot-name" placeholder="Chatbot Name" class="botup-input">
          <textarea id="botup-bot-prompt" placeholder="Chatbot Instructions" class="botup-input"></textarea>
          <button id="botup-create-bot" class="botup-button">Create Chatbot</button>
        </div>
        <p class="botup-creation-note">Or visit <a href="${process.env.REACT_APP_WEBSITE_URL || 'http://localhost:3000'}/dashboard" target="_blank">dashboard</a> to create and manage your chatbots.</p>
      </div>
    `;

    // Add styles for creation UI
    const style = document.createElement('style');
    style.textContent = `
      .botup-creation-ui {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        padding: 20px;
        z-index: 9999;
      }
      .botup-creation-content h3 {
        margin: 0 0 10px 0;
        color: #333;
      }
      .botup-creation-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 15px 0;
      }
      .botup-creation-form textarea {
        min-height: 100px;
        resize: vertical;
      }
      .botup-button {
        background: #4f46e5;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 500;
      }
      .botup-button:hover {
        background: #4338ca;
      }
      .botup-creation-note {
        font-size: 12px;
        color: #666;
        margin-top: 15px;
      }
      .botup-creation-note a {
        color: #4f46e5;
        text-decoration: none;
      }
    `;
    document.head.appendChild(style);

    // Add event listener for create button
    creationUI.querySelector('#botup-create-bot').addEventListener('click', async () => {
      const name = creationUI.querySelector('#botup-bot-name').value;
      const prompt = creationUI.querySelector('#botup-bot-prompt').value;

      if (!name) {
        alert('Please enter a chatbot name');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/chatbots`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            prompt,
            welcomeMessage: 'Hello! How can I help you today?',
            primaryColor: '#4f46e5',
            showBranding: true
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create chatbot');
        }

        const bot = await response.json();
        // Update the bot ID and reload the widget
        currentScript.setAttribute('data-botid', bot.id);
        location.reload();
      } catch (error) {
        console.error('Error creating chatbot:', error);
        alert('Failed to create chatbot. Please try again or use the dashboard.');
      }
    });

    container.appendChild(creationUI);
  }
  
  // Create chat widget container
  function createWidgetContainer() {
    const container = document.createElement('div');
    container.id = 'botup-widget-container';
    document.body.appendChild(container);
    return container;
  }
  
  // Load required styles
  function loadStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${CDN_URL}/widget-styles.css`;
    document.head.appendChild(link);
    
    // Add inline styles for critical elements
    const style = document.createElement('style');
    style.textContent = `
      #botup-widget-container {
        position: fixed;
        z-index: 9999;
        bottom: 20px;
        right: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      .botup-chat-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .botup-chat-button:hover {
        transform: scale(1.05);
      }
      .botup-icon {
        color: #fff;
        width: 24px;
        height: 24px;
      }
      .botup-chat-widget {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(10px) scale(0.95);
        pointer-events: none;
      }
      .botup-chat-widget.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }
      .botup-chat-header {
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .botup-chat-title {
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        margin: 0;
      }
      .botup-close-button {
        background: transparent;
        border: none;
        color: #fff;
        cursor: pointer;
        padding: 5px;
      }
      .botup-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #f8f9fa;
      }
      .botup-message {
        margin-bottom: 10px;
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
      }
      .botup-message-bot {
        background-color: #f1f3f5;
        color: #343a40;
        border-bottom-left-radius: 5px;
        align-self: flex-start;
      }
      .botup-message-user {
        color: #fff;
        border-bottom-right-radius: 5px;
        align-self: flex-end;
        margin-left: auto;
      }
      .botup-chat-input {
        display: flex;
        padding: 15px;
        border-top: 1px solid #e9ecef;
      }
      .botup-input {
        flex: 1;
        border: 1px solid #ced4da;
        border-radius: 20px;
        padding: 10px 15px;
        font-size: 14px;
        outline: none;
      }
      .botup-send-button {
        background: transparent;
        border: none;
        margin-left: 10px;
        cursor: pointer;
        padding: 0 5px;
      }
      .botup-typing-indicator {
        display: flex;
        padding: 10px 15px;
        margin-bottom: 10px;
      }
      .botup-typing-dot {
        background-color: #adb5bd;
        border-radius: 50%;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        animation: botupTypingAnimation 1.4s infinite ease-in-out;
      }
      .botup-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .botup-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes botupTypingAnimation {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      .botup-branding {
        font-size: 12px;
        color: #868e96;
        text-align: center;
        padding: 5px 0;
      }
      .botup-branding a {
        color: #4c6ef5;
        text-decoration: none;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create chat button
  function createChatButton(config) {
    const button = document.createElement('div');
    button.className = 'botup-chat-button';
    button.style.backgroundColor = config.primaryColor || '#4f46e5';
    
    // Chat icon
    button.innerHTML = `
      <svg class="botup-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
    `;
    
    return button;
  }
  
  // Create chat widget
  function createChatWidget(config) {
    const widget = document.createElement('div');
    widget.className = 'botup-chat-widget';
    
    // Widget header
    const header = document.createElement('div');
    header.className = 'botup-chat-header';
    header.style.backgroundColor = config.primaryColor || '#4f46e5';
    header.innerHTML = `
      <h3 class="botup-chat-title">${config.name || 'BotUp Assistant'}</h3>
      <button class="botup-close-button">
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    
    // Messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'botup-chat-messages';
    
    // Input area
    const inputArea = document.createElement('div');
    inputArea.className = 'botup-chat-input';
    inputArea.innerHTML = `
      <input type="text" class="botup-input" placeholder="Type your message...">
      <button class="botup-send-button" style="color: ${config.primaryColor || '#4f46e5'}">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>
      </button>
    `;
    
    // Branding (if enabled)
    if (config.showBranding) {
      const branding = document.createElement('div');
      branding.className = 'botup-branding';
      branding.innerHTML = 'Powered by <a href="https://botup.app" target="_blank">BotUp</a>';
      widget.appendChild(branding);
    }
    
    // Assemble widget
    widget.appendChild(header);
    widget.appendChild(messagesContainer);
    widget.appendChild(inputArea);
    
    return widget;
  }
  
  // Create message element
  function createMessageElement(message, sender, config) {
    const messageEl = document.createElement('div');
    messageEl.className = `botup-message botup-message-${sender}`;
    
    if (sender === 'user') {
      messageEl.style.backgroundColor = config.primaryColor || '#4f46e5';
    }
    
    messageEl.textContent = message;
    return messageEl;
  }
  
  // Create typing indicator
  function createTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'botup-typing-indicator';
    indicator.innerHTML = `
      <div class="botup-typing-dot"></div>
      <div class="botup-typing-dot"></div>
      <div class="botup-typing-dot"></div>
    `;
    return indicator;
  }
  
  // Send message to API
  async function sendMessage(message, conversationId, config) {
    try {
      const response = await fetch(`${API_URL}/chatbots/${botId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId,
          customerInfo: window.botupCustomerInfo || {}
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error sending message: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('BotUp: Error sending message', error);
      return { 
        success: false, 
        message: "I'm sorry, I couldn't process your message. Please try again later." 
      };
    }
  }
  
  // Start a new conversation
  async function startConversation(config) {
    try {
      const response = await fetch(`${API_URL}/chatbots/${botId}/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: window.botupCustomerInfo || {}
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error starting conversation: ${response.status}`);
      }
      
      const data = await response.json();
      return data.conversationId;
    } catch (error) {
      console.error('BotUp: Error starting conversation', error);
      return null;
    }
  }
  
  // Initialize the widget
  async function initWidget() {
    // Load styles
    loadStyles();
    
    // Fetch bot configuration
    const config = await fetchBotConfig();
    if (!config) return;
    
    // Create widget elements
    const container = createWidgetContainer();
    const chatButton = createChatButton(config);
    const chatWidget = createChatWidget(config);
    
    // Add elements to container
    container.appendChild(chatButton);
    container.appendChild(chatWidget);
    
    // Position container based on bot position setting
    if (config.position === 'left') {
      container.style.left = '20px';
      container.style.right = 'auto';
      chatWidget.style.left = '0';
      chatWidget.style.right = 'auto';
    }
    
    // Get DOM elements
    const messagesContainer = chatWidget.querySelector('.botup-chat-messages');
    const inputField = chatWidget.querySelector('.botup-input');
    const sendButton = chatWidget.querySelector('.botup-send-button');
    const closeButton = chatWidget.querySelector('.botup-close-button');
    
    // Variables to track state
    let conversationId = null;
    let isWidgetOpen = false;
    let isTyping = false;
    let typingIndicator = createTypingIndicator();
    
    // Add welcome message
    if (config.welcomeMessage) {
      const welcomeMsg = createMessageElement(config.welcomeMessage, 'bot', config);
      messagesContainer.appendChild(welcomeMsg);
    }
    
    // Toggle chat widget
    function toggleWidget() {
      isWidgetOpen = !isWidgetOpen;
      if (isWidgetOpen) {
        chatWidget.classList.add('open');
        inputField.focus();
        // Start a conversation if none exists
        if (!conversationId) {
          startConversation(config).then(id => {
            conversationId = id;
          });
        }
      } else {
        chatWidget.classList.remove('open');
      }
    }
    
    // Handle sending a message
    async function handleSendMessage() {
      const message = inputField.value.trim();
      if (!message) return;
      
      // Add user message to chat
      const userMessageEl = createMessageElement(message, 'user', config);
      messagesContainer.appendChild(userMessageEl);
      
      // Clear input field
      inputField.value = '';
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Show typing indicator
      isTyping = true;
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Send message to API
      const response = await sendMessage(message, conversationId, config);
      
      // Remove typing indicator
      isTyping = false;
      if (messagesContainer.contains(typingIndicator)) {
        messagesContainer.removeChild(typingIndicator);
      }
      
      // Add bot response to chat
      const botMessage = createMessageElement(
        response.success ? response.message : "I'm sorry, I couldn't process your message.", 
        'bot', 
        config
      );
      messagesContainer.appendChild(botMessage);
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Event listeners
    chatButton.addEventListener('click', toggleWidget);
    closeButton.addEventListener('click', toggleWidget);
    
    sendButton.addEventListener('click', handleSendMessage);
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
      }
    });
    
    // Auto-open chat if configured (after a delay)
    if (config.autoOpenDelay && config.autoOpenDelay > 0) {
      setTimeout(() => {
        if (!isWidgetOpen) {
          toggleWidget();
        }
      }, config.autoOpenDelay * 1000);
    }
  }
  
  // Initialize when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
  
  // Expose API for developers
  window.BotUp = {
    open: function() {
      const container = document.getElementById('botup-widget-container');
      if (container) {
        const button = container.querySelector('.botup-chat-button');
        const widget = container.querySelector('.botup-chat-widget');
        if (!widget.classList.contains('open')) {
          button.click();
        }
      }
    },
    close: function() {
      const container = document.getElementById('botup-widget-container');
      if (container) {
        const widget = container.querySelector('.botup-chat-widget');
        if (widget.classList.contains('open')) {
          const closeButton = widget.querySelector('.botup-close-button');
          closeButton.click();
        }
      }
    },
    setCustomerInfo: function(info) {
      window.botupCustomerInfo = info;
    }
  };
})(); 