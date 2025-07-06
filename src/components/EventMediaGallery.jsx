import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiImage, FiVideo, FiPlay, FiX, FiChevronLeft, FiChevronRight, FiMaximize2 } = FiIcons;

const EventMediaGallery = ({ media = [], primaryImage }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Combine primary image with media array
  const allMedia = [];
  
  if (primaryImage && !media.find(item => item.url === primaryImage)) {
    allMedia.push({
      id: 'primary',
      url: primaryImage,
      type: 'image',
      isPrimary: true
    });
  }
  
  allMedia.push(...media);

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  const openLightbox = (index) => {
    setSelectedIndex(index);
    setShowLightbox(true);
  };

  const nextMedia = () => {
    setSelectedIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevMedia = () => {
    setSelectedIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  if (allMedia.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <SafeIcon icon={FiImage} className="h-16 w-16 text-gray-300" />
      </div>
    );
  }

  const currentMedia = allMedia[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Media Display */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
        {currentMedia.type === 'video' ? (
          <video
            src={currentMedia.url}
            className="w-full h-full object-cover"
            controls
            poster={currentMedia.thumbnail}
          />
        ) : (
          <img
            src={currentMedia.url}
            alt="Event media"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openLightbox(selectedIndex)}
          />
        )}

        {/* Expand button for images */}
        {currentMedia.type === 'image' && (
          <button
            onClick={() => openLightbox(selectedIndex)}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <SafeIcon icon={FiMaximize2} className="h-4 w-4" />
          </button>
        )}

        {/* Navigation arrows for multiple media */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <SafeIcon icon={FiChevronLeft} className="h-5 w-5" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <SafeIcon icon={FiChevronRight} className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Media counter */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {allMedia.length}
          </div>
        )}

        {/* Media type indicator */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
          <SafeIcon icon={currentMedia.type === 'video' ? FiVideo : FiImage} className="h-3 w-3" />
          <span className="capitalize">{currentMedia.type}</span>
        </div>
      </div>

      {/* Thumbnail Grid */}
      {allMedia.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {allMedia.map((item, index) => (
            <button
              key={item.id || index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {item.type === 'video' ? (
                <div className="relative w-full h-full">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <SafeIcon icon={FiVideo} className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <SafeIcon icon={FiPlay} className="h-4 w-4 text-white drop-shadow-lg" />
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Primary indicator */}
              {item.isPrimary && (
                <div className="absolute top-1 left-1 bg-green-500 text-white px-1 py-0.5 rounded text-xs font-medium">
                  Main
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative max-w-7xl max-h-full"
            >
              {/* Close button */}
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              >
                <SafeIcon icon={FiX} className="h-8 w-8" />
              </button>

              {/* Navigation */}
              {allMedia.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                  >
                    <SafeIcon icon={FiChevronLeft} className="h-8 w-8" />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                  >
                    <SafeIcon icon={FiChevronRight} className="h-8 w-8" />
                  </button>
                </>
              )}

              {/* Media content */}
              {currentMedia.type === 'video' ? (
                <video
                  src={currentMedia.url}
                  className="max-w-full max-h-full rounded-lg"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={currentMedia.url}
                  alt="Event media"
                  className="max-w-full max-h-full rounded-lg"
                />
              )}

              {/* Counter */}
              {allMedia.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                  {selectedIndex + 1} of {allMedia.length}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventMediaGallery;