import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import AnalyticsDashboard from '../../components/backoffice/AnalyticsDashboard';
import ConversationHistory from '../../components/backoffice/ConversationHistory';
import BotSettings from '../../components/backoffice/BotSettings';
import { useAuth } from '../../contexts/AuthContext';

const Backoffice = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [conversations, setConversations] = useState([]);
  
  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock analytics data
        const mockAnalytics = {
          totalConversations: 127,
          totalMessages: 864,
          averageResponseTime: 1.5,
          satisfactionRate: 92,
          activeUsers: 18,
          messagesByDay: [
            { date: '2024-05-01', count: 45 },
            { date: '2024-05-02', count: 32 },
            { date: '2024-05-03', count: 67 },
            { date: '2024-05-04', count: 76 },
            { date: '2024-05-05', count: 53 },
            { date: '2024-05-06', count: 89 },
            { date: '2024-05-07', count: 120 },
          ],
          topTopics: [
            { topic: 'Pricing', count: 42 },
            { topic: 'Features', count: 38 },
            { topic: 'Support', count: 27 },
            { topic: 'Integration', count: 19 },
            { topic: 'Billing', count: 12 },
          ],
          satisfactionTrend: [
            { date: '2024-05-01', rate: 90 },
            { date: '2024-05-02', rate: 91 },
            { date: '2024-05-03', rate: 89 },
            { date: '2024-05-04', rate: 90 },
            { date: '2024-05-05', rate: 92 },
            { date: '2024-05-06', rate: 94 },
            { date: '2024-05-07', rate: 92 },
          ],
          responseTimeTrend: [
            { date: '2024-05-01', time: 1.8 },
            { date: '2024-05-02', time: 1.7 },
            { date: '2024-05-03', time: 1.6 },
            { date: '2024-05-04', time: 1.6 },
            { date: '2024-05-05', time: 1.5 },
            { date: '2024-05-06', time: 1.4 },
            { date: '2024-05-07', time: 1.5 },
          ],
        };
        
        // Mock conversation data
        const mockConversations = [
          {
            id: '1',
            customer: 'John Smith',
            email: 'john@example.com',
            timestamp: new Date('2024-05-07T14:32:00'),
            duration: '8 min',
            messageCount: 12,
            satisfied: true,
            messages: [
              { id: '1-1', sender: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date('2024-05-07T14:32:00') },
              { id: '1-2', sender: 'user', content: 'I\'m interested in your pricing plans.', timestamp: new Date('2024-05-07T14:32:30') },
              { id: '1-3', sender: 'bot', content: 'Our pricing starts at $9.99/month for the basic plan. Would you like me to explain the features of each plan?', timestamp: new Date('2024-05-07T14:32:45') },
              { id: '1-4', sender: 'user', content: 'Yes, please. What\'s included in the pro plan?', timestamp: new Date('2024-05-07T14:33:20') },
              { id: '1-5', sender: 'bot', content: 'The Pro plan costs $24.99/month and includes all Basic features plus: advanced analytics, priority support, custom branding, and up to 5 team members.', timestamp: new Date('2024-05-07T14:33:45') },
            ],
          },
          {
            id: '2',
            customer: 'Sarah Johnson',
            email: 'sarah@example.com',
            timestamp: new Date('2024-05-07T11:15:00'),
            duration: '5 min',
            messageCount: 7,
            satisfied: true,
            messages: [
              { id: '2-1', sender: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date('2024-05-07T11:15:00') },
              { id: '2-2', sender: 'user', content: 'How do I integrate your chatbot with my Shopify store?', timestamp: new Date('2024-05-07T11:15:30') },
              { id: '2-3', sender: 'bot', content: 'Integrating with Shopify is easy! You just need to add our app from the Shopify App Store and follow the setup instructions. Would you like me to guide you through it?', timestamp: new Date('2024-05-07T11:15:55') },
            ],
          },
          {
            id: '3',
            customer: 'Michael Brown',
            email: 'michael@example.com',
            timestamp: new Date('2024-05-06T16:42:00'),
            duration: '12 min',
            messageCount: 18,
            satisfied: false,
            messages: [
              { id: '3-1', sender: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date('2024-05-06T16:42:00') },
              { id: '3-2', sender: 'user', content: 'I\'m having trouble with the API.', timestamp: new Date('2024-05-06T16:42:30') },
              { id: '3-3', sender: 'bot', content: 'I\'m sorry to hear that. Could you describe the issue you\'re experiencing with our API?', timestamp: new Date('2024-05-06T16:42:55') },
            ],
          },
          {
            id: '4',
            customer: 'Emily Wilson',
            email: 'emily@example.com',
            timestamp: new Date('2024-05-06T09:18:00'),
            duration: '3 min',
            messageCount: 5,
            satisfied: true,
            messages: [
              { id: '4-1', sender: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date('2024-05-06T09:18:00') },
              { id: '4-2', sender: 'user', content: 'What\'s your customer support email?', timestamp: new Date('2024-05-06T09:18:30') },
              { id: '4-3', sender: 'bot', content: 'You can reach our customer support team at support@example.com. Is there something specific I can help you with right now?', timestamp: new Date('2024-05-06T09:18:55') },
            ],
          },
          {
            id: '5',
            customer: 'David Lee',
            email: 'david@example.com',
            timestamp: new Date('2024-05-05T13:27:00'),
            duration: '7 min',
            messageCount: 10,
            satisfied: true,
            messages: [
              { id: '5-1', sender: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date('2024-05-05T13:27:00') },
              { id: '5-2', sender: 'user', content: 'Can I customize the appearance of the chatbot?', timestamp: new Date('2024-05-05T13:27:30') },
              { id: '5-3', sender: 'bot', content: 'Absolutely! You can customize the colors, chat icon, position, and more from your dashboard. Would you like me to explain how?', timestamp: new Date('2024-05-05T13:27:55') },
            ],
          },
        ];
        
        setAnalytics(mockAnalytics);
        setConversations(mockConversations);
      } catch (error) {
        console.error('Error loading backoffice data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-n8n-green"></div>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard analytics={analytics} />;
      case 'conversations':
        return <ConversationHistory conversations={conversations} />;
      case 'settings':
        return <BotSettings />;
      default:
        return <AnalyticsDashboard analytics={analytics} />;
    }
  };
  
  return (
    <Layout
      title="Backoffice"
      subtitle="Monitor and manage your chatbot performance"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="glassmorphism-card p-4 glow-container">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-n8n-green text-n8n-green'
                  : 'border-transparent text-cursor-text hover:text-cursor-text/80 hover:border-white/20'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('conversations')}
              className={`${
                activeTab === 'conversations'
                  ? 'border-n8n-green text-n8n-green'
                  : 'border-transparent text-cursor-text hover:text-cursor-text/80 hover:border-white/20'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Conversations
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-n8n-green text-n8n-green'
                  : 'border-transparent text-cursor-text hover:text-cursor-text/80 hover:border-white/20'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Bot Settings
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Backoffice;