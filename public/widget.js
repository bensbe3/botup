// BotUp Chat Widget
(function() {
  // Configuration
  const API_URL = 'http://localhost:5000';
  const SOCKET_URL = 'http://localhost:5000';
  
  // Variables to store state
  let conversationId = null;
  let visitorId = null;
  let socket = null;
  let isOpen = false;
  let botConfig = {};
  let isAgentTyping = false;
  
  // Initialize the chat widget
  function init() {
    // Look for the botup-widget script tag to get the bot ID and other config
    const scriptTag = document.getElementById('botup-widget');
    
    if (!scriptTag) {
      console.error('BotUp: Widget script tag not found');
      return;
    }
    
    const botId = scriptTag.getAttribute('data-bot-id');
    if (!botId) {
      console.error('BotUp: Missing bot ID');
      return;
    }
    
    console.log('BotUp: Initializing chat widget for bot ID', botId);
    
    // Fetch bot configuration
    fetch(`${API_URL}/api/chatbots/${botId}/config`)
      .then(response => response.json())
      .then(data => {
        botConfig = data;
        
        // Create the chat widget UI
        createWidgetUI();
        
        // Load conversation if it exists
        loadConversation(botId);
        
        // Track visitor
        trackVisitor(botId);
      })
      .catch(error => {
        console.error('BotUp: Error loading chat configuration:', error);
      });
  }
  
  // Track visitor for analytics
  function trackVisitor(botId) {
    // Get existing visitor ID from local storage
    visitorId = localStorage.getItem('botup_visitor_id');
    
    // If no visitor ID, create a new visitor record
    if (!visitorId) {
      const visitorData = {
        botId,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      };
      
      fetch(`${API_URL}/api/visitors/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitorData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.visitorId) {
          visitorId = data.visitorId;
          localStorage.setItem('botup_visitor_id', visitorId);
          
          // If we have a conversation, update it with the visitor ID
          if (conversationId) {
            updateConversationVisitor(conversationId, visitorId);
          }
        }
      })
      .catch(error => {
        console.error('BotUp: Error tracking visitor:', error);
      });
    } else {
      // Update visitor's current page
      fetch(`${API_URL}/api/visitors/${visitorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          isOnline: true
        })
      })
      .catch(error => {
        console.error('BotUp: Error updating visitor:', error);
      });
    }
    
    // Handle page changes and browser close
    window.addEventListener('beforeunload', () => {
      if (visitorId) {
        navigator.sendBeacon(
          `${API_URL}/api/visitors/${visitorId}`,
          JSON.stringify({
            url: window.location.href,
            isOnline: false
          })
        );
      }
    });
    
    // Update on page change (for SPAs)
    let lastUrl = window.location.href;
    setInterval(() => {
      const currentUrl = window.location.href;
      
      if (currentUrl !== lastUrl && visitorId) {
        fetch(`${API_URL}/api/visitors/${visitorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: currentUrl,
            isOnline: true
          })
        }).catch(err => console.error('BotUp: Error updating visitor URL:', err));
        
        lastUrl = currentUrl;
      }
    }, 1000);
  }
  
  // Update conversation with visitor ID
  function updateConversationVisitor(conversationId, visitorId) {
    fetch(`${API_URL}/api/conversations/${conversationId}/visitor`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId })
    }).catch(error => {
      console.error('BotUp: Error updating conversation visitor:', error);
    });
  }
  
  // Load existing conversation or create a new one
  function loadConversation(botId) {
    // Check for existing conversation ID in local storage
    conversationId = localStorage.getItem('botup_conversation_id');
    
    if (conversationId) {
      // Verify conversation exists and is active
      fetch(`${API_URL}/api/conversations/${conversationId}/status`)
        .then(response => response.json())
        .then(data => {
          if (data.active) {
            // Conversation exists and is active
            console.log('BotUp: Resuming conversation', conversationId);
            setupSocketConnection();
            
            // Load conversation history
            loadMessages(conversationId);
          } else {
            // Conversation ended or not found, create a new one
            createNewConversation(botId);
          }
        })
        .catch(error => {
          console.error('BotUp: Error checking conversation status:', error);
          createNewConversation(botId);
        });
    } else {
      // No existing conversation, create a new one
      createNewConversation(botId);
    }
  }
  
  // Create a new conversation
  function createNewConversation(botId) {
    fetch(`${API_URL}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatbotId: botId, visitorId })
    })
    .then(response => response.json())
    .then(data => {
      conversationId = data.id;
      localStorage.setItem('botup_conversation_id', conversationId);
      console.log('BotUp: Created new conversation', conversationId);
      
      setupSocketConnection();
      
      // If we have a welcome message, add it
      if (botConfig.welcome_message) {
        const welcomeMessageElement = document.createElement('div');
        welcomeMessageElement.className = 'botup-message botup-bot-message';
        welcomeMessageElement.innerHTML = `
          <div class="botup-message-content">${botConfig.welcome_message}</div>
          <div class="botup-message-time">${formatTime(new Date())}</div>
        `;
        document.getElementById('botup-messages').appendChild(welcomeMessageElement);
      }
    })
    .catch(error => {
      console.error('BotUp: Error creating conversation:', error);
    });
  }
  
  // Load existing messages for a conversation
  function loadMessages(conversationId) {
    fetch(`${API_URL}/api/conversations/${conversationId}/messages`)
      .then(response => response.json())
      .then(messages => {
        const messagesContainer = document.getElementById('botup-messages');
        messagesContainer.innerHTML = ''; // Clear existing messages
        
        messages.forEach(msg => {
          const messageElement = document.createElement('div');
          messageElement.className = `botup-message botup-${msg.sender}-message`;
          
          let senderLabel = '';
          if (msg.sender === 'agent' && msg.agentName) {
            senderLabel = `<div class="botup-message-sender">${msg.agentName}</div>`;
          } else if (msg.sender === 'bot') {
            senderLabel = '<div class="botup-message-sender">Bot</div>';
          }
          
          messageElement.innerHTML = `
            ${senderLabel}
            <div class="botup-message-content">${msg.content}</div>
            <div class="botup-message-time">${formatTime(new Date(msg.timestamp))}</div>
          `;
          
          messagesContainer.appendChild(messageElement);
        });
        
        // Scroll to bottom
        scrollToBottom();
      })
      .catch(error => {
        console.error('BotUp: Error loading messages:', error);
      });
  }
  
  // Set up WebSocket connection
  function setupSocketConnection() {
    if (!conversationId) return;
    
    // Use socket.io client loaded from the server
    const socketScript = document.createElement('script');
    socketScript.src = `${SOCKET_URL}/socket.io/socket.io.js`;
    socketScript.onload = () => {
      // Create socket connection
      socket = io(SOCKET_URL);
      
      socket.on('connect', () => {
        console.log('BotUp: Socket connected');
        
        // Join conversation room
        socket.emit('join_conversation', {
          conversationId,
          botId: botConfig.id,
          visitorId
        });
      });
      
      // Listen for bot responses
      socket.on('bot_response', (data) => {
        addMessage('bot', data.message, data.timestamp);
      });
      
      // Listen for agent responses
      socket.on('agent_response', (data) => {
        addMessage('agent', data.message, data.timestamp, data.agentName);
      });
      
      // Listen for agent joining
      socket.on('agent_joined', (data) => {
        const systemMessage = `${data.agentName} has joined the conversation`;
        addMessage('system', systemMessage, new Date());
      });
      
      // Listen for conversation ended
      socket.on('conversation_ended', (data) => {
        const systemMessage = `Conversation ended by ${data.agentName}`;
        addMessage('system', systemMessage, new Date());
      });
      
      // Listen for typing indicators
      socket.on('typing_indicator', (data) => {
        isAgentTyping = data.isTyping;
        toggleTypingIndicator(isAgentTyping);
      });
      
      socket.on('disconnect', () => {
        console.log('BotUp: Socket disconnected');
      });
    };
    
    document.head.appendChild(socketScript);
  }
  
  // Add a message to the chat
  function addMessage(sender, content, timestamp, senderName) {
    const messagesContainer = document.getElementById('botup-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `botup-message botup-${sender}-message`;
    
    let senderLabel = '';
    if (sender === 'agent' && senderName) {
      senderLabel = `<div class="botup-message-sender">${senderName}</div>`;
    } else if (sender === 'bot') {
      senderLabel = '<div class="botup-message-sender">Bot</div>';
    }
    
    messageElement.innerHTML = `
      ${senderLabel}
      <div class="botup-message-content">${content}</div>
      <div class="botup-message-time">${formatTime(new Date(timestamp))}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    
    // Hide typing indicator if this is a response
    if (sender !== 'user') {
      toggleTypingIndicator(false);
    }
    
    // Scroll to bottom
    scrollToBottom();
  }
  
  // Send a message
  function sendMessage(message) {
    if (!message.trim() || !conversationId || !socket) return;
    
    // Add message to UI
    addMessage('user', message, new Date());
    
    // Send message via socket
    socket.emit('client_message', {
      conversationId,
      message
    });
  }
  
  // Show or hide typing indicator
  function toggleTypingIndicator(show) {
    const typingIndicator = document.getElementById('botup-typing');
    if (typingIndicator) {
      typingIndicator.style.display = show ? 'flex' : 'none';
    }
  }
  
  // Create the chat widget UI
  function createWidgetUI() {
    // Main container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'botup-container';
    
    // Chat button
    const chatButton = document.createElement('div');
    chatButton.id = 'botup-button';
    chatButton.innerHTML = `
      <svg class="botup-button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="9" cy="10" r="1"></circle>
        <circle cx="15" cy="10" r="1"></circle>
      </svg>
      <svg class="botup-button-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    
    // Chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'botup-chat';
    chatWindow.innerHTML = `
      <div id="botup-header">
        <div id="botup-header-title">${botConfig.name || 'Chat'}</div>
        <div id="botup-header-close">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      </div>
      <div id="botup-messages-container">
        <div id="botup-messages"></div>
        <div id="botup-typing" style="display: none;">
          <div class="botup-typing-dot"></div>
          <div class="botup-typing-dot"></div>
          <div class="botup-typing-dot"></div>
        </div>
      </div>
      <div id="botup-input-container">
        <textarea id="botup-input" placeholder="Type a message..."></textarea>
        <button id="botup-send">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;
    
    // Add branding if enabled
    if (botConfig.show_branding !== false) {
      const branding = document.createElement('div');
      branding.id = 'botup-branding';
      branding.innerHTML = 'Powered by <a href="https://botup.com" target="_blank">BotUp</a>';
      chatWindow.appendChild(branding);
    }
    
    // Append elements to the container
    widgetContainer.appendChild(chatButton);
    widgetContainer.appendChild(chatWindow);
    
    // Add styles
    const primaryColor = botConfig.primary_color || '#4F46E5';
    const styles = document.createElement('style');
    styles.innerHTML = `
      #botup-container {
        position: fixed;
        bottom: 20px;
        ${botConfig.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      #botup-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${primaryColor};
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      
      #botup-button:hover {
        transform: scale(1.05);
      }
      
      #botup-button svg {
        width: 28px;
        height: 28px;
        color: white;
      }
      
      .botup-button-close {
        display: none;
      }
      
      #botup-chat {
        position: absolute;
        bottom: 80px;
        ${botConfig.position === 'left' ? 'left: 0;' : 'right: 0;'}
        width: 350px;
        height: 500px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      #botup-header {
        background-color: ${primaryColor};
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      #botup-header-title {
        font-weight: bold;
        font-size: 16px;
      }
      
      #botup-header-close {
        cursor: pointer;
      }
      
      #botup-header-close svg {
        width: 16px;
        height: 16px;
      }
      
      #botup-messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #f7f7f7;
      }
      
      #botup-messages {
        display: flex;
        flex-direction: column;
      }
      
      .botup-message {
        max-width: 80%;
        margin-bottom: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        position: relative;
      }
      
      .botup-user-message {
        align-self: flex-end;
        background-color: ${primaryColor};
        color: white;
        border-bottom-right-radius: 0;
      }
      
      .botup-bot-message, .botup-agent-message {
        align-self: flex-start;
        background-color: #e6e6e6;
        color: #333;
        border-bottom-left-radius: 0;
      }
      
      .botup-system-message {
        align-self: center;
        background-color: #f0f0f0;
        color: #666;
        font-size: 0.8em;
        padding: 5px 10px;
        margin: 5px 0;
        border-radius: 12px;
      }
      
      .botup-message-sender {
        font-size: 0.7em;
        margin-bottom: 3px;
        opacity: 0.8;
      }
      
      .botup-message-time {
        font-size: 0.7em;
        opacity: 0.7;
        margin-top: 5px;
        text-align: right;
      }
      
      #botup-typing {
        display: flex;
        align-items: center;
        align-self: flex-start;
        background-color: #e6e6e6;
        padding: 10px 12px;
        border-radius: 12px;
        border-bottom-left-radius: 0;
        margin-bottom: 10px;
      }
      
      .botup-typing-dot {
        width: 8px;
        height: 8px;
        background-color: #999;
        border-radius: 50%;
        margin: 0 2px;
        animation: botupTypingAnimation 1.4s infinite;
        opacity: 0.7;
      }
      
      .botup-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .botup-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes botupTypingAnimation {
        0%, 60%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-5px);
        }
      }
      
      #botup-input-container {
        display: flex;
        padding: 10px;
        border-top: 1px solid #e6e6e6;
      }
      
      #botup-input {
        flex: 1;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        padding: 8px 12px;
        resize: none;
        outline: none;
        max-height: 100px;
        min-height: 40px;
        font-family: inherit;
        font-size: 14px;
      }
      
      #botup-send {
        background-color: ${primaryColor};
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-left: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #botup-send svg {
        width: 20px;
        height: 20px;
      }
      
      #botup-branding {
        text-align: center;
        font-size: 11px;
        padding: 5px;
        color: #999;
      }
      
      #botup-branding a {
        color: ${primaryColor};
        text-decoration: none;
      }
      
      .botup-open #botup-chat {
        display: flex;
      }
      
      .botup-open .botup-button-icon {
        display: none;
      }
      
      .botup-open .botup-button-close {
        display: block;
      }
      
      @media (max-width: 480px) {
        #botup-chat {
          width: 85vw;
          height: 70vh;
        }
        
        ${botConfig.show_on_mobile === false ? '#botup-container { display: none; }' : ''}
      }
      
      @media (min-width: 481px) {
        ${botConfig.show_on_desktop === false ? '#botup-container { display: none; }' : ''}
      }
    `;
    
    // Add the widget to the page
    document.head.appendChild(styles);
    document.body.appendChild(widgetContainer);
    
    // Add event listeners
    
    // Toggle chat window
    chatButton.addEventListener('click', () => {
      widgetContainer.classList.toggle('botup-open');
      isOpen = !isOpen;
      
      if (isOpen) {
        scrollToBottom();
      }
    });
    
    // Close chat window
    document.getElementById('botup-header-close').addEventListener('click', () => {
      widgetContainer.classList.remove('botup-open');
      isOpen = false;
    });
    
    // Send message
    document.getElementById('botup-send').addEventListener('click', () => {
      const input = document.getElementById('botup-input');
      const message = input.value.trim();
      
      if (message) {
        sendMessage(message);
        input.value = '';
        
        // Reset height
        input.style.height = 'auto';
      }
    });
    
    // Send message on Enter (but allow Shift+Enter for new lines)
    document.getElementById('botup-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('botup-send').click();
      }
    });
    
    // Handle typing notification
    document.getElementById('botup-input').addEventListener('input', (e) => {
      const message = e.target.value.trim();
      
      // Auto-resize textarea
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(100, e.target.scrollHeight) + 'px';
      
      // Send typing indicator
      if (socket && conversationId) {
        socket.emit('visitor_typing', {
          conversationId,
          isTyping: message.length > 0
        });
      }
    });
    
    // Auto open chat after delay if configured
    if (botConfig.auto_open_delay && botConfig.auto_open_delay > 0) {
      setTimeout(() => {
        if (!isOpen) {
          widgetContainer.classList.add('botup-open');
          isOpen = true;
          scrollToBottom();
        }
      }, botConfig.auto_open_delay * 1000);
    }
  }
  
  // Helper to scroll to bottom of messages
  function scrollToBottom() {
    const messagesContainer = document.getElementById('botup-messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
  
  // Helper to format time
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 