import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import CommentSystem from '../components/CommentSystem';
import EventCard from '../components/EventCard';
import EventMediaGallery from '../components/EventMediaGallery';
import TicketBookingModal from '../components/TicketBookingModal';
import PaymentCheckoutModal from '../components/PaymentCheckoutModal';

const { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiMonitor, FiShare2, FiHeart, FiArrowLeft, FiUser, FiBookmark, FiCheck, FiArrowRight, FiTrendingUp, FiCreditCard, FiTicket } = FiIcons;

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getEventById,
    attendEvent,
    unattendEvent,
    saveEvent,
    unsaveEvent,
    isEventSaved,
    addComment,
    replyToComment,
    reactToComment,
    editComment,
    deleteComment,
    reportComment,
    events
  } = useEvents();
  const { user } = useAuth();
  const [isAttending, setIsAttending] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [saveAnimation, setSaveAnimation] = useState(false);

  const event = getEventById(id);
  const isSaved = isEventSaved(id);

  // Currency conversion function
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const rates = { 'USD_TO_SLL': 22000, 'SLL_TO_USD': 0.000045 };
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === 'USD' && toCurrency === 'SLL') {
      return Math.round(amount * rates.USD_TO_SLL);
    }
    if (fromCurrency === 'SLL' && toCurrency === 'USD') {
      return (amount * rates.SLL_TO_USD).toFixed(2);
    }
    return amount;
  };

  const formatPrice = (price, currency) => {
    if (price === 0) return 'Free';
    if (currency === 'SLL') {
      return `Le ${price.toLocaleString()}`;
    }
    return `$${price}`;
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-sm sm:text-base"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const handleBookTickets = () => {
    if (!user) {
      alert('Please sign in to book tickets');
      return;
    }
    setShowTicketModal(true);
  };

  const handleProceedToPayment = (selectedBookingData) => {
    setBookingData(selectedBookingData);
    setShowTicketModal(false);
    setShowCheckoutModal(true);
  };

  const handlePaymentComplete = (confirmation) => {
    console.log('Booking confirmed:', confirmation);
    // Here you would typically update the event attendance
    // and send confirmation email
    alert(`Booking confirmed! Confirmation ID: ${confirmation.bookingId}`);
    setShowCheckoutModal(false);
    setBookingData(null);
  };

  const handleSaveEvent = () => {
    if (!user) {
      alert('Please sign in to save events');
      return;
    }

    setSaveAnimation(true);
    setTimeout(() => setSaveAnimation(false), 600);

    if (isSaved) {
      unsaveEvent(event.id);
    } else {
      saveEvent(event.id);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

  const isEventFull = event.currentAttendees >= event.maxAttendees;
  const attendancePercentage = (event.currentAttendees / event.maxAttendees) * 100;

  // Get ticket types or create default
  const ticketTypes = event.ticketTypes || [{
    id: 'general',
    name: 'General Admission',
    description: 'Standard event access',
    price: event.price || 0,
    available: event.maxAttendees - event.currentAttendees,
    benefits: ['Event access']
  }];

  // Get price range
  const minPrice = Math.min(...ticketTypes.map(t => t.price));
  const maxPrice = Math.max(...ticketTypes.map(t => t.price));
  const priceDisplay = minPrice === maxPrice 
    ? (minPrice === 0 ? 'Free' : formatPrice(minPrice, 'USD'))
    : minPrice === 0 
      ? `Free - ${formatPrice(maxPrice, 'USD')}`
      : `${formatPrice(minPrice, 'USD')} - ${formatPrice(maxPrice, 'USD')}`;

  // Comment handlers
  const handleAddComment = (comment) => {
    addComment(event.id, comment);
  };

  const handleReplyComment = (commentId, reply) => {
    replyToComment(event.id, commentId, reply);
  };

  const handleReactToComment = (commentId, reactionId, userId, isReply = false, parentId = null) => {
    reactToComment(event.id, commentId, reactionId, userId, isReply, parentId);
  };

  const handleEditComment = (commentId, newContent) => {
    editComment(event.id, commentId, newContent);
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(event.id, commentId);
  };

  const handleReportComment = (commentId) => {
    reportComment(event.id, commentId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-opacity-30 transition-all duration-200"
          >
            <SafeIcon icon={FiArrowLeft} className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Save Button in Hero */}
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8">
          <motion.button
            onClick={handleSaveEvent}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={saveAnimation ? { scale: [1, 1.2, 1] } : {}}
            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isSaved
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
            title={isSaved ? 'Remove from saved events' : 'Save this event'}
          >
            <SafeIcon icon={isSaved ? FiCheck : FiBookmark} className={`h-5 w-5 sm:h-6 sm:w-6 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                  {event.category}
                </span>
                {event.isVirtual && (
                  <span className="bg-secondary-500 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center">
                    <SafeIcon icon={FiMonitor} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Virtual Event
                  </span>
                )}
                {event.acceptsLocalCurrency && (
                  <span className="bg-green-500 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                    🇸🇱 Local Payment
                  </span>
                )}
                {isSaved && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-pink-500 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center"
                  >
                    <SafeIcon icon={FiHeart} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Saved Event
                  </motion.span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 line-clamp-2">
                {event.title}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-3xl line-clamp-3">
                {event.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Event Details */}
          <div className="lg:col-span-2">
            {/* Media Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Event Gallery</h2>
              <EventMediaGallery 
                media={event.media || []} 
                primaryImage={event.imageUrl}
              />
            </motion.div>

            {/* Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Event Details</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-primary-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <SafeIcon icon={FiCalendar} className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Date & Time</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {formatDate(event.startDate)} at {formatTime(event.startDate)}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Ends: {formatDate(event.endDate)} at {formatTime(event.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-primary-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <SafeIcon icon={event.isVirtual ? FiMonitor : FiMapPin} className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                      {event.isVirtual ? 'Virtual Location' : 'Location'}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {event.isVirtual ? 'Online Event' : event.location}
                    </p>
                    {event.isVirtual && event.virtualLink && (
                      <a
                        href={event.virtualLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Join Virtual Event
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-primary-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <SafeIcon icon={FiUsers} className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Attendees</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {event.currentAttendees} / {event.maxAttendees} registered
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${attendancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ticket Types Section */}
            {ticketTypes.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Available Tickets</h2>
                <div className="space-y-4">
                  {ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{ticket.name}</h4>
                          <p className="text-gray-600 text-sm">{ticket.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-800">
                            {formatPrice(ticket.price, 'USD')}
                          </div>
                          {ticket.price > 0 && (
                            <div className="text-sm text-gray-600">
                              {formatPrice(convertCurrency(ticket.price, 'USD', 'SLL'), 'SLL')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {ticket.benefits && ticket.benefits.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-gray-700 text-sm mb-1">Includes:</h5>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {ticket.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-center space-x-1">
                                <SafeIcon icon={FiCheck} className="h-3 w-3 text-green-500" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-3 text-sm text-gray-500">
                        {ticket.available} tickets available
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Organizer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Organizer</h2>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-full">
                  <SafeIcon icon={FiUser} className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{event.organizerName}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Event Organizer</p>
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CommentSystem
                eventId={event.id}
                comments={event.comments || []}
                onAddComment={handleAddComment}
                onReplyComment={handleReplyComment}
                onReactToComment={handleReactToComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                onReportComment={handleReportComment}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 sticky top-8"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {priceDisplay}
                </div>
                {minPrice > 0 && (
                  <div className="text-sm text-gray-600">
                    ≈ {formatPrice(convertCurrency(minPrice, 'USD', 'SLL'), 'SLL')}
                    {maxPrice !== minPrice && ` - ${formatPrice(convertCurrency(maxPrice, 'USD', 'SLL'), 'SLL')}`}
                  </div>
                )}
                <p className="text-gray-500 text-sm">per person</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={handleBookTickets}
                  disabled={isEventFull}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base flex items-center justify-center space-x-2 ${
                    isEventFull
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600'
                  }`}
                >
                  <SafeIcon icon={FiTicket} className="h-4 w-4" />
                  <span>{isEventFull ? 'Event Full' : 'Book Now'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={shareEvent}
                    className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                  >
                    <SafeIcon icon={FiShare2} className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Share</span>
                  </button>
                  <motion.button
                    onClick={handleSaveEvent}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center space-x-2 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                      isSaved
                        ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <SafeIcon icon={isSaved ? FiCheck : FiBookmark} className={`h-3 w-3 sm:h-4 sm:w-4 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Save Status Message */}
              {isSaved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2 text-green-700">
                    <SafeIcon icon={FiHeart} className="h-4 w-4" />
                    <span className="text-sm font-medium">Event saved!</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Find this event in your <a href="/#/saved" className="underline">saved events</a>
                  </p>
                </motion.div>
              )}

              {/* Event Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Ticket Booking Modal */}
      <TicketBookingModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        event={event}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Payment Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => {
          setShowCheckoutModal(false);
          setBookingData(null);
        }}
        bookingData={bookingData}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Event</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm sm:text-base"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;