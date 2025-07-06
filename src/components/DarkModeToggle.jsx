import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSun, FiMoon, FiMonitor } = FiIcons;

const DarkModeToggle = ({ size = 'default', showLabel = false }) => {
  const [darkMode, setDarkMode] = useState('auto');
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    // Listen for system changes
    const handleChange = (e) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Load saved preference
    const savedMode = localStorage.getItem('darkMode') || 'auto';
    setDarkMode(savedMode);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Save preference
    localStorage.setItem('darkMode', darkMode);

    // Apply theme
    const root = document.documentElement;
    
    if (darkMode === 'dark' || (darkMode === 'auto' && systemPrefersDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode, systemPrefersDark]);

  const modes = [
    { id: 'light', icon: FiSun, label: 'Light' },
    { id: 'auto', icon: FiMonitor, label: 'Auto' },
    { id: 'dark', icon: FiMoon, label: 'Dark' }
  ];

  const currentMode = modes.find(mode => mode.id === darkMode);
  const nextMode = modes[(modes.findIndex(mode => mode.id === darkMode) + 1) % modes.length];

  const handleToggle = () => {
    setDarkMode(nextMode.id);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-1.5 h-8 w-8';
      case 'large':
        return 'p-3 h-12 w-12';
      default:
        return 'p-2 h-10 w-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4';
      case 'large':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          ${getSizeClasses()}
          rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
          transition-all duration-200 flex items-center justify-center
          bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
          shadow-sm hover:shadow-md
        `}
        title={`Switch to ${nextMode.label.toLowerCase()} mode`}
        aria-label={`Current theme: ${currentMode.label}. Click to switch to ${nextMode.label.toLowerCase()}`}
      >
        <motion.div
          key={darkMode}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SafeIcon 
            icon={currentMode.icon} 
            className={`${getIconSize()} text-gray-600 dark:text-gray-300`} 
          />
        </motion.div>
      </motion.button>

      {showLabel && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {currentMode.label} Mode
        </div>
      )}
    </div>
  );
};

export default DarkModeToggle;