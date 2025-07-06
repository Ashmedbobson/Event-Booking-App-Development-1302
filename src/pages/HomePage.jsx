import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const { FiSearch, FiCalendar, FiArrowRight, FiPlay, FiBookmark, FiHeart, FiMapPin, FiUsers } = FiIcons;

const HomePage = () => {
  const { events, getSavedEventsCount } = useEvents();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredEvents = events.slice(0, 6);
  const savedCount = getSavedEventsCount();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/#/events?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Get some stats for Sierra Leone
  const sierraLeoneStats = {
    totalEvents: events.length,
    freeEvents: events.filter(e => e.price === 0).length,
    localPaymentEvents: events.filter(e => e.acceptsLocalCurrency).length,
    virtualEvents: events.filter(e => e.isVirtual).length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 sm:py-16 lg:py-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 mb-4"
            >
              <span className="text-4xl">🇸🇱</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white">
                Discover Amazing{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                  Events
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4"
            >
              Connect with your community in Sierra Leone. From tech conferences in Freetown to cultural festivals across the country - find your next adventure and pay with Orange Money, Airtel Money, or USD.
            </motion.p>

            {/* Sierra Leone Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-primary-600">{sierraLeoneStats.totalEvents}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Events</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600">{sierraLeoneStats.freeEvents}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Free Events</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{sierraLeoneStats.localPaymentEvents}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Mobile Money</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{sierraLeoneStats.virtualEvents}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Virtual Events</div>
              </div>
            </motion.div>

            {/* User's Saved Events Quick Access */}
            {user && savedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 sm:mb-8"
              >
                <Link
                  to="/saved"
                  className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  <SafeIcon icon={FiHeart} className="h-4 w-4" />
                  <span>You have {savedCount} saved event{savedCount !== 1 ? 's' : ''}</span>
                  <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                </Link>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12 px-4"
            >
              <Link
                to="/events"
                className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiSearch} className="h-5 w-5" />
                <span>Explore Events</span>
              </Link>
              <Link
                to="/create-event"
                className="w-full sm:w-auto border-2 border-primary-500 text-primary-500 dark:border-primary-400 dark:text-primary-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:bg-primary-500 hover:text-white dark:hover:bg-primary-400 dark:hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiCalendar} className="h-5 w-5" />
                <span>Create Event</span>
              </Link>
              {user && (
                <Link
                  to="/saved"
                  className="w-full sm:w-auto border-2 border-green-500 text-green-500 dark:border-green-400 dark:text-green-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiBookmark} className="h-5 w-5" />
                  <span>Saved Events</span>
                </Link>
              )}
            </motion.div>

            {/* Enhanced Search Bar with Location Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto px-4"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search events, categories, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-20 sm:pr-24 py-3 sm:py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-base sm:text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
                  >
                    <SafeIcon icon={FiSearch} className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm font-medium">Search</span>
                  </button>
                </div>
              </form>

              {/* Location and Category Suggestions */}
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Popular Locations:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu'].map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setSearchQuery(location);
                          window.location.href = `/#/events?q=${encodeURIComponent(location)}`;
                        }}
                        className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center space-x-1"
                      >
                        <SafeIcon icon={FiMapPin} className="h-3 w-3" />
                        <span>{location}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Popular Categories:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Technology', 'Music', 'Business', 'Arts', 'Sports'].map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSearchQuery(category);
                          window.location.href = `/#/events?category=${encodeURIComponent(category)}`;
                        }}
                        className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payment Methods Info Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Pay Your Way 💳🇸🇱
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We support multiple payment methods to make event registration easy for everyone in Sierra Leone
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Orange Money', icon: '🍊', popular: true },
              { name: 'Airtel Money', icon: '📱', popular: true },
              { name: 'US Dollar', icon: '💵', popular: false },
              { name: 'Cash App', icon: '💸', popular: false },
              { name: 'Bank Transfer', icon: '🏦', popular: false }
            ].map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center relative"
              >
                {method.popular && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{method.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4">Featured Events</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Don't miss these amazing upcoming events in Sierra Leone</p>
            </div>
            <Link
              to="/events"
              className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm sm:text-base"
            >
              <span>View All Events</span>
              <SafeIcon icon={FiArrowRight} className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
            >
              <span>View All Events</span>
              <SafeIcon icon={FiArrowRight} className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-4xl">🇸🇱</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Ready to Host Your Own Event?
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-primary-100 dark:text-primary-200 mb-6 sm:mb-8 px-4">
              Join thousands of event organizers in Sierra Leone who trust SierraHub to bring their vision to life. Create, promote, and manage your events with local payment support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/create-event"
                className="w-full sm:w-auto inline-flex items-center space-x-2 bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <SafeIcon icon={FiPlay} className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Get Started Now</span>
              </Link>
              <div className="flex items-center space-x-2 text-primary-100">
                <SafeIcon icon={FiUsers} className="h-4 w-4" />
                <span className="text-sm">Join 1000+ event organizers</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;