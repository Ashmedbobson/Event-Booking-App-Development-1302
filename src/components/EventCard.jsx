import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiMonitor } = FiIcons;

const EventCard = ({ event, index = 0 }) => {
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
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>
        {event.isVirtual && (
          <div className="absolute top-4 left-4">
            <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <SafeIcon icon={FiMonitor} className="h-3 w-3 mr-1" />
              Virtual
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <SafeIcon icon={FiCalendar} className="h-4 w-4 mr-2 text-primary-500" />
            <span className="text-sm">
              {formatDate(event.startDate)} at {formatTime(event.startDate)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <SafeIcon icon={FiMapPin} className="h-4 w-4 mr-2 text-primary-500" />
            <span className="text-sm">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <SafeIcon icon={FiUsers} className="h-4 w-4 mr-2 text-primary-500" />
            <span className="text-sm">
              {event.currentAttendees} / {event.maxAttendees} attendees
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SafeIcon icon={FiDollarSign} className="h-4 w-4 mr-1 text-green-500" />
            <span className="font-bold text-lg text-gray-800">
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </span>
          </div>
          
          <Link
            to={`/event/${event.id}`}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;