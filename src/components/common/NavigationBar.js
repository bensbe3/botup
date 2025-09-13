import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/backoffice', label: 'Backoffice', icon: 'analytics' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };
  
  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
  };
  
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        );
      case 'analytics':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <nav className="bg-cursor-dark/80 backdrop-blur-md border-b border-white/10 z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex space-x-4">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200 ${
                        isActive
                          ? 'bg-space-purple/10 text-space-purple hover:bg-space-purple/20 hover:shadow-space-glow'
                          : 'text-cursor-text hover:bg-cursor-gray/50 hover:text-space-violet'
                      }`
                    }
                  >
                    <span className="mr-2">
                      {renderIcon(item.icon)}
                    </span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Notification Bell */}
            <div className="ml-3 relative">
              <button
                className="p-1 rounded-full text-cursor-muted hover:text-space-purple hover:bg-space-purple/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cursor-dark focus:ring-space-purple transition-all duration-200"
              >
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-space-purple rounded-full flex items-center justify-center text-xs text-white">
                  3
                </span>
              </button>
            </div>
            
            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={toggleProfileMenu}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cursor-dark focus:ring-space-purple transition-all duration-200"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-space-purple/20 flex items-center justify-center text-space-purple font-semibold border border-space-purple/30">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-2 hidden md:block text-left">
                      <div className="text-sm font-medium text-cursor-text">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-xs text-cursor-muted">
                        {user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                      </div>
                    </div>
                    <svg 
                      className={`ml-1 h-5 w-5 text-cursor-muted transform transition-transform duration-300 ${profileMenuOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </button>
              </div>
              
              {profileMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-cursor-dark/90 backdrop-blur-md border border-white/10 divide-y divide-white/10 focus:outline-none z-10"
                >
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-cursor-text hover:bg-space-purple/10 hover:text-space-purple transition-colors duration-150"
                    >
                      Your Profile
                    </a>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 text-sm text-cursor-text hover:bg-space-purple/10 hover:text-space-purple transition-colors duration-150"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Settings
                    </NavLink>
                    {user?.plan === 'free' && (
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-space-purple hover:bg-space-purple/10 transition-colors duration-150"
                      >
                        ✨ Upgrade to Pro
                      </a>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-cursor-text hover:bg-space-purple/10 hover:text-space-purple transition-colors duration-150"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="ml-3 flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-cursor-muted hover:text-space-purple hover:bg-space-purple/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-space-purple"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg 
                    className="block h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg 
                    className="block h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - simplified without animations */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-cursor-dark/80 backdrop-blur-md">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    isActive
                      ? 'bg-space-purple/10 text-space-purple'
                      : 'text-cursor-text hover:bg-space-purple/5 hover:text-space-violet'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2">{renderIcon(item.icon)}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-white/10 bg-cursor-dark/80 backdrop-blur-md">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-space-purple/20 flex items-center justify-center text-space-purple font-semibold border border-space-purple/30">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-cursor-text">{user?.name || 'User'}</div>
                <div className="text-sm font-medium text-cursor-muted">{user?.email || 'user@example.com'}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <a
                href="#"
                className="block px-4 py-2 text-base font-medium text-cursor-text hover:bg-space-purple/10 hover:text-space-purple"
                onClick={() => setIsOpen(false)}
              >
                Your Profile
              </a>
              <NavLink
                to="/settings"
                className="block px-4 py-2 text-base font-medium text-cursor-text hover:bg-space-purple/10 hover:text-space-purple"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </NavLink>
              {user?.plan === 'free' && (
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-space-purple hover:bg-space-purple/10"
                  onClick={() => setIsOpen(false)}
                >
                  ✨ Upgrade to Pro
                </a>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-cursor-text hover:bg-space-purple/10 hover:text-space-purple"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;