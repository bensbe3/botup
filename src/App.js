/**
 * BotUp - Chatbot Platform
 * Copyright (c) 2024 Mohamed Bensbaa. All rights reserved.
 * 
 * This file is part of the BotUp chatbot platform.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Backoffice from './pages/backoffice/Backoffice';
import Settings from './pages/settings/Settings';
import NotFound from './pages/NotFound';
import ChatbotDemo from './pages/ChatbotDemo';
import SpaceBackground from './components/common/SpaceBackground';
import ComponentGlow from './components/common/ComponentGlow';
import './index.css';

// Simplified space-themed loading spinner
const SpaceLoading = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-cursor-dark no-glow">
    <div className="relative no-glow">
      <div className="w-16 h-16 rounded-full border-4 border-space-purple/30 border-t-space-purple animate-spin no-glow" />
      <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-space-purple/20 no-glow" />
    </div>
    <p className="mt-4 text-space-violet text-lg no-glow">Loading...</p>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <SpaceLoading />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container bg-cursor-dark min-h-screen no-glow">
        {/* Use minimal space effects for better performance */}
        <SpaceBackground density="low" showNebula={false} showShootingStars={true} />
        {/* Component-contained glow effect */}
        <ComponentGlow />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chatbot-demo" element={<ChatbotDemo />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/backoffice" 
              element={
                <ProtectedRoute>
                  <Backoffice />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to dashboard if logged in, otherwise to login */}
            <Route 
              path="/" 
              element={
                <Navigate to="/chatbot-demo" replace />
              } 
            />
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;