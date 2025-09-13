import React, { useState } from 'react';
import axios from 'axios';

const VisitorList = ({ visitors = [] }) => {
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  
  // Format time difference for "last seen"
  const formatTimeDifference = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };
  
  // Create a new conversation with a visitor
  const startConversation = (visitor) => {
    if (!visitor || !visitor.bot_id) return;
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('botup_agent_token');
    
    axios.post(`${apiUrl}/api/conversations`, 
      {
        chatbotId: visitor.bot_id,
        visitorId: visitor.id,
        startedBy: 'agent'
      },
      { headers: { Authorization: `Bearer ${token}` }}
    )
    .then(res => {
      // Handle success - perhaps redirect to the conversation
      alert(`Conversation created with ID: ${res.data.id}. This will be linked to the chat interface in a future update.`);
    })
    .catch(err => {
      console.error('Error creating conversation:', err);
      alert('Failed to start conversation');
    });
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
  
  // Filter and sort visitors
  const sortedVisitors = [...visitors].sort((a, b) => {
    // First sort by online status
    if (a.is_online && !b.is_online) return -1;
    if (!a.is_online && b.is_online) return 1;
    
    // Then by last seen
    return new Date(b.last_seen) - new Date(a.last_seen);
  });
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold">
          Active Visitors ({sortedVisitors.length})
        </h3>
        <p className="text-xs text-gray-400">
          Visitors active in the last 30 minutes
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sortedVisitors.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No active visitors
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {sortedVisitors.map(visitor => (
              <div 
                key={visitor.id}
                className={`p-4 hover:bg-gray-800 cursor-pointer ${
                  selectedVisitor?.id === visitor.id ? 'bg-gray-800' : ''
                }`}
                onClick={() => setSelectedVisitor(
                  selectedVisitor?.id === visitor.id ? null : visitor
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span 
                      className={`w-3 h-3 rounded-full mr-2 ${
                        visitor.is_online ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></span>
                    <span className="font-medium">{visitor.ip_address}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTimeDifference(visitor.last_seen)}
                  </span>
                </div>
                
                <div className="mt-1 text-sm text-gray-400">
                  <div className="truncate">
                    {getFormattedUrl(visitor.current_url)}
                  </div>
                </div>
                
                {visitor.bot_name && (
                  <div className="mt-1 text-xs text-gray-500">
                    Bot: {visitor.bot_name}
                  </div>
                )}
                
                {selectedVisitor?.id === visitor.id && (
                  <div className="mt-3 pt-2 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>
                        <span className="text-gray-500">First seen:</span> 
                        {' '}
                        {new Date(visitor.first_seen).toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-500">Last seen:</span>
                        {' '}
                        {new Date(visitor.last_seen).toLocaleString()}
                      </div>
                      {visitor.referrer && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Referrer:</span>
                          {' '}
                          {visitor.referrer}
                        </div>
                      )}
                      {visitor.user_agent && (
                        <div className="col-span-2 truncate">
                          <span className="text-gray-500">Browser:</span>
                          {' '}
                          {visitor.user_agent}
                        </div>
                      )}
                      {visitor.screen_size && (
                        <div>
                          <span className="text-gray-500">Screen:</span>
                          {' '}
                          {visitor.screen_size}
                        </div>
                      )}
                      {visitor.language && (
                        <div>
                          <span className="text-gray-500">Language:</span>
                          {' '}
                          {visitor.language}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => startConversation(visitor)}
                      className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded text-sm"
                    >
                      Start Conversation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorList; 