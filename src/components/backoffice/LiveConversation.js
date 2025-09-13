import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const LiveConversation = ({ conversation, agent, onSendMessage, onEndChat, socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Load conversation history and visitor info when conversation changes
  useEffect(() => {
    if (!conversation || !conversation.id) return;
    
    setIsLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    // Load conversation messages
    axios.get(`${apiUrl}/api/conversations/${conversation.id}/messages`)
      .then(res => {
        setMessages(res.data);
        setIsLoading(false);
        // Scroll after a short delay to ensure messages are rendered
        setTimeout(scrollToBottom, 100);
      })
      .catch(err => {
        console.error('Error loading messages:', err);
        setIsLoading(false);
      });
    
    // Load visitor info if available
    if (conversation.visitor_id) {
      axios.get(`${apiUrl}/api/visitors/${conversation.visitor_id}`)
        .then(res => {
          setVisitorInfo(res.data);
        })
        .catch(err => {
          console.error('Error loading visitor info:', err);
        });
    }
    
    // Mark messages as read
    if (agent) {
      axios.put(`${apiUrl}/api/conversations/${conversation.id}/messages/read`, {
        agentId: agent.id
      }).catch(err => console.error('Error marking messages as read:', err));
    }
  }, [conversation, agent]);
  
  // Socket event listeners
  useEffect(() => {
    if (!socket || !conversation) return;
    
    // Listen for new messages
    const handleNewMessage = (data) => {
      if (data.conversationId === conversation.id) {
        setMessages(prev => [...prev, {
          id: data.messageId,
          sender: 'user',
          content: data.message,
          timestamp: data.timestamp
        }]);
        scrollToBottom();
        
        // Mark as read since agent is viewing this conversation
        if (agent) {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          axios.put(`${apiUrl}/api/conversations/${conversation.id}/messages/read`, {
            agentId: agent.id
          }).catch(err => console.error('Error marking message as read:', err));
        }
      }
    };
    
    // Listen for typing indicator
    const handleTypingIndicator = (data) => {
      if (data.conversationId === conversation.id || data.sender === 'visitor') {
        setTyping(data.isTyping);
        
        // Auto-clear typing indicator after 3 seconds
        if (data.isTyping) {
          setTimeout(() => setTyping(false), 3000);
        }
      }
    };
    
    socket.on('new_message', handleNewMessage);
    socket.on('typing_indicator', handleTypingIndicator);
    
    // Cleanup
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing_indicator', handleTypingIndicator);
    };
  }, [socket, conversation, agent]);
  
  useEffect(() => {
    // Add agent's own messages to the UI
    if (socket) {
      socket.on('agent_response', (data) => {
        if (data.conversationId === conversation.id) {
          setMessages(prev => [...prev, {
            id: data.messageId,
            sender: 'agent',
            content: data.message,
            agentName: data.agentName,
            timestamp: data.timestamp
          }]);
          scrollToBottom();
        }
      });
      
      return () => {
        socket.off('agent_response');
      };
    }
  }, [socket, conversation]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !onSendMessage) return;
    
    // Send message
    onSendMessage(message);
    
    // Add message to local state for immediate UI update
    setMessages(prev => [...prev, {
      id: `temp-${Date.now()}`,
      sender: 'agent',
      content: message,
      agentName: agent?.name,
      timestamp: new Date().toISOString()
    }]);
    
    // Clear input
    setMessage('');
    
    // Scroll to bottom
    setTimeout(scrollToBottom, 100);
  };
  
  const handleTyping = () => {
    // Inform visitor that agent is typing
    if (socket && message.trim() && conversation) {
      socket.emit('agent_typing', {
        conversationId: conversation.id,
        isTyping: true
      });
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.timestamp);
      const dateKey = date.toLocaleDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(msg);
    });
    
    return groups;
  };
  
  // Get visitor URL in a readable format
  const getFormattedUrl = (url) => {
    if (!url) return 'Unknown';
    
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname}`;
    } catch (err) {
      return url;
    }
  };
  
  const messageGroups = groupMessagesByDate();
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">
            {conversation.visitor_name || conversation.customer_name || 'Visitor'}
          </h2>
          <p className="text-sm text-gray-400">
            {conversation.visitor_email || conversation.customer_email || 'Unknown'} 
            {visitorInfo?.current_url && ` • Viewing: ${getFormattedUrl(visitorInfo.current_url)}`}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="p-2 bg-gray-800 rounded hover:bg-gray-700"
            title="Visitor Info"
            onClick={() => alert('Visitor Info: Coming soon')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          <button 
            className="p-2 bg-red-800 rounded hover:bg-red-700"
            title="End Chat"
            onClick={onEndChat}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {Object.keys(messageGroups).length === 0 && (
              <div className="text-center text-gray-500 my-4">
                No messages in this conversation yet
              </div>
            )}
            
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                <div className="text-center my-4">
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                {msgs.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex mb-4 ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'agent'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : msg.sender === 'bot'
                            ? 'bg-purple-700 text-white rounded-bl-none'
                            : msg.sender === 'system'
                              ? 'bg-gray-700 text-gray-300 mx-auto'
                              : 'bg-gray-800 text-white rounded-bl-none'
                      }`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="text-xs text-purple-300 mb-1">Bot</div>
                      )}
                      {msg.sender === 'agent' && msg.agentName && (
                        <div className="text-xs text-indigo-300 mb-1">{msg.agentName}</div>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 text-right opacity-70">
                        {formatTime(new Date(msg.timestamp))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            {typing && (
              <div className="flex mb-4 justify-start">
                <div className="bg-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="bg-gray-400 rounded-full h-2 w-2 animate-bounce"></div>
                    <div className="bg-gray-400 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="bg-gray-400 rounded-full h-2 w-2 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            className="flex-1 bg-gray-800 text-white border-none rounded-l-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              } else {
                handleTyping();
              }
            }}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper function to format time
function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

export default LiveConversation; 