import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import NavigationBar from '../common/NavigationBar';

const Layout = ({ children, title, subtitle }) => {
  // Removed shooting stars from individual layouts for better performance
  // We'll use just the app-wide SpaceBackground instead
  
  return (
    <div className="min-h-screen text-cursor-text relative overflow-hidden">
      {/* Toast notifications with space theme */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(36, 0, 70, 0.8)',
            color: '#F0F0F0',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(157, 78, 221, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          },
        }}
      />
      
      <NavigationBar />
      
      <main className="py-6 z-10 relative">
        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-semibold text-cursor-text bg-gradient-to-r from-space-purple via-space-violet to-space-blue bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-cursor-muted">{subtitle}</p>
              )}
            </div>
          )}
          
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;