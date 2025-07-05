import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';

const { FiUser, FiCalendar, FiUsers, FiTrendingUp, FiEdit, FiMail, FiMapPin, FiSettings } = FiIcons;

const ProfilePage = () => {
  const { user } = useAuth();
  const { userEvents, attendedEvents } = useEvents();
  const [activeTab, setActiveTab] = useState('created');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: FiCalendar,
      label: 'Events Created',
      value: userEvents.length,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FiUsers,
      label: 'Events Attended',
      value: attendedEvents.length,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: FiTrendingUp,
      label: 'Total Attendees',
      value: userEvents.reduce((total, event) => total + event.currentAttendees, 0),
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const tabs = [
    { id: 'created', label: 'Created Events', count: userEvents.length },
    { id: 'attended', label: 'Attended Events', count: attendedEvents.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 rounded-full">
              <SafeIcon icon={FiUser} className="h-16 w-16 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="flex items-center text-gray-500 text-sm">
                <SafeIcon icon={FiCalendar} className="h-4 w-4 mr-2" />
                <span>Member since {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-2">
                <SafeIcon icon={FiEdit} className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <SafeIcon icon={FiSettings} className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <SafeIcon icon={stat.icon} className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Events Grid */}
          <div>
            {activeTab === 'created' && (
              <div>
                {userEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiCalendar} className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No events created yet</h3>
                    <p className="text-gray-600 mb-6">Start creating amazing events for your community</p>
                    <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Create Your First Event
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'attended' && (
              <div>
                {attendedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attendedEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiUsers} className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No events attended yet</h3>
                    <p className="text-gray-600 mb-6">Discover and join amazing events in your area</p>
                    <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Browse Events
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;