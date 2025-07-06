import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiSearch, FiCalendar, FiUser, FiPlus, FiBookmark } = FiIcons;

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/events', label: 'Search', icon: FiSearch },
    { path: '/create-event', label: 'Create', icon: FiPlus },
    { path: '/saved', label: 'Saved', icon: FiBookmark },
    { path: '/account', label: 'Account', icon: FiUser }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden transition-colors duration-200">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive(item.path)
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <SafeIcon
              icon={item.icon}
              className={`h-5 w-5 ${
                item.path === '/create-event'
                  ? 'bg-primary-500 text-white p-1 rounded-full h-8 w-8'
                  : ''
              }`}
            />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;