import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

const { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiMonitor, FiBookmark, FiHeart } = FiIcons;

const EventCard = ({ event, index = 0 }) => {
  const { saveEvent, unsaveEvent, isEventSaved } = useEvents();
  const { user } = useAuth();
  const isSaved = isEventSaved(event.id);

  const handleSaveToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Could trigger auth modal here
      alert('Please sign in to save events');
      return;
    }

    if (isSaved) {
      unsaveEvent(event.id);
    } else {
      saveEvent(event.id);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'h:mm a');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900 transition-all duration-300 group w-full"
    >
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-primary-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {event.category}
          </span>
        </div>
        {event.isVirtual && (
          <div className="absolute top-3 left-3">
            <span className="bg-secondary-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
              <SafeIcon icon={FiMonitor} className="h-3 w-3 mr-1" />
              Virtual
            </span>
          </div>
        )}
        {/* Enhanced Save Button with Animation */}
        <motion.button
          onClick={handleSaveToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg ${
            isSaved
              ? 'bg-primary-500 text-white transform scale-110'
              : 'bg-white dark:bg-gray-800 bg-opacity-90 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-500 dark:hover:text-primary-400'
          }`}
          title={isSaved ? 'Remove from saved events' : 'Save this event'}
        >
          <SafeIcon
            icon={FiBookmark}
            className={`h-4 w-4 transition-all duration-200 ${isSaved ? 'fill-current' : ''}`}
          />
        </motion.button>

        {/* Save Status Indicator */}
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center"
          >
            <SafeIcon icon={FiHeart} className="h-3 w-3 mr-1" />
            Saved
          </motion.div>
        )}
      </div>

      <Link to={`/event/${event.id}`} className="block">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <SafeIcon icon={FiCalendar} className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">
                {formatDate(event.startDate)} at {formatTime(event.startDate)}
              </span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <SafeIcon icon={FiMapPin} className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <SafeIcon icon={FiUsers} className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                {event.currentAttendees} / {event.maxAttendees} attendees
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SafeIcon icon={FiDollarSign} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-500" />
              <span className="font-bold text-base sm:text-lg text-gray-800 dark:text-white">
                {event.price === 0 ? 'Free' : `$${event.price}`}
              </span>
            </div>
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-sm sm:text-base">
              View Details
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;