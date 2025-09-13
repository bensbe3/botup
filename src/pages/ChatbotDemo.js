import React from 'react';
import Layout from '../components/layout/Layout';
import LaptopChatbotDemo from '../components/common/LaptopChatbotDemo';

const ChatbotDemo = () => {
  return (
    <Layout
      title="Chatbot Demo"
      subtitle="Experience our chatbot in a simulated environment"
    >
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-cursor-text mb-4 text-center">
          Try Our Interactive Chatbot Demo
        </h1>
        <p className="text-lg text-cursor-text/70 max-w-2xl text-center mb-8">
          See how our chatbot appears on your website. Click the chat icon in the
          bottom-right corner of the simulated website to start a conversation.
        </p>
        
        <div className="w-full glow-container rounded-2xl glassmorphism p-6">
          <LaptopChatbotDemo />
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-cursor-text mb-6">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl glassmorphism glow-container">
              <div className="w-12 h-12 bg-space-purple/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-space-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-cursor-text mb-2">Instant Responses</h3>
              <p className="text-cursor-text/70">Engage visitors immediately with quick, helpful replies.</p>
            </div>
            
            <div className="p-5 rounded-xl glassmorphism glow-container">
              <div className="w-12 h-12 bg-space-purple/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-space-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-cursor-text mb-2">Secure & Reliable</h3>
              <p className="text-cursor-text/70">Enterprise-grade security with 99.9% uptime guarantee.</p>
            </div>
            
            <div className="p-5 rounded-xl glassmorphism glow-container">
              <div className="w-12 h-12 bg-space-purple/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-space-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-cursor-text mb-2">Fully Customizable</h3>
              <p className="text-cursor-text/70">Match your brand with easy theme and behavior customization.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-cursor-text mb-4">Ready to elevate your customer support?</h2>
          <p className="text-lg text-cursor-text/70 mb-6">
            Get started with BotUp and transform your customer experience today.
          </p>
          <button className="btn btn-primary px-8 py-3 text-base font-medium">Get Started Free</button>
        </div>
      </div>
    </Layout>
  );
};

export default ChatbotDemo; 