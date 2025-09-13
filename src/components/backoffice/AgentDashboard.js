import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import LiveConversation from './LiveConversation';
import VisitorList from './VisitorList';

const AgentDashboard = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [pendingChats, setPendingChats] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState('conversations');
  const [isConnected, setIsConnected] = useState(false);
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get agent info from localStorage
  useEffect(() => {
    const token = localStorage.getItem('botup_agent_token');
    const agentData = localStorage.getItem('botup_agent');
    
    if (!token || !agentData) {
      setError('Not authenticated. Please login first.');
      setIsLoading(false);
      return;
    }
    
    try {
      setAgent(JSON.parse(agentData));
    } catch (err) {
      setError('Invalid agent data');
      setIsLoading(false);
    }
  }, []);
  
  // Initialize socket and load data once agent is available
  useEffect(() => {
    if (!agent) return;
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('botup_agent_token');
    
    // Initialize socket connection
    const newSocket = io(apiUrl);
    setSocket(newSocket);
    
    // Handle connection
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Join agent channel
      newSocket.emit('agent_login', { 
        agentId: agent.id, 
        clientId: agent.clientId 
      });
    });
    
    // Handle disconnection
    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });
    
    // Listen for new conversations
    newSocket.on('new_conversation', (conversation) => {
      console.log('New conversation received:', conversation);
      
      // Check if conversation is already in pendingChats
      setPendingChats(prev => {
        if (prev.some(chat => chat.id === conversation.conversationId)) {
          return prev;
        }
        
        // Get conversation details
        axios.get(`${apiUrl}/api/conversations/${conversation.conversationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          setPendingChats(chats => [...chats, res.data]);
        })
        .catch(err => console.error('Error fetching conversation details:', err));
        
        return prev;
      });
    });
    
    // Listen for new messages in existing conversations
    newSocket.on('new_message', (data) => {
      console.log('New message received:', data);
      
      // Update conversation with new message
      setActiveChats(prev => 
        prev.map(chat => 
          chat.id === data.conversationId 
            ? { 
                ...chat, 
                lastMessage: data.message,
                lastMessageTime: data.timestamp,
                unread: chat.id !== selectedChat?.id ? (chat.unread || 0) + 1 : 0
              }
            : chat
        )
      );
      
      // If this is for the currently selected chat, mark as read
      if (selectedChat && selectedChat.id === data.conversationId) {
        axios.put(`${apiUrl}/api/conversations/${data.conversationId}/messages/read`, {
          agentId: agent.id
        }).catch(err => console.error('Error marking messages as read:', err));
      }
    });
    
    // Load active conversations for this agent
    setIsLoading(true);
    
    axios.get(`${apiUrl}/api/conversations/agent/${agent.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setActiveChats(res.data.active || []);
      setPendingChats(res.data.pending || []);
      setIsLoading(false);
    })
    .catch(err => {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
      setIsLoading(false);
    });
    
    // Load visitors
    fetchVisitors();
    
    // Set interval to refresh visitors
    const interval = setInterval(fetchVisitors, 30000);
    
    // Cleanup function
    return () => {
      clearInterval(interval);
      newSocket.disconnect();
    };
  }, [agent, selectedChat]);
  
  const fetchVisitors = () => {
    if (!agent) return;
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('botup_agent_token');
    
    axios.get(`${apiUrl}/api/visitors/client`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setVisitors(res.data))
    .catch(err => console.error('Error fetching visitors:', err));
  };
  
  const handleAcceptChat = (chatId) => {
    if (!agent) return;
    
    // Find chat in pending
    const chat = pendingChats.find(c => c.id === chatId);
    if (!chat) return;
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    // Call API to accept chat
    axios.post(`${apiUrl}/api/conversations/${chatId}/accept`, { agentId: agent.id })
    .then(res => {
      if (res.data.success) {
        // Move from pending to active
        setPendingChats(prev => prev.filter(c => c.id !== chatId));
        setActiveChats(prev => [...prev, chat]);
        setSelectedChat(chat);
      }
    })
    .catch(err => console.error('Error accepting chat:', err));
  };
  
  const handleSendMessage = (message) => {
    if (!selectedChat || !socket || !isConnected || !agent) return;
    
    socket.emit('agent_message', {
      conversationId: selectedChat.id,
      message,
      agentId: agent.id,
      agentName: agent.name
    });
  };
  
  const handleEndChat = () => {
    if (!selectedChat || !agent) return;
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    axios.post(`${apiUrl}/api/conversations/${selectedChat.id}/end`, { agentId: agent.id })
    .then(res => {
      if (res.data.success) {
        // Remove from active chats
        setActiveChats(prev => prev.filter(chat => chat.id !== selectedChat.id));
        setSelectedChat(null);
      }
    })
    .catch(err => console.error('Error ending chat:', err));
  };
  
  const handleStatusChange = (newStatus) => {
    if (!agent) return;
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('botup_agent_token');
    
    axios.put(`${apiUrl}/api/agents/status`, 
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` }}
    )
    .then(res => {
      if (res.data.success) {
        setAgent(prev => ({ ...prev, status: newStatus }));
        
        // Update in localStorage
        const storedAgent = JSON.parse(localStorage.getItem('botup_agent'));
        localStorage.setItem('botup_agent', JSON.stringify({
          ...storedAgent,
          status: newStatus
        }));
      }
    })
    .catch(err => console.error('Error updating status:', err));
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading agent dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white p-8 bg-gray-800 rounded-lg shadow-lg">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gray-800 px-4 py-2 flex justify-between items-center z-10">
        <div className="flex items-center">
          <span className="text-xl font-semibold ml-2">BotUp Agent Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {agent && (
            <>
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  agent.status === 'online' 
                    ? 'bg-green-500' 
                    : agent.status === 'away' 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                }`}></span>
                <select 
                  value={agent.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-gray-700 text-white border-none rounded py-1"
                >
                  <option value="online">Online</option>
                  <option value="away">Away</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              
              <div className="text-gray-300">
                {agent.name}
              </div>
              
              <button 
                onClick={() => {
                  localStorage.removeItem('botup_agent_token');
                  localStorage.removeItem('botup_agent');
                  window.location.href = '/login';
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Main content with top padding for header */}
      <div className="flex w-full mt-12">
        {/* Sidebar */}
        <div className="w-1/4 border-r border-gray-800">
          {/* Tab selectors */}
          <div className="flex border-b border-gray-800">
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'conversations' ? 'bg-indigo-600' : 'bg-gray-800'}`}
              onClick={() => setActiveTab('conversations')}
            >
              Conversations
            </button>
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'visitors' ? 'bg-indigo-600' : 'bg-gray-800'}`}
              onClick={() => setActiveTab('visitors')}
            >
              Visitors
            </button>
          </div>
          
          {/* Content based on active tab */}
          {activeTab === 'conversations' ? (
            <div className="overflow-y-auto h-full">
              {/* Pending chats */}
              {pendingChats.length > 0 && (
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">Waiting ({pendingChats.length})</h3>
                  {pendingChats.map(chat => (
                    <div 
                      key={chat.id} 
                      className="p-3 mb-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleAcceptChat(chat.id)}
                    >
                      <div className="font-medium">{chat.visitor_name || chat.customer_name || 'Visitor'}</div>
                      <div className="text-sm text-gray-400">{chat.lastMessage || 'New conversation'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Waiting: {formatTimeDifference(new Date(chat.transfer_time || chat.created_at))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Active chats */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Active ({activeChats.length})</h3>
                {activeChats.length === 0 && (
                  <div className="text-gray-500 text-sm">No active conversations</div>
                )}
                {activeChats.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`p-3 mb-2 rounded cursor-pointer ${
                      selectedChat?.id === chat.id 
                        ? 'bg-indigo-700' 
                        : chat.unread ? 'bg-indigo-900' : 'bg-gray-800'
                    } hover:bg-indigo-600`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="font-medium flex justify-between">
                      <span>{chat.visitor_name || chat.customer_name || 'Visitor'}</span>
                      {chat.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300">{chat.lastMessage || 'New conversation'}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatTime(new Date(chat.lastMessageTime || chat.updated_at || chat.created_at))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <VisitorList visitors={visitors} />
          )}
        </div>
        
        {/* Main conversation area */}
        <div className="w-3/4">
          {selectedChat ? (
            <LiveConversation 
              conversation={selectedChat}
              agent={agent}
              onSendMessage={handleSendMessage}
              onEndChat={handleEndChat}
              socket={socket}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p className="text-xl">Select a conversation or wait for new chats</p>
                {pendingChats.length > 0 && (
                  <p className="mt-2">
                    There {pendingChats.length === 1 ? 'is' : 'are'} {pendingChats.length} {pendingChats.length === 1 ? 'visitor' : 'visitors'} waiting for assistance
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
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

// Helper function to format time difference
function formatTimeDifference(date) {
  const diff = Math.floor((new Date() - date) / 1000); // seconds
  
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default AgentDashboard; 