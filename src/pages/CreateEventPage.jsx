import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

const { FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiImage, FiMonitor, FiSave } = FiIcons;

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    startDate: '',
    endDate: '',
    price: 0,
    maxAttendees: 50,
    imageUrl: '',
    isVirtual: false,
    virtualLink: '',
    tags: '',
  });
  const [errors, setErrors] = useState({});

  const categories = ['Technology', 'Business', 'Arts', 'Sports', 'Music', 'Food', 'Education', 'Health'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.location.trim() && !formData.isVirtual) {
      newErrors.location = 'Location is required for physical events';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    if (formData.maxAttendees < 1) {
      newErrors.maxAttendees = 'Maximum attendees must be at least 1';
    }

    if (formData.isVirtual && !formData.virtualLink.trim()) {
      newErrors.virtualLink = 'Virtual link is required for virtual events';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const eventData = {
        ...formData,
        organizerId: user.id,
        organizerName: user.name,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        imageUrl: formData.imageUrl || `https://picsum.photos/400/300?random=${Date.now()}`,
      };

      const newEvent = createEvent(eventData);
      navigate(`/event/${newEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to create an event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Event</h1>
            <p className="text-gray-600">Share your event with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your event..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Category and Virtual Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isVirtual"
                  checked={formData.isVirtual}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  This is a virtual event
                </label>
              </div>
            </div>

            {/* Location/Virtual Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.isVirtual ? 'Virtual Link *' : 'Location *'}
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={formData.isVirtual ? FiMonitor : FiMapPin} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                />
                <input
                  type={formData.isVirtual ? 'url' : 'text'}
                  name={formData.isVirtual ? 'virtualLink' : 'location'}
                  value={formData.isVirtual ? formData.virtualLink : formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.location || errors.virtualLink ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={formData.isVirtual ? 'https://zoom.us/j/...' : 'Enter event location'}
                />
              </div>
              {(errors.location || errors.virtualLink) && (
                <p className="mt-1 text-sm text-red-600">{errors.location || errors.virtualLink}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Price and Attendees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <div className="relative">
                  <SafeIcon icon={FiDollarSign} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Attendees
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUsers} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.maxAttendees ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="50"
                  />
                </div>
                {errors.maxAttendees && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxAttendees}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image URL (optional)
              </label>
              <div className="relative">
                <SafeIcon icon={FiImage} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="networking, workshop, beginner-friendly"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Event...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiSave} className="h-5 w-5" />
                    <span>Create Event</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEventPage;