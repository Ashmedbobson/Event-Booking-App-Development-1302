import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiMapPin, FiCalendar, FiTag, FiClock } = FiIcons;

const SearchSuggestions = ({ query, onSuggestionClick, onClose }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length > 0) {
      // Mock suggestions - in real app, this would be an API call
      const mockSuggestions = [
        { type: 'event', text: 'Tech Conference 2024', icon: FiCalendar },
        { type: 'category', text: 'Technology Events', icon: FiTag },
        { type: 'location', text: 'New York, NY', icon: FiMapPin },
        { type: 'recent', text: 'Music Festival', icon: FiClock },
        { type: 'trending', text: 'Food & Wine Tasting', icon: FiSearch }
      ].filter(s => s.text.toLowerCase().includes(query.toLowerCase()));

      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50"
      >
        <div className="py-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
            >
              <SafeIcon icon={suggestion.icon} className="h-4 w-4 text-gray-400" />
              <span className="text-gray-800">{suggestion.text}</span>
              <span className="text-xs text-gray-500 ml-auto capitalize">{suggestion.type}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchSuggestions;