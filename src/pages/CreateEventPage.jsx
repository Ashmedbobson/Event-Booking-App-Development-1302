import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import MediaUpload from '../components/MediaUpload';
import PaymentSelector from '../components/PaymentSelector';
import TicketTypeSelector from '../components/TicketTypeSelector';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

const { FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiImage, FiMonitor, FiSave, FiUserPlus, FiTicket } = FiIcons;

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    startDate: '',
    endDate: '',
    price: 0,
    currency: 'USD',
    maxAttendees: 50,
    imageUrl: '',
    isVirtual: false,
    virtualLink: '',
    tags: '',
  });
  
  const [eventMedia, setEventMedia] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState(['usd_cash']);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [errors, setErrors] = useState({});

  const categories = [
    'Technology', 'Business', 'Arts', 'Sports', 
    'Music', 'Food', 'Education', 'Health'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMediaChange = (media) => {
    setEventMedia(media);
    // Clear image URL error if media is added
    if (media.length > 0 && errors.media) {
      setErrors(prev => ({ ...prev, media: '' }));
    }
  };

  const handlePaymentMethodsChange = (methods) => {
    setSelectedPaymentMethods(methods);
    if (methods.length > 0 && errors.paymentMethods) {
      setErrors(prev => ({ ...prev, paymentMethods: '' }));
    }
  };

  const handleTicketTypesChange = (types) => {
    setTicketTypes(types);
    if (types.length > 0 && errors.ticketTypes) {
      setErrors(prev => ({ ...prev, ticketTypes: '' }));
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

    if (formData.maxAttendees < 1) {
      newErrors.maxAttendees = 'Maximum attendees must be at least 1';
    }

    if (formData.isVirtual && !formData.virtualLink.trim()) {
      newErrors.virtualLink = 'Virtual link is required for virtual events';
    }

    // Validate media
    if (eventMedia.length === 0 && !formData.imageUrl) {
      newErrors.media = 'Please add at least one image or provide an image URL';
    }

    // Validate ticket types for paid events
    if (formData.price > 0 || ticketTypes.some(t => t.price > 0)) {
      if (selectedPaymentMethods.length === 0) {
        newErrors.paymentMethods = 'Please select at least one payment method for paid events';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Process media files
      const processedMedia = eventMedia.map((item, index) => ({
        id: item.id,
        url: item.url, // In a real app, you'd upload to a cloud service
        type: item.type,
        name: item.name,
        isPrimary: index === 0,
        order: index
      }));

      // If no custom ticket types, create default one
      const finalTicketTypes = ticketTypes.length > 0 ? ticketTypes : [{
        id: 'general',
        name: 'General Admission',
        description: 'Standard event access',
        price: formData.price,
        quantity: formData.maxAttendees,
        benefits: ['Event access'],
        isLimited: false,
        sold: 0,
        available: formData.maxAttendees
      }];

      const eventData = {
        ...formData,
        organizerId: user.id,
        organizerName: user.name,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        media: processedMedia,
        imageUrl: processedMedia.length > 0 ? processedMedia[0].url : (formData.imageUrl || `https://picsum.photos/400/300?random=${Date.now()}`),
        paymentMethods: selectedPaymentMethods,
        ticketTypes: finalTicketTypes,
        // Add Sierra Leone specific data
        acceptsLocalCurrency: selectedPaymentMethods.some(method => 
          ['orange_money', 'airtel_money', 'afrimoney', 'qmoney', 'sll_cash'].includes(method)
        ),
        acceptsUSD: selectedPaymentMethods.some(method => 
          ['usd_cash', 'cashapp', 'zelle', 'paypal'].includes(method)
        ),
        // Calculate total available tickets
        totalAvailableTickets: finalTicketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0),
        // Set price based on ticket types
        price: finalTicketTypes.length > 0 ? Math.min(...finalTicketTypes.map(t => t.price)) : formData.price
      };

      const newEvent = createEvent(eventData);
      navigate(`/event/${newEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: 'Failed to create event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user && showAuthPrompt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiUserPlus} className="h-10 w-10 text-primary-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Create Account to Host Events</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Join our community of event organizers in Sierra Leone and start creating amazing experiences for others.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8"
        >
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create New Event</h1>
            <p className="text-gray-600 text-sm sm:text-base">Share your event with the Sierra Leone community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base ${
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
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your event..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Media Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Photos & Videos *
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Upload up to 5 images and videos to showcase your event. The first image will be used as the main event photo.
              </p>
              <MediaUpload
                media={eventMedia}
                onMediaChange={handleMediaChange}
                maxFiles={5}
                acceptedTypes="image/*,video/*"
              />
              {errors.media && (
                <p className="mt-2 text-sm text-red-600">{errors.media}</p>
              )}
            </div>

            {/* Fallback Image URL */}
            {eventMedia.length === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or provide an image URL
                </label>
                <div className="relative">
                  <SafeIcon icon={FiImage} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            )}

            {/* Category and Virtual Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base ${
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

              <div className="flex items-center justify-center sm:justify-start">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isVirtual"
                    checked={formData.isVirtual}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">This is a virtual event</span>
                </label>
              </div>
            </div>

            {/* Location/Virtual Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.isVirtual ? 'Virtual Link *' : 'Location *'}
              </label>
              <div className="relative">
                <SafeIcon icon={formData.isVirtual ? FiMonitor : FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type={formData.isVirtual ? 'url' : 'text'}
                  name={formData.isVirtual ? 'virtualLink' : 'location'}
                  value={formData.isVirtual ? formData.virtualLink : formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base ${
                    errors.location || errors.virtualLink ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={formData.isVirtual ? 'https://zoom.us/j/...' : 'Enter event location (e.g., Freetown, Bo, Kenema)'}
                />
              </div>
              {(errors.location || errors.virtualLink) && (
                <p className="mt-1 text-sm text-red-600">{errors.location || errors.virtualLink}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base ${
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
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Maximum Attendees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Attendees
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUsers} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base ${
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

            {/* Ticket Types Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiTicket} className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-800">Ticket Configuration</h3>
              </div>
              <TicketTypeSelector
                ticketTypes={ticketTypes}
                onTicketTypesChange={handleTicketTypesChange}
                eventPrice={formData.price}
              />
              {errors.ticketTypes && (
                <p className="mt-2 text-sm text-red-600">{errors.ticketTypes}</p>
              )}
            </div>

            {/* Payment Methods Section */}
            {(formData.price > 0 || ticketTypes.some(t => t.price > 0)) && (
              <div>
                <PaymentSelector
                  selectedMethods={selectedPaymentMethods}
                  onMethodsChange={handlePaymentMethodsChange}
                  eventPrice={Math.max(formData.price, ...ticketTypes.map(t => t.price || 0))}
                  currency={formData.currency}
                />
                {errors.paymentMethods && (
                  <p className="mt-2 text-sm text-red-600">{errors.paymentMethods}</p>
                )}
              </div>
            )}

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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                placeholder="freetown, networking, sierra leone, workshop"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add relevant tags to help people find your event
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Event...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiSave} className="h-4 w-4 sm:h-5 sm:w-5" />
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