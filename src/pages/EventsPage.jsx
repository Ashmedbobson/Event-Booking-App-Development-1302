import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import MapView from '../components/MapView';
import EventCalendar from '../components/EventCalendar';
import SearchSuggestions from '../components/SearchSuggestions';

const { FiSearch, FiFilter, FiCalendar, FiMapPin, FiDollarSign, FiX, FiMap, FiList } = FiIcons;

const EventsPage = () => {
  const navigate = useNavigate();
  const { events, searchEvents } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'map', 'calendar'
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
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
    setShowSearchSuggestions(false);
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

  const handleEventClick = (event) => {
    navigate(`/event/${event.id}`);
  };

  const handleDateSelect = (date) => {
    // Filter events by selected date
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
    setFilteredEvents(dayEvents);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSearchSuggestions(false);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && !(Array.isArray(value) && value.length === 0)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">Discover Events</h1>
          <p className="text-gray-600 text-sm sm:text-base">Find your next amazing experience</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-4">
            <div className="flex-1 relative">
              <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, categories, or locations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
              />
              {showSearchSuggestions && (
                <SearchSuggestions
                  query={searchQuery}
                  onSuggestionClick={handleSuggestionClick}
                  onClose={() => setShowSearchSuggestions(false)}
                />
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-sm sm:text-base"
            >
              Search
            </button>
          </form>

          {/* View Mode Toggle - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SafeIcon icon={FiList} className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                  viewMode === 'map' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SafeIcon icon={FiMap} className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                  viewMode === 'calendar' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SafeIcon icon={FiCalendar} className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Calendar</span>
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
              >
                <SafeIcon icon={FiFilter} className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm"
                >
                  <SafeIcon icon={FiX} className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Clear Filters</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel - Mobile Optimized */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
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
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 500])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content based on view mode */}
        {viewMode === 'calendar' ? (
          <EventCalendar 
            events={events}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
          />
        ) : viewMode === 'map' ? (
          <MapView 
            events={filteredEvents}
            onEventClick={handleEventClick}
            showMapView={true}
            onToggleView={() => {}}
          />
        ) : (
          <>
            {/* Results */}
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing {filteredEvents.length} events
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <SafeIcon icon={FiSearch} className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No events found</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                  Try adjusting your search criteria or browse all events
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-sm sm:text-base"
                >
                  Show All Events
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;