import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { auth, clients } from '../services/api';

// API base URL - update this to match your backend server
const API_URL = 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing auth token on load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('botup_auth_token');
        if (token) {
          // Validate token with backend
          const response = await auth.verify();
          
          // If token is valid, set the user data
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            // Invalid token, remove it
            localStorage.removeItem('botup_auth_token');
          }
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // If there's an error, remove the token
        localStorage.removeItem('botup_auth_token');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  // Login function - connects to MySQL through backend API
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Use the API service for login
      const response = await auth.login(email, password);
      
      // If login is successful
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('botup_auth_token', response.data.token);
        
        // Fetch user profile data
        const userResponse = await clients.getProfile();
        
        setUser(userResponse.data);
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error('Login failed. Invalid response from server.');
        return { success: false, error: 'Invalid server response' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error statuses
      if (error.response) {
        if (error.response.status === 400) {
          toast.error('Invalid email or password');
        } else {
          toast.error(`Login failed: ${error.response.data.message || 'Server error'}`);
        }
      } else {
        toast.error('Login failed. Server may be offline.');
      }
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Signup function - connects to MySQL through backend API
  const signup = async (name, email, password, site, company = '') => {
    try {
      setLoading(true);
      
      // Use the API service for registration
      const response = await auth.register({
        name,
        email,
        password,
        site,
        company
      });
      
      // If signup is successful
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('botup_auth_token', response.data.token);
        
        // Fetch user profile
        const userResponse = await clients.getProfile();
        
        setUser(userResponse.data);
        toast.success('Account created successfully!');
        return { success: true };
      } else {
        toast.error('Signup failed. Invalid response from server.');
        return { success: false, error: 'Invalid server response' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle different error cases
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message || 'Email already in use');
        } else {
          toast.error(`Signup failed: ${error.response.data.message || 'Server error'}`);
        }
      } else {
        toast.error('Signup failed. Server may be offline.');
      }
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('botup_auth_token');
    setUser(null);
    toast.success('Logged out successfully');
  };
  
  // Update user profile function
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('botup_auth_token');
      
      if (!token) {
        toast.error('Authentication required');
        return { success: false, error: 'Authentication required' };
      }
      
      // Use the API service for profile update
      const response = await clients.updateProfile(userData);
      
      // Update user data in state
      setUser(response.data);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      
      if (error.response) {
        toast.error(`Failed to update profile: ${error.response.data.message || 'Server error'}`);
      } else {
        toast.error('Failed to update profile. Server may be offline.');
      }
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Upgrade plan function
  const upgradePlan = async (plan) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('botup_auth_token');
      
      if (!token) {
        toast.error('Authentication required');
        return { success: false, error: 'Authentication required' };
      }
      
      // Use the API service for plan upgrade
      const response = await clients.upgradePlan(plan);
      
      // Update user data with new plan
      setUser({ ...user, plan });
      toast.success(`Successfully upgraded to ${plan} plan!`);
      return { success: true };
    } catch (error) {
      console.error('Plan upgrade error:', error);
      
      if (error.response) {
        toast.error(`Failed to upgrade plan: ${error.response.data.message || 'Server error'}`);
      } else {
        toast.error('Failed to upgrade plan. Server may be offline.');
      }
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('botup_auth_token');
      
      if (!token) {
        toast.error('Authentication required');
        return { success: false, error: 'Authentication required' };
      }
      
      // Use the API service for password change
      const response = await auth.changePassword(currentPassword, newPassword);
      
      if (response.data.success) {
        // Get a new token by logging in with the new password
        const loginResponse = await auth.login(user.email, newPassword);
        
        if (loginResponse.data.token) {
          // Update the stored token
          localStorage.setItem('botup_auth_token', loginResponse.data.token);
          
          // Fetch updated user profile
          const userResponse = await clients.getProfile();
          setUser(userResponse.data);
          
          toast.success('Password changed successfully!');
          return { success: true };
        }
      }
      
      return { success: false, error: 'Failed to update session' };
    } catch (error) {
      console.error('Password change error:', error);
      
      if (error.response) {
        if (error.response.status === 400) {
          toast.error('Current password is incorrect');
        } else {
          toast.error(`Failed to change password: ${error.response.data.message || 'Server error'}`);
        }
      } else {
        toast.error('Failed to change password. Server may be offline.');
      }
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    upgradePlan,
    changePassword,
    isAuthenticated: !!user,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};