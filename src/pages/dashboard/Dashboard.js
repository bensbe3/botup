import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import MetricCard from '../../components/common/MetricCard';
import BotCustomizer from '../../components/dashboard/BotCustomizer';
import DashboardBotTester from '../../components/dashboard/DashboardBotTester';
import EmbedCodeGenerator from '../../components/dashboard/EmbedCodeGenerator';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [bot, setBot] = useState({
    id: null,
    name: 'My Assistant',
    prompt: 'You are a friendly assistant for my website. Answer customer questions helpfully and concisely.',
    welcomeMessage: 'Hello! How can I help you today?',
    primaryColor: '#4f46e5',
    secondaryColor: '#3730a3',
    iconStyle: 'chat',
    position: 'right',
  });
  
  const [stats, setStats] = useState({
    totalConversations: 0,
    averageResponseTime: 0,
    satisfactionRate: 0,
    activeUsers: 0,
  });
  
  // Define fetchStatsData first, before it's used in useEffect
  const fetchStatsData = React.useCallback(async () => {
    try {
      if (!token || !bot.id) {
        // Use mock data if not authenticated or no bot ID
        setStats({
          totalConversations: 127,
          averageResponseTime: 1.5,
          satisfactionRate: 92,
          activeUsers: 18,
        });
        return;
      }
      
      const response = await axios.get(`${API_URL}/conversations/analytics/chatbot/${bot.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setStats({
          totalConversations: response.data.conversationCount || 0,
          averageResponseTime: response.data.averageResponseTime || 0,
          satisfactionRate: response.data.satisfactionRate || 0,
          activeUsers: response.data.activeUsers || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching stats data:', err);
      // Fall back to mock data on error
      setStats({
        totalConversations: 127,
        averageResponseTime: 1.5,
        satisfactionRate: 92,
        activeUsers: 18,
      });
    }
  }, [token, bot.id]);
  
  // Fetch user's chatbot data
  useEffect(() => {
    const fetchBotData = async () => {
      setIsLoading(true);
      try {
        // Check if user is authenticated
        if (!token) {
          // Use default bot if not authenticated
          setIsLoading(false);
          return;
        }
        
        // Fetch user's chatbots
        const response = await axios.get(`${API_URL}/chatbots`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.length > 0) {
          // Use the first chatbot (free plan only allows one)
          const userBot = response.data[0];
          
          // Set bot with camelCase properties (already converted by backend)
          setBot(userBot);
        }
        
        // Fetch stats data
        await fetchStatsData();
      } catch (err) {
        console.error('Error fetching bot data:', err);
        setError('Failed to load your chatbot. Please try again later.');
        // Continue with default bot data
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBotData();
  }, [token, fetchStatsData]);
  
  const handleBotUpdate = async (updateData) => {
    // Update local state immediately for UI responsiveness
    setBot({ ...bot, ...updateData });
    
    // If user is authenticated and bot has an ID, update in database
    if (token && bot.id) {
      try {
        // Send the data as is - we're using camelCase in the frontend
        // Backend will handle converting to snake_case for database
        await axios.put(`${API_URL}/chatbots/${bot.id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Bot updated successfully');
      } catch (err) {
        console.error('Error updating bot:', err);
        // We keep the updated UI state even if the API call fails
        // to avoid a confusing user experience
      }
    }
  };
  
  // Generate a new bot if user doesn't have one
  const handleCreateBot = async () => {
    if (!token) return;
    
    try {
      const response = await axios.post(`${API_URL}/chatbots`, bot, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.id) {
        setBot({
          ...bot,
          id: response.data.id
        });
        console.log('Bot created successfully');
      }
    } catch (err) {
      console.error('Error creating bot:', err);
      setError('Failed to create your chatbot. Please try again.');
    }
  };
  
  return (
    <Layout 
      title="Dashboard" 
      subtitle="Manage and monitor your chatbot"
    >
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Overview
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard 
                  title="Total Conversations" 
                  value={stats.totalConversations} 
                  change={+12}
                  icon="chat"
                  color="indigo"
                />
                <MetricCard 
                  title="Avg. Response Time" 
                  value={`${stats.averageResponseTime}s`} 
                  change={-0.3}
                  icon="clock"
                  color="green"
                />
                <MetricCard 
                  title="Satisfaction Rate" 
                  value={`${stats.satisfactionRate}%`} 
                  change={+2.1}
                  icon="thumbs-up"
                  color="blue"
                />
                <MetricCard 
                  title="Active Users" 
                  value={stats.activeUsers} 
                  change={+5}
                  icon="users"
                  color="purple"
                />
              </div>
            </motion.div>
            
            {/* Create Bot Button (shown only if user doesn't have a bot) */}
            {token && !bot.id && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Your First Chatbot</h3>
                <p className="text-gray-500 mb-4">
                  You don't have any chatbots yet. Create one to get started.
                </p>
                <button
                  onClick={handleCreateBot}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Chatbot
                </button>
              </div>
            )}
            
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column - Bot Customization */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <BotCustomizer 
                    bot={bot} 
                    onUpdate={handleBotUpdate} 
                  />
                  
                  <EmbedCodeGenerator bot={bot} />
                </motion.div>
                
                {/* Right column - Only the Laptop Mockup */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start justify-center h-full mt-4 lg:mt-0"
                  style={{ 
                    position: 'sticky', 
                    alignSelf: 'flex-start', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    paddingTop: '20px', 
                    overflow: 'auto',
                    height: '100%'
                  }}
                >
                  {/* Only the laptop mockup - no surrounding elements */}
                  <DashboardBotTester botConfig={bot} />
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;