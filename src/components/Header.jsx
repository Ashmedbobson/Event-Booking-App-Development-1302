import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import DarkModeToggle from './DarkModeToggle';

const { FiCalendar, FiSearch, FiPlus, FiUser, FiLogOut, FiMenu, FiX, FiBookmark, FiChevronDown } = FiIcons;

const Header = ({ NotificationCenter }) => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/#/events?q=${encodeURIComponent(searchQuery)}`;
      setShowSearchBar(false);
      setSearchQuery('');
    }
  };

  const categories = [
    { name: 'Technology', icon: '💻' },
    { name: 'Business', icon: '💼' },
    { name: 'Arts', icon: '🎨' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Music', icon: '🎵' },
    { name: 'Food', icon: '🍕' },
    { name: 'Education', icon: '📚' },
    { name: 'Health', icon: '🏥' },
  ];

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/saved', label: 'Saved', requiresAuth: true },
    { path: '/create-event', label: 'Create Event', requiresAuth: true },
    { path: '/account', label: 'Account', requiresAuth: true },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800 sticky top-0 z-50 transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-1.5 sm:p-2 rounded-lg">
                <SafeIcon icon={FiCalendar} className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                SierraHub
              </span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => {
                if (item.requiresAuth && !user) return null;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-medium transition-colors text-sm xl:text-base ${
                      isActive(item.path)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                  onMouseEnter={() => setShowCategoriesDropdown(true)}
                  className="flex items-center space-x-1 font-medium text-sm xl:text-base text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <span>Categories</span>
                  <SafeIcon icon={FiChevronDown} className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {showCategoriesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onMouseLeave={() => setShowCategoriesDropdown(false)}
                      className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700 border border-gray-200 dark:border-gray-600 p-4 z-50"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            to={`/events?category=${category.name}`}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowCategoriesDropdown(false)}
                          >
                            <span className="text-xl">{category.icon}</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{category.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <Link
                          to="/events"
                          className="block text-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                          onClick={() => setShowCategoriesDropdown(false)}
                        >
                          View All Events
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Desktop Actions - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              {/* Desktop Search Button */}
              <button
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Search Events"
              >
                <SafeIcon icon={FiSearch} className="h-5 w-5" />
              </button>

              <DarkModeToggle />
              {NotificationCenter}

              {user ? (
                <>
                  <Link
                    to="/create-event"
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 xl:px-4 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-2 text-sm xl:text-base"
                  >
                    <SafeIcon icon={FiPlus} className="h-4 w-4" />
                    <span className="hidden xl:inline">Create Event</span>
                    <span className="xl:hidden">Create</span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                      <SafeIcon icon={FiUser} className="h-4 w-4 xl:h-5 xl:w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-24 xl:max-w-none truncate">
                      {user.name || user.email}
                    </span>
                    <button
                      onClick={logout}
                      className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                    >
                      <SafeIcon icon={FiLogOut} className="h-4 w-4 xl:h-5 xl:w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 xl:px-6 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-sm xl:text-base"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Mobile Search Button */}
              <button
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Search Events"
              >
                <SafeIcon icon={FiSearch} className="h-5 w-5" />
              </button>

              <DarkModeToggle size="small" />
              {user && NotificationCenter}

              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <SafeIcon icon={showMobileMenu ? FiX : FiMenu} className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {showSearchBar && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pb-4 border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                  <div className="relative">
                    <SafeIcon
                      icon={FiSearch}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="Search events, categories, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1.5 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiSearch} className="h-4 w-4" />
                      <span className="text-sm">Search</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4"
              >
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => {
                    if (item.requiresAuth && !user) return null;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`font-medium transition-colors py-2 ${
                          isActive(item.path)
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  {/* Mobile Categories */}
                  <div className="py-2">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          to={`/events?category=${category.name}`}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    {user ? (
                      <>
                        <div className="flex items-center space-x-3 py-2">
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                            <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setShowMobileMenu(false);
                          }}
                          className="text-left text-red-500 dark:text-red-400 font-medium py-2"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          handleAuthClick();
                          setShowMobileMenu(false);
                        }}
                        className="w-full text-left bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-3 rounded-lg font-medium"
                      >
                        Sign In / Create Account
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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