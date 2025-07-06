import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

const { FiBookmark, FiCheck, FiHeart } = FiIcons;

const SaveEventButton = ({ 
  eventId, 
  size = 'medium', 
  variant = 'floating', 
  className = '',
  showText = true,
  onSaveSuccess,
  onSaveError 
}) => {
  const { saveEvent, unsaveEvent, isEventSaved } = useEvents();
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isSaved = isEventSaved(eventId);

  const handleSaveToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      if (onSaveError) {
        onSaveError('Please sign in to save events');
      } else {
        alert('Please sign in to save events');
      }
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      if (isSaved) {
        unsaveEvent(eventId);
        if (onSaveSuccess) {
          onSaveSuccess('Event removed from saved events', 'unsaved');
        }
      } else {
        saveEvent(eventId);
        if (onSaveSuccess) {
          onSaveSuccess('Event saved successfully!', 'saved');
        }
      }
    } catch (error) {
      if (onSaveError) {
        onSaveError('Failed to save event. Please try again.');
      }
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-2 h-8 w-8';
      case 'large':
        return 'p-4 h-12 w-12';
      case 'medium':
      default:
        return 'p-3 h-10 w-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'h-3 w-3';
      case 'large':
        return 'h-6 w-6';
      case 'medium':
      default:
        return 'h-4 w-4';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'transition-all duration-300 rounded-full';
    
    switch (variant) {
      case 'outline':
        return `${baseClasses} border-2 ${
          isSaved 
            ? 'border-primary-500 bg-primary-500 text-white shadow-lg' 
            : 'border-gray-300 bg-white text-gray-600 hover:border-primary-500 hover:text-primary-500'
        }`;
      case 'solid':
        return `${baseClasses} ${
          isSaved
            ? 'bg-primary-500 text-white shadow-lg hover:bg-primary-600'
            : 'bg-gray-200 text-gray-600 hover:bg-primary-500 hover:text-white'
        }`;
      case 'floating':
      default:
        return `${baseClasses} ${
          isSaved 
            ? 'bg-primary-500 text-white shadow-lg transform scale-110' 
            : 'bg-white bg-opacity-90 text-gray-600 hover:bg-primary-50 hover:text-primary-500 shadow-md hover:shadow-lg'
        }`;
    }
  };

  if (variant === 'text') {
    return (
      <motion.button
        onClick={handleSaveToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isSaved
            ? 'bg-primary-500 text-white hover:bg-primary-600'
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        } ${className}`}
      >
        <SafeIcon 
          icon={isSaved ? FiCheck : FiBookmark} 
          className={`${getIconSize()} ${isSaved ? 'fill-current' : ''}`} 
        />
        {showText && <span>{isSaved ? 'Saved' : 'Save'}</span>}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleSaveToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
      className={`${getSizeClasses()} ${getVariantClasses()} ${className}`}
      title={isSaved ? 'Remove from saved events' : 'Save this event'}
    >
      <SafeIcon 
        icon={isSaved ? FiCheck : FiBookmark} 
        className={`${getIconSize()} ${isSaved ? 'fill-current' : ''}`} 
      />
    </motion.button>
  );
};

export default SaveEventButton;