import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const { FiCalendar, FiSearch, FiPlus, FiUser, FiLogOut, FiMenu, FiX } = FiIcons;

const Header = () => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/create-event', label: 'Create Event', requiresAuth: true },
    { path: '/profile', label: 'Profile', requiresAuth: true },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <SafeIcon icon={FiCalendar} className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                if (item.requiresAuth && !user) return null;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/create-event"
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="h-4 w-4" />
                    <span>Create Event</span>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.name || user.email}
                    </span>
                    <button
                      onClick={logout}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <SafeIcon icon={FiLogOut} className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <SafeIcon
                icon={showMobileMenu ? FiX : FiMenu}
                className="h-6 w-6 text-gray-600"
              />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  if (item.requiresAuth && !user) return null;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-primary-600'
                          : 'text-gray-700 hover:text-primary-600'
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                    className="text-left text-red-600 font-medium"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleAuthClick();
                      setShowMobileMenu(false);
                    }}
                    className="text-left bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-medium w-fit"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;