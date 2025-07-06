import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMapPin, FiList, FiNavigation, FiZoomIn, FiZoomOut } = FiIcons;

const MapView = ({ events, onEventClick, showMapView, onToggleView }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventMarkerClick = (event) => {
    setSelectedEvent(event);
    onEventClick(event);
  };

  return (
    <div className="relative">
      {/* View Toggle */}
      <div className="flex mb-4">
        <button
          onClick={() => onToggleView('list')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-l-lg border ${
            !showMapView 
              ? 'bg-primary-500 text-white border-primary-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <SafeIcon icon={FiList} className="h-4 w-4" />
          <span>List</span>
        </button>
        <button
          onClick={() => onToggleView('map')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-r-lg border-t border-r border-b ${
            showMapView 
              ? 'bg-primary-500 text-white border-primary-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <SafeIcon icon={FiMapPin} className="h-4 w-4" />
          <span>Map</span>
        </button>
      </div>

      {showMapView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-gray-100 rounded-lg h-96 overflow-hidden"
        >
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 400 300">
                {/* Mock streets */}
                <line x1="0" y1="100" x2="400" y2="100" stroke="#ccc" strokeWidth="2" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="#ccc" strokeWidth="2" />
                <line x1="100" y1="0" x2="100" y2="300" stroke="#ccc" strokeWidth="2" />
                <line x1="200" y1="0" x2="200" y2="300" stroke="#ccc" strokeWidth="2" />
                <line x1="300" y1="0" x2="300" y2="300" stroke="#ccc" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Event Markers */}
          {events.slice(0, 8).map((event, index) => (
            <motion.button
              key={event.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleEventMarkerClick(event)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                selectedEvent?.id === event.id 
                  ? 'bg-secondary-500 scale-125' 
                  : 'bg-primary-500 hover:bg-primary-600'
              } text-white p-2 rounded-full shadow-lg transition-all duration-200`}
              style={{
                left: `${20 + (index % 4) * 20}%`,
                top: `${30 + Math.floor(index / 4) * 30}%`
              }}
            >
              <SafeIcon icon={FiMapPin} className="h-4 w-4" />
            </motion.button>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <SafeIcon icon={FiZoomIn} className="h-4 w-4 text-gray-600" />
            </button>
            <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <SafeIcon icon={FiZoomOut} className="h-4 w-4 text-gray-600" />
            </button>
            <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <SafeIcon icon={FiNavigation} className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Event Info Popup */}
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4"
            >
              <div className="flex space-x-4">
                <img 
                  src={selectedEvent.imageUrl} 
                  alt={selectedEvent.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                  <p className="text-sm font-medium text-primary-600">
                    {selectedEvent.price === 0 ? 'Free' : `$${selectedEvent.price}`}
                  </p>
                </div>
                <button
                  onClick={() => onEventClick(selectedEvent)}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  View
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MapView;