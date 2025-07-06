import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PaymentInstructionsModal from './PaymentInstructionsModal';

const {FiX, FiArrowLeft, FiCreditCard, FiCheck, FiUser, FiMail, FiPhone, FiShield} = FiIcons;

const PaymentCheckoutModal = ({isOpen, onClose, bookingData, onPaymentComplete}) => {
  const [currentStep, setCurrentStep] = useState('details'); // 'details', 'payment', 'instructions'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [showInstructions, setShowInstructions] = useState(false);

  if (!isOpen || !bookingData) return null;

  const {event, tickets, totalQuantity, totalPrice, totalPriceSLL} = bookingData;

  const paymentMethods = [
    {id: 'orange_money', name: 'Orange Money', icon: '🍊', currency: 'SLL', popular: true},
    {id: 'airtel_money', name: 'Airtel Money', icon: '📱', currency: 'SLL', popular: true},
    {id: 'usd_cash', name: 'US Dollar (Cash)', icon: '💵', currency: 'USD', popular: false},
    {id: 'sll_cash', name: 'Sierra Leone Leone (Cash)', icon: '🏧', currency: 'SLL', popular: false},
    {id: 'cashapp', name: 'Cash App', icon: '💸', currency: 'USD', popular: false},
    {id: 'zelle', name: 'Zelle', icon: '⚡', currency: 'USD', popular: false},
    {id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', currency: 'Both', popular: false},
    {id: 'paypal', name: 'PayPal', icon: '🌐', currency: 'USD', popular: false}
  ];

  const availablePaymentMethods = event.paymentMethods 
    ? paymentMethods.filter(method => event.paymentMethods.includes(method.id))
    : paymentMethods;

  const validateCustomerDetails = () => {
    const newErrors = {};
    
    if (!customerDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateCustomerDetails()) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    const amount = method.currency === 'SLL' ? totalPriceSLL : 
                   method.currency === 'USD' ? totalPrice : totalPrice;
    
    const paymentData = {
      method: method,
      amount: amount,
      currency: method.currency
    };

    if (totalPrice === 0) {
      // Free event - process immediately
      handleCompleteBooking(paymentData);
    } else {
      // Paid event - show payment instructions
      setSelectedPaymentMethod(paymentData);
      setShowInstructions(true);
    }
  };

  const handleCompleteBooking = (paymentData) => {
    const bookingConfirmation = {
      bookingId: `BK-${Date.now()}`,
      event: event,
      customer: customerDetails,
      tickets: tickets,
      totalQuantity: totalQuantity,
      totalPrice: totalPrice,
      totalPriceSLL: totalPriceSLL,
      paymentMethod: paymentData,
      bookingDate: new Date().toISOString(),
      status: totalPrice === 0 ? 'confirmed' : 'pending_payment'
    };

    onPaymentComplete(bookingConfirmation);
    onClose();
  };

  const formatPrice = (price, currency = 'USD') => {
    if (price === 0) return 'Free';
    if (currency === 'SLL') {
      return `Le ${price.toLocaleString()}`;
    }
    return `$${price}`;
  };

  const handleInputChange = (field, value) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const steps = [
    {id: 'details', title: 'Customer Details', icon: FiUser},
    {id: 'payment', title: 'Payment Method', icon: FiCreditCard}
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{opacity: 0, scale: 0.9}}
          animate={{opacity: 1, scale: 1}}
          exit={{opacity: 0, scale: 0.9}}
          className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {currentStep === 'payment' && (
                <button
                  onClick={() => setCurrentStep('details')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiArrowLeft} className="h-5 w-5 text-gray-600" />
                </button>
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Complete Booking</h3>
                <p className="text-sm text-gray-600">{totalQuantity} ticket{totalQuantity !== 1 ? 's' : ''} • {formatPrice(totalPrice)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    currentStep === step.id 
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : index < steps.findIndex(s => s.id === currentStep)
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    <SafeIcon icon={step.icon} className="h-4 w-4" />
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-primary-600' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-300px)]">
            {currentStep === 'details' && (
              <div className="p-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">{event.title}</h4>
                  <div className="space-y-2">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="flex justify-between text-sm">
                        <span>{ticket.quantity}x {ticket.name}</span>
                        <span>{formatPrice(ticket.price * ticket.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <div className="text-right">
                          <div>{formatPrice(totalPrice)}</div>
                          {totalPrice > 0 && (
                            <div className="text-xs text-gray-600">{formatPrice(totalPriceSLL, 'SLL')}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Your Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={customerDetails.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={customerDetails.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+232 XX XXX XXXX"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      value={customerDetails.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Any special requests or dietary requirements..."
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <SafeIcon icon={FiShield} className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Your information is secure</p>
                        <p>We use your contact details only for event communication and ticket delivery.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Choose Payment Method</h4>
                
                {totalPrice === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-600" />
                    </div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-2">Free Event!</h5>
                    <p className="text-gray-600 mb-6">Click confirm to complete your booking</p>
                    <button
                      onClick={() => handleCompleteBooking({
                        method: {name: 'Free Booking'},
                        amount: 0,
                        currency: 'USD'
                      })}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Confirm Booking
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availablePaymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentMethodSelect(method)}
                        className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <h5 className="font-medium text-gray-800">{method.name}</h5>
                              <p className="text-sm text-gray-600">
                                {method.currency === 'SLL' 
                                  ? formatPrice(totalPriceSLL, 'SLL')
                                  : method.currency === 'USD' 
                                    ? formatPrice(totalPrice, 'USD')
                                    : `${formatPrice(totalPrice, 'USD')} or ${formatPrice(totalPriceSLL, 'SLL')}`
                                }
                              </p>
                            </div>
                          </div>
                          {method.popular && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {currentStep === 'details' && (
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={handleContinueToPayment}
                className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Continue to Payment
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Payment Instructions Modal */}
      {showInstructions && selectedPaymentMethod && (
        <PaymentInstructionsModal
          isOpen={showInstructions}
          onClose={() => {
            setShowInstructions(false);
            handleCompleteBooking(selectedPaymentMethod);
          }}
          paymentMethod={selectedPaymentMethod}
          eventDetails={{
            title: event.title,
            date: new Date(event.startDate).toLocaleDateString(),
            location: event.location
          }}
          organizerInfo={{
            name: event.organizerName,
            contact: '+232 76 123 456'
          }}
        />
      )}
    </>
  );
};

export default PaymentCheckoutModal;