import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const { FiBookmark, FiCalendar, FiMapPin, FiFilter, FiGrid, FiList, FiTrash2, FiShare2, FiSearch, FiHeart } = FiIcons;

const SavedEventsPage = () => {
  const { user } = useAuth();
  const { savedEvents, unsaveEvent, clearAllSavedEvents } = useEvents();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'eventDate', 'title'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'upcoming', 'past'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <SafeIcon icon={FiBookmark} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600 text-sm sm:text-base">You need to be signed in to view your saved events.</p>
        </div>
      </div>
    );
  }

  const filterEvents = () => {
    let filtered = savedEvents;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    if (filterBy === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.startDate) >= now);
    } else if (filterBy === 'past') {
      filtered = filtered.filter(event => new Date(event.startDate) < now);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'eventDate':
          return new Date(a.startDate) - new Date(b.startDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dateAdded':
        default:
          return new Date(b.savedAt) - new Date(a.savedAt);
      }
    });

    return filtered;
  };

  const filteredEvents = filterEvents();

  const handleSelectEvent = (eventId) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  const handleBulkUnsave = () => {
    selectedEvents.forEach(eventId => unsaveEvent(eventId));
    setSelectedEvents([]);
    setShowBulkActions(false);
  };

  const handleShare = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: `${window.location.origin}/#/event/${event.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/#/event/${event.id}`);
      // Show toast notification in real app
    }
  };

  const getUpcomingCount = () => {
    const now = new Date();
    return savedEvents.filter(event => new Date(event.startDate) >= now).length;
  };

  const getPastCount = () => {
    const now = new Date();
    return savedEvents.filter(event => new Date(event.startDate) < now).length;
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <SafeIcon icon={FiBookmark} className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Saved Events</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {savedEvents.length} saved event{savedEvents.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{savedEvents.length}</div>
              <div className="text-sm text-gray-600">Total Saved</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getUpcomingCount()}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-500">{getPastCount()}</div>
              <div className="text-sm text-gray-600">Past</div>
            </div>
          </div>
        </div>

        {savedEvents.length > 0 ? (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
              {/* Enhanced Search Bar */}
              <div className="relative mb-4">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear search"
                  >
                    <SafeIcon icon={FiIcons.FiX} className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  {/* Filter Buttons */}
                  <div className="flex gap-1">
                    {[
                      { value: 'all', label: 'All', count: savedEvents.length },
                      { value: 'upcoming', label: 'Upcoming', count: getUpcomingCount() },
                      { value: 'past', label: 'Past', count: getPastCount() }
                    ].map(filter => (
                      <button
                        key={filter.value}
                        onClick={() => setFilterBy(filter.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filterBy === filter.value
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter.label} ({filter.count})
                      </button>
                    ))}
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="dateAdded">Date Added</option>
                    <option value="eventDate">Event Date</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                    >
                      <SafeIcon icon={FiGrid} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                      }`}
                    >
                      <SafeIcon icon={FiList} className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Bulk Actions */}
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>

              {/* Search Results Info */}
              {searchQuery && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiSearch} className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </span>
                    {filteredEvents.length === 0 && (
                      <button
                        onClick={handleClearSearch}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Bulk Actions Bar */}
              <AnimatePresence>
                {showBulkActions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handleSelectAll}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          {selectedEvents.length === filteredEvents.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <span className="text-sm text-gray-600">
                          {selectedEvents.length} selected
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleBulkUnsave}
                          disabled={selectedEvents.length === 0}
                          className="flex items-center space-x-2 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          <span>Remove Selected</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowBulkActions(false);
                            setSelectedEvents([]);
                          }}
                          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Events Display */}
            {filteredEvents.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => (
                    <SavedEventCard
                      key={event.id}
                      event={event}
                      index={index}
                      isSelected={selectedEvents.includes(event.id)}
                      showSelection={showBulkActions}
                      onSelect={handleSelectEvent}
                      onUnsave={unsaveEvent}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event, index) => (
                    <SavedEventListItem
                      key={event.id}
                      event={event}
                      index={index}
                      isSelected={selectedEvents.includes(event.id)}
                      showSelection={showBulkActions}
                      onSelect={handleSelectEvent}
                      onUnsave={unsaveEvent}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <SafeIcon icon={FiSearch} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No events found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Clear All Button */}
            {savedEvents.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove all saved events?')) {
                      clearAllSavedEvents();
                    }
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear All Saved Events
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

const SavedEventCard = ({ event, index, isSelected, showSelection, onSelect, onUnsave, onShare }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      {showSelection && (
        <div className="p-3 border-b border-gray-100">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(event.id)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Select</span>
          </label>
        </div>
      )}

      <div className="relative">
        <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3">
          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            Saved {format(new Date(event.savedAt), 'MMM dd')}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <SafeIcon icon={FiCalendar} className="h-4 w-4 mr-2 text-primary-500" />
            <span>{format(new Date(event.startDate), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <SafeIcon icon={FiMapPin} className="h-4 w-4 mr-2 text-primary-500" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-800">
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onShare(event)}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              title="Share Event"
            >
              <SafeIcon icon={FiShare2} className="h-4 w-4" />
            </button>
            <button
              onClick={() => onUnsave(event.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Remove from Saved"
            >
              <SafeIcon icon={FiBookmark} className="h-4 w-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SavedEventListItem = ({ event, index, isSelected, showSelection, onSelect, onUnsave, onShare }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {showSelection && (
          <div className="pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(event.id)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        )}
        <img src={event.imageUrl} alt={event.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                {event.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center">
                  <SafeIcon icon={FiCalendar} className="h-4 w-4 mr-1" />
                  <span>{format(new Date(event.startDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiMapPin} className="h-4 w-4 mr-1" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium">
                  {event.category}
                </span>
                <span className="text-sm text-gray-500">
                  Saved {format(new Date(event.savedAt), 'MMM dd')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <div className="text-lg font-bold text-gray-800">
                {event.price === 0 ? 'Free' : `$${event.price}`}
              </div>
              <button
                onClick={() => onShare(event)}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Share Event"
              >
                <SafeIcon icon={FiShare2} className="h-4 w-4" />
              </button>
              <button
                onClick={() => onUnsave(event.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove from Saved"
              >
                <SafeIcon icon={FiBookmark} className="h-4 w-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
      <SafeIcon icon={FiBookmark} className="h-12 w-12 text-gray-400" />
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-4">No Saved Events</h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      Start saving events you're interested in to keep track of them easily. 
      Look for the bookmark icon on any event to save it here.
    </p>
    <div className="space-y-3">
      <a
        href="/#/events"
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
      >
        <SafeIcon icon={FiSearch} className="h-5 w-5" />
        <span>Browse Events</span>
      </a>
    </div>
  </div>
);

export default SavedEventsPage;