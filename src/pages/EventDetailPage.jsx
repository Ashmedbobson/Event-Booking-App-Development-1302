import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

const { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiMonitor, FiShare2, FiHeart, FiArrowLeft, FiUser, FiMail, FiPhone } = FiIcons;

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, attendEvent, unattendEvent } = useEvents();
  const { user } = useAuth();
  const [isAttending, setIsAttending] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const event = getEventById(id);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const handleAttendEvent = () => {
    if (!user) {
      // Redirect to login or show auth modal
      return;
    }

    if (isAttending) {
      unattendEvent(event.id, user.id);
      setIsAttending(false);
    } else {
      attendEvent(event.id, user.id);
      setIsAttending(true);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

  const isEventFull = event.currentAttendees >= event.maxAttendees;
  const attendancePercentage = (event.currentAttendees / event.maxAttendees) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-primary-600 to-secondary-600">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="absolute top-8 left-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all duration-200"
          >
            <SafeIcon icon={FiArrowLeft} className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  {event.category}
                </span>
                {event.isVirtual && (
                  <span className="bg-secondary-500 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <SafeIcon icon={FiMonitor} className="h-4 w-4 mr-2" />
                    Virtual Event
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
              <p className="text-xl text-gray-200 max-w-3xl">{event.description}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <SafeIcon icon={FiCalendar} className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Date & Time</h3>
                    <p className="text-gray-600">
                      {formatDate(event.startDate)} at {formatTime(event.startDate)}
                    </p>
                    <p className="text-gray-600">
                      Ends: {formatDate(event.endDate)} at {formatTime(event.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <SafeIcon icon={event.isVirtual ? FiMonitor : FiMapPin} className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {event.isVirtual ? 'Virtual Location' : 'Location'}
                    </h3>
                    <p className="text-gray-600">
                      {event.isVirtual ? 'Online Event' : event.location}
                    </p>
                    {event.isVirtual && event.virtualLink && (
                      <a
                        href={event.virtualLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Join Virtual Event
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <SafeIcon icon={FiUsers} className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Attendees</h3>
                    <p className="text-gray-600">
                      {event.currentAttendees} / {event.maxAttendees} registered
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${attendancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <SafeIcon icon={FiDollarSign} className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Price</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Organizer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Organizer</h2>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <SafeIcon icon={FiUser} className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{event.organizerName}</h3>
                  <p className="text-gray-600">Event Organizer</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-8 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                </div>
                <p className="text-gray-600">per person</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleAttendEvent}
                  disabled={isEventFull && !isAttending}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                    isEventFull && !isAttending
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isAttending
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600'
                  }`}
                >
                  {isEventFull && !isAttending
                    ? 'Event Full'
                    : isAttending
                    ? 'Cancel Registration'
                    : 'Register Now'}
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={shareEvent}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiShare2} className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  
                  <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <SafeIcon icon={FiHeart} className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Event Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Event</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;