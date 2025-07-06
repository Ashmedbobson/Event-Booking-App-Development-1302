import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBell, FiX, FiCalendar, FiUsers, FiHeart, FiMessageCircle, FiCheckCircle } = FiIcons;

const NotificationCenter = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_reminder': return FiCalendar;
      case 'new_attendee': return FiUsers;
      case 'event_liked': return FiHeart;
      case 'message': return FiMessageCircle;
      default: return FiBell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'event_reminder': return 'bg-blue-100 text-blue-600';
      case 'new_attendee': return 'bg-green-100 text-green-600';
      case 'event_liked': return 'bg-pink-100 text-pink-600';
      case 'message': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <SafeIcon icon={FiBell} className="h-5 w-5 sm:h-6 sm:w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Notifications</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <SafeIcon icon={FiX} className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                  {['all', 'unread', 'event_reminder', 'new_attendee'].map(filterType => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        filter === filterType
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filterType.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Mark All Read */}
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-1.5 sm:p-2 rounded-full ${getNotificationColor(notification.type)} flex-shrink-0`}>
                          <SafeIcon 
                            icon={getNotificationIcon(notification.type)} 
                            className="h-3 w-3 sm:h-4 sm:w-4" 
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>

                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-primary-500 hover:text-primary-600 flex-shrink-0"
                          >
                            <SafeIcon icon={FiCheckCircle} className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 sm:p-8 text-center text-gray-500">
                    <SafeIcon icon={FiBell} className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;