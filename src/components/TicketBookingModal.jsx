import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiPlus, FiMinus, FiShoppingCart, FiCreditCard, FiCheck, FiArrowRight } = FiIcons;

const TicketBookingModal = ({ 
  isOpen, 
  onClose, 
  event, 
  onProceedToPayment 
}) => {
  const [selectedTickets, setSelectedTickets] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  if (!isOpen || !event) return null;

  const ticketTypes = event.ticketTypes || [
    {
      id: 'general',
      name: 'General Admission',
      description: 'Standard event access',
      price: event.price || 0,
      available: event.maxAttendees - event.currentAttendees,
      benefits: ['Event access', 'Standard seating']
    }
  ];

  const updateTicketQuantity = (ticketId, quantity) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: Math.max(0, quantity)
    }));
  };

  const getTotalQuantity = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return ticketTypes.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.id] || 0;
      return total + (ticket.price * quantity);
    }, 0);
  };

  const getSelectedTicketsDetails = () => {
    return ticketTypes
      .map(ticket => ({
        ...ticket,
        quantity: selectedTickets[ticket.id] || 0
      }))
      .filter(ticket => ticket.quantity > 0);
  };

  const formatPrice = (price, currency = 'USD') => {
    if (price === 0) return 'Free';
    if (currency === 'SLL') {
      return `Le ${price.toLocaleString()}`;
    }
    return `$${price}`;
  };

  const convertToSLL = (usdPrice) => {
    return Math.round(usdPrice * 22000);
  };

  const handleProceedToPayment = () => {
    const selectedTicketsDetails = getSelectedTicketsDetails();
    if (selectedTicketsDetails.length === 0) return;

    const bookingData = {
      event: event,
      tickets: selectedTicketsDetails,
      totalQuantity: getTotalQuantity(),
      totalPrice: getTotalPrice(),
      totalPriceSLL: convertToSLL(getTotalPrice())
    };

    onProceedToPayment(bookingData);
  };

  const canProceed = getTotalQuantity() > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiShoppingCart} className="h-6 w-6 text-primary-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Book Tickets</h3>
              <p className="text-sm text-gray-600">{event.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {!showSummary ? (
            /* Ticket Selection */
            <div className="p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Select Tickets</h4>
              <div className="space-y-4">
                {ticketTypes.map((ticket) => (
                  <TicketSelectionCard
                    key={ticket.id}
                    ticket={ticket}
                    quantity={selectedTickets[ticket.id] || 0}
                    onUpdateQuantity={(qty) => updateTicketQuantity(ticket.id, qty)}
                  />
                ))}
              </div>

              {/* Summary Bar */}
              {getTotalQuantity() > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">
                      {getTotalQuantity()} ticket{getTotalQuantity() !== 1 ? 's' : ''} selected
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-xl text-gray-800">
                        {formatPrice(getTotalPrice())}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(convertToSLL(getTotalPrice()), 'SLL')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected tickets breakdown */}
                  <div className="space-y-1">
                    {getSelectedTicketsDetails().map((ticket) => (
                      <div key={ticket.id} className="flex justify-between text-sm">
                        <span>{ticket.quantity}x {ticket.name}</span>
                        <span>{formatPrice(ticket.price * ticket.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Order Summary */
            <div className="p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Order Summary</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-gray-800 mb-3">{event.title}</h5>
                <div className="space-y-2">
                  {getSelectedTicketsDetails().map((ticket) => (
                    <div key={ticket.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{ticket.name}</div>
                        <div className="text-sm text-gray-600">Qty: {ticket.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatPrice(ticket.price * ticket.quantity)}</div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(convertToSLL(ticket.price * ticket.quantity), 'SLL')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <div className="text-right">
                      <div className="font-bold text-xl text-gray-800">
                        {formatPrice(getTotalPrice())}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(convertToSLL(getTotalPrice()), 'SLL')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            {!showSummary ? (
              <>
                <div className="text-sm text-gray-600">
                  {canProceed ? `${getTotalQuantity()} ticket${getTotalQuantity() !== 1 ? 's' : ''} • ${formatPrice(getTotalPrice())}` : 'Select tickets to continue'}
                </div>
                <button
                  onClick={() => setShowSummary(true)}
                  disabled={!canProceed}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowSummary(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiCreditCard} className="h-4 w-4" />
                  <span>Choose Payment Method</span>
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TicketSelectionCard = ({ ticket, quantity, onUpdateQuantity }) => {
  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const formatPriceSLL = (price) => {
    return price === 0 ? 'Free' : `Le ${(price * 22000).toLocaleString()}`;
  };

  const isAvailable = ticket.available > 0;
  const maxQuantity = Math.min(ticket.available, 10); // Limit to 10 per transaction

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-4 ${quantity > 0 ? 'border-primary-500 bg-primary-50' : 'border-gray-200'} ${!isAvailable ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h5 className="font-semibold text-gray-800">{ticket.name}</h5>
            {ticket.isLimited && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                Limited
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{ticket.description}</p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div>
              <div className="font-bold text-lg text-gray-800">{formatPrice(ticket.price)}</div>
              <div className="text-sm text-gray-600">{formatPriceSLL(ticket.price)}</div>
            </div>
            <div className="text-sm text-gray-600">
              {ticket.available} available
            </div>
          </div>

          {ticket.benefits && ticket.benefits.length > 0 && (
            <div>
              <h6 className="font-medium text-gray-700 text-sm mb-1">Includes:</h6>
              <ul className="text-xs text-gray-600 space-y-1">
                {ticket.benefits.slice(0, 3).map((benefit, idx) => (
                  <li key={idx} className="flex items-center space-x-1">
                    <SafeIcon icon={FiCheck} className="h-3 w-3 text-green-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
                {ticket.benefits.length > 3 && (
                  <li className="text-gray-500">+{ticket.benefits.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex flex-col items-end space-y-2 ml-4">
          {isAvailable ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(quantity - 1)}
                disabled={quantity === 0}
                className="p-1 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SafeIcon icon={FiMinus} className="h-4 w-4" />
              </button>
              
              <div className="w-12 text-center font-semibold">{quantity}</div>
              
              <button
                onClick={() => onUpdateQuantity(quantity + 1)}
                disabled={quantity >= maxQuantity}
                className="p-1 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="text-sm text-red-600 font-medium">Sold Out</div>
          )}
          
          {quantity > 0 && (
            <div className="text-sm text-primary-600 font-medium">
              Subtotal: {formatPrice(ticket.price * quantity)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TicketBookingModal;