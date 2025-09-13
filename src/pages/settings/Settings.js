import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile, upgradePlan, changePassword } = useAuth();
  
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    site: user?.site || '',
    company: user?.company || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (result.success) {
        toast.success('Password changed successfully!');
        
        // Reset password form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await updateProfile(profileForm);
      if (result.success) {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpgradePlan = async () => {
    setIsLoading(true);
    
    try {
      const result = await upgradePlan('pro');
      if (result.success) {
        toast.success('Successfully upgraded to Pro plan!');
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Failed to upgrade plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderAccountTab = () => {
    return (
      <div className="space-y-6">
        {/* Profile Form */}
        <div className="glassmorphism-card glow-container">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-cursor-text">
              Profile Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-cursor-text/70">
              Update your personal information.
            </p>
          </div>
          <div className="border-t border-white/10 px-4 py-5 sm:p-6">
            <form onSubmit={saveProfile} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-cursor-text">
                    Full name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-cursor-text">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="company" className="block text-sm font-medium text-cursor-text">
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={profileForm.company}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="site" className="block text-sm font-medium text-cursor-text">
                    Website URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      name="site"
                      id="site"
                      value={profileForm.site}
                      onChange={handleProfileChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-n8n-green hover:bg-n8n-darkGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-n8n-green ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Password Form */}
        <div className="glassmorphism-card glow-container">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-cursor-text">
              Change Password
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-cursor-text/70">
              Update your password.
            </p>
          </div>
          <div className="border-t border-white/10 px-4 py-5 sm:p-6">
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-cursor-text">
                    Current password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      autoComplete="current-password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-cursor-text">
                    New password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      autoComplete="new-password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-cursor-text">
                    Confirm new password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      autoComplete="new-password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-n8n-green hover:bg-n8n-darkGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-n8n-green ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  const renderBillingTab = () => {
    return (
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="glassmorphism-card glow-container">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-cursor-text">
              Current Plan
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-cursor-text/70">
              Your subscription details.
            </p>
          </div>
          <div className="border-t border-white/10">
            <dl>
              <div className="bg-cursor-dark/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-cursor-text/80">Plan</dt>
                <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.plan === 'pro' ? 'bg-n8n-green/20 text-n8n-green' : 'bg-cursor-lightgray/20 text-cursor-text'
                  }`}>
                    {user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                  </span>
                </dd>
              </div>
              
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-cursor-text/80">Billing cycle</dt>
                <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                  {user?.plan === 'pro' ? 'Monthly' : 'N/A'}
                </dd>
              </div>
              
              <div className="bg-cursor-dark/30 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-cursor-text/80">Next billing date</dt>
                <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                  {user?.plan === 'pro' ? 'June 7, 2025' : 'N/A'}
                </dd>
              </div>
              
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-cursor-text/80">Amount</dt>
                <dd className="mt-1 text-sm text-cursor-text sm:mt-0 sm:col-span-2">
                  {user?.plan === 'pro' ? '$24.99 / month' : 'Free'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Plan Options */}
        <div className="glassmorphism-card glow-container">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-cursor-text">
              Plan Options
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-cursor-text/70">
              Compare and upgrade your plan.
            </p>
          </div>
          
          <div className="border-t border-white/10 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {/* Free Plan */}
              <div className="border border-white/10 rounded-lg p-4 bg-cursor-dark/40 relative">
                {user?.plan === 'free' && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-n8n-green/20 text-n8n-green">
                      Current
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-cursor-text">Free Plan</h4>
                    <p className="mt-1 text-sm text-cursor-text/70">For individuals and small websites</p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-n8n-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        1 chatbot
                      </li>
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-n8n-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        100 conversations/month
                      </li>
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-n8n-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        Basic customization
                      </li>
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-cursor-lightgray/50" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                        Advanced analytics
                      </li>
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-cursor-lightgray/50" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                        Custom branding
                      </li>
                    </ul>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cursor-text">$0</p>
                    <p className="text-sm text-cursor-text/70">Forever free</p>
                  </div>
                </div>
              </div>
              
              {/* Pro Plan */}
              <div className="border border-n8n-green/30 rounded-lg p-4 bg-n8n-green/5 backdrop-blur-md relative">
                {user?.plan === 'pro' && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-n8n-green/20 text-n8n-green">
                      Current
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-cursor-text">Pro Plan</h4>
                    <p className="mt-1 text-sm text-cursor-text/70">For businesses and growing websites</p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-n8n-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        Unlimited chatbots
                      </li>
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-n8n-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        Unlimited conversations
                      </li>
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-n8n-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        Advanced customization
                      </li>
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-n8n-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        Advanced analytics
                      </li>
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-n8n-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        Remove BotUp branding
                      </li>
                      <li className="flex items-center text-sm text-cursor-text/70">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-n8n-green" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        Priority support
                      </li>
                    </ul>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cursor-text">$24.99</p>
                    <p className="text-sm text-cursor-text/70">per month</p>
                  </div>
                </div>
                
                {user?.plan !== 'pro' && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={handleUpgradePlan}
                      disabled={isLoading}
                      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-n8n-green hover:bg-n8n-darkGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-n8n-green ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? 'Upgrading...' : 'Upgrade Now'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Layout
      title="Settings"
      subtitle="Manage your account and subscription"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="glassmorphism-card p-4 glow-container">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('account')}
              className={`${
                activeTab === 'account'
                  ? 'border-n8n-green text-n8n-green'
                  : 'border-transparent text-cursor-text hover:text-cursor-text/80 hover:border-white/20'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Account Settings
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`${
                activeTab === 'billing'
                  ? 'border-n8n-green text-n8n-green'
                  : 'border-transparent text-cursor-text hover:text-cursor-text/80 hover:border-white/20'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Billing & Plans
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
          {activeTab === 'account' ? renderAccountTab() : renderBillingTab()}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;