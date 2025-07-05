import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';

const { FiSearch, FiFilter, FiCalendar, FiMapPin, FiDollarSign, FiX } = FiIcons;

const EventsPage = () => {
  const { events, searchEvents } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    location: '',
    priceRange: [0, 500],
    dateRange: null,
  });

  const categories = ['Technology', 'Business', 'Arts', 'Sports', 'Music', 'Food', 'Education', 'Health'];
  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA'];

  useEffect(() => {
    const results = searchEvents(searchQuery, filters);
    setFilteredEvents(results);
  }, [searchQuery, filters, events, searchEvents]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category) params.set('category', filters.category);
    setSearchParams(params);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      priceRange: [0, 500],
      dateRange: null,
    });
    setSearchQuery('');
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && !(Array.isArray(value) && value.length === 0)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover Events</h1>
          <p className="text-gray-600">Find your next amazing experience</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, categories, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SafeIcon icon={FiFilter} className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <SafeIcon icon={FiX} className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 500])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredEvents.length} events
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiSearch} className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all events
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
            >
              Show All Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;