import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConversationHistory = ({ conversations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filterType, setFilterType] = useState('all'); // all, satisfied, unsatisfied
  
  // Filter conversations based on search term and filter type
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = 
      conversation.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'satisfied' && conversation.satisfied) ||
      (filterType === 'unsatisfied' && !conversation.satisfied);
    
    return matchesSearch && matchesFilter;
  });
  
  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };
  
  const closeConversationDetails = () => {
    setSelectedConversation(null);
  };
  
  return (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="glassmorphism-card p-4 glow-container">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-cursor-text/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 form-input"
              placeholder="Search conversations by customer name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filterType === 'all'
                  ? 'bg-n8n-green text-white'
                  : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray border border-cursor-lightgray/30'
              }`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filterType === 'satisfied'
                  ? 'bg-n8n-green text-white'
                  : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray border border-cursor-lightgray/30'
              }`}
              onClick={() => setFilterType('satisfied')}
            >
              Satisfied
            </button>
            <button
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filterType === 'unsatisfied'
                  ? 'bg-n8n-green text-white'
                  : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray border border-cursor-lightgray/30'
              }`}
              onClick={() => setFilterType('unsatisfied')}
            >
              Unsatisfied
            </button>
          </div>
        </div>
      </div>
      
      {/* Conversations list */}
      <div className="glassmorphism-card glow-container">
        {filteredConversations.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-cursor-text/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-cursor-text">No conversations found</h3>
            <p className="mt-1 text-sm text-cursor-text/70">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {filteredConversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => handleSelectConversation(conversation)}
                  className="block hover:bg-cursor-dark/70 w-full text-left"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-n8n-green truncate">
                          {conversation.customer}
                        </p>
                        <div className={`ml-2 flex-shrink-0 flex ${
                          conversation.satisfied ? 'text-n8n-green' : 'text-red-400'
                        }`}>
                          {conversation.satisfied ? (
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-n8n-green/20 text-n8n-green">
                          {conversation.messageCount} messages
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-cursor-text/70">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-cursor-text/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          {conversation.email}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-cursor-text/70 sm:mt-0 sm:ml-6">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-cursor-text/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {conversation.duration}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-cursor-text/70 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-cursor-text/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>
                          {formatDate(conversation.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Conversation details modal */}
      <AnimatePresence>
        {selectedConversation && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40" onClick={closeConversationDetails}></div>
            <motion.div 
              className="fixed inset-0 z-50 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="inline-block align-bottom glassmorphism-card glow-container text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <div className="flex justify-between">
                          <h3 className="text-lg leading-6 font-medium text-cursor-text">
                            Conversation with {selectedConversation.customer}
                          </h3>
                          <div className={`flex-shrink-0 flex ${
                            selectedConversation.satisfied ? 'text-n8n-green' : 'text-red-400'
                          }`}>
                            {selectedConversation.satisfied ? (
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                              </svg>
                            ) : (
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-cursor-text/70">
                            {formatDate(selectedConversation.timestamp)} • {selectedConversation.duration} • {selectedConversation.messageCount} messages
                          </p>
                        </div>
                        
                        <div className="mt-4 bg-cursor-dark/40 rounded-lg p-4 h-80 overflow-y-auto">
                          {selectedConversation.messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender === 'user' ? 'justify-end' : 'justify-start'
                              } mb-4`}
                            >
                              <div
                                className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender === 'user'
                                    ? 'bg-n8n-green text-white rounded-br-none'
                                    : 'bg-cursor-gray text-cursor-text rounded-bl-none'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p
                                  className={`text-xs mt-1 text-right ${
                                    message.sender === 'user' ? 'text-white/70' : 'text-cursor-text/70'
                                  }`}
                                >
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-white/10">
                    <button
                      type="button"
                      onClick={closeConversationDetails}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-n8n-green text-base font-medium text-white hover:bg-n8n-darkGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-n8n-green sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConversationHistory;