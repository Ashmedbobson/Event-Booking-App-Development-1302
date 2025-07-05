import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';

const { FiSearch, FiCalendar, FiUsers, FiTrendingUp, FiArrowRight, FiPlay } = FiIcons;

const HomePage = () => {
  const { events } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredEvents = events.slice(0, 6);
  const stats = [
    { icon: FiCalendar, label: 'Events Created', value: '10,000+' },
    { icon: FiUsers, label: 'Happy Attendees', value: '500,000+' },
    { icon: FiTrendingUp, label: 'Success Rate', value: '99%' },
  ];

  const categories = [
    { name: 'Technology', icon: '💻', color: 'bg-blue-100 text-blue-600' },
    { name: 'Business', icon: '💼', color: 'bg-green-100 text-green-600' },
    { name: 'Arts', icon: '🎨', color: 'bg-purple-100 text-purple-600' },
    { name: 'Sports', icon: '⚽', color: 'bg-orange-100 text-orange-600' },
    { name: 'Music', icon: '🎵', color: 'bg-pink-100 text-pink-600' },
    { name: 'Food', icon: '🍕', color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
            >
              Discover Amazing{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Events
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Connect with like-minded people, learn new skills, and create unforgettable memories.
              From tech conferences to art workshops, find your next adventure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/events"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-2"
              >
                <SafeIcon icon={FiSearch} className="h-5 w-5" />
                <span>Explore Events</span>
              </Link>
              
              <Link
                to="/create-event"
                className="border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-lg font-medium hover:bg-primary-500 hover:text-white transition-all duration-200 flex items-center space-x-2"
              >
                <SafeIcon icon={FiCalendar} className="h-5 w-5" />
                <span>Create Event</span>
              </Link>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, categories, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={stat.icon} className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover events that match your interests and passions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Link
                  to={`/events?category=${category.name}`}
                  className="block p-6 bg-white rounded-xl hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Events</h2>
              <p className="text-gray-600">Don't miss these amazing upcoming events</p>
            </div>
            <Link
              to="/events"
              className="hidden sm:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>View All Events</span>
              <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
            >
              <span>View All Events</span>
              <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Host Your Own Event?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of event organizers who trust EventHub to bring their vision to life.
              Create, promote, and manage your events with ease.
            </p>
            <Link
              to="/create-event"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <SafeIcon icon={FiPlay} className="h-5 w-5" />
              <span>Get Started Now</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;