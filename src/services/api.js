import axios from 'axios';

// API URL from environment or default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('botup_auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication service
const auth = {
  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },
  
  register: async (userData) => {
    return apiClient.post('/auth/register', userData);
  },
  
  verify: async () => {
    return apiClient.get('/auth/verify');
  },
  
  changePassword: async (currentPassword, newPassword) => {
    return apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },
};

// Client service
const clients = {
  getProfile: async () => {
    return apiClient.get('/clients/profile');
  },
  
  updateProfile: async (userData) => {
    return apiClient.put('/clients/profile', userData);
  },
  
  upgradePlan: async (plan) => {
    return apiClient.post('/clients/upgrade-plan', { plan });
  },
};

// Chatbot service
const chatbots = {
  getAll: async () => {
    return apiClient.get('/chatbots');
  },
  
  getById: async (id) => {
    return apiClient.get(`/chatbots/${id}`);
  },
  
  create: async (botData) => {
    return apiClient.post('/chatbots', botData);
  },
  
  update: async (id, botData) => {
    return apiClient.put(`/chatbots/${id}`, botData);
  },
  
  delete: async (id) => {
    return apiClient.delete(`/chatbots/${id}`);
  },
  
  getScript: async (id) => {
    return apiClient.get(`/chatbots/${id}/script`);
  },
};

// Conversation service
const conversations = {
  getAll: async (botId) => {
    return apiClient.get('/conversations', { params: { botId } });
  },
  
  getById: async (id) => {
    return apiClient.get(`/conversations/${id}`);
  },
  
  getMessages: async (conversationId) => {
    return apiClient.get(`/conversations/${conversationId}/messages`);
  },
  
  getAnalytics: async (botId, period = '30d') => {
    return apiClient.get(`/conversations/analytics/${botId}`, { params: { period } });
  },
};

export { apiClient, auth, clients, chatbots, conversations }; 