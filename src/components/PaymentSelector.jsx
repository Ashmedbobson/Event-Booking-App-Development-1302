import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDollarSign, FiSmartphone, FiCreditCard, FiGlobe, FiCheck, FiInfo } = FiIcons;

const PaymentSelector = ({ selectedMethods, onMethodsChange, eventPrice, currency = 'USD' }) => {
  const [showInfo, setShowInfo] = useState(null);

  const paymentMethods = [
    {
      id: 'usd_cash',
      name: 'US Dollar (Cash)',
      icon: '💵',
      type: 'cash',
      currency: 'USD',
      description: 'Accept US Dollar cash payments at the event',
      fees: '0%',
      processingTime: 'Instant',
      popular: true
    },
    {
      id: 'sll_cash',
      name: 'Sierra Leone Leone (Cash)',
      icon: '🏧',
      type: 'cash',
      currency: 'SLL',
      description: 'Accept Sierra Leone Leone cash payments at the event',
      fees: '0%',
      processingTime: 'Instant',
      popular: true
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: '🍊',
      type: 'mobile_money',
      currency: 'SLL',
      description: 'Orange Money mobile payments - most popular in Sierra Leone',
      fees: '2.5%',
      processingTime: 'Instant',
      popular: true,
      phoneFormat: '+232 XX XXX XXXX'
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      icon: '📱',
      type: 'mobile_money',
      currency: 'SLL',
      description: 'Airtel Money mobile wallet payments',
      fees: '2.5%',
      processingTime: 'Instant',
      popular: true,
      phoneFormat: '+232 XX XXX XXXX'
    },
    {
      id: 'afrimoney',
      name: 'AfriMoney',
      icon: '💰',
      type: 'mobile_money',
      currency: 'SLL',
      description: 'AfriMoney mobile wallet service',
      fees: '2.5%',
      processingTime: 'Instant',
      popular: false,
      phoneFormat: '+232 XX XXX XXXX'
    },
    {
      id: 'qmoney',
      name: 'QMoney',
      icon: '📲',
      type: 'mobile_money',
      currency: 'SLL',
      description: 'QMoney digital wallet payments',
      fees: '2.5%',
      processingTime: 'Instant',
      popular: false,
      phoneFormat: '+232 XX XXX XXXX'
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      icon: '💸',
      type: 'digital_wallet',
      currency: 'USD',
      description: 'Cash App payments for international attendees',
      fees: '2.9%',
      processingTime: '1-3 business days',
      popular: false,
      phoneFormat: '$cashtag'
    },
    {
      id: 'zelle',
      name: 'Zelle',
      icon: '⚡',
      type: 'bank_transfer',
      currency: 'USD',
      description: 'Zelle quick bank transfers (US banks only)',
      fees: '0%',
      processingTime: 'Instant',
      popular: false,
      phoneFormat: 'Email or Phone'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      type: 'bank_transfer',
      currency: 'Both',
      description: 'Direct bank transfers (local and international)',
      fees: '1-3%',
      processingTime: '1-5 business days',
      popular: false
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🌐',
      type: 'digital_wallet',
      currency: 'USD',
      description: 'PayPal payments for international attendees',
      fees: '3.4% + $0.30',
      processingTime: 'Instant',
      popular: false
    }
  ];

  const handleMethodToggle = (methodId) => {
    const isSelected = selectedMethods.includes(methodId);
    if (isSelected) {
      onMethodsChange(selectedMethods.filter(id => id !== methodId));
    } else {
      onMethodsChange([...selectedMethods, methodId]);
    }
  };

  const getMethodsByType = (type) => {
    return paymentMethods.filter(method => method.type === type);
  };

  const getSelectedMethodsDetails = () => {
    return paymentMethods.filter(method => selectedMethods.includes(method.id));
  };

  const calculateEstimatedFees = () => {
    const selectedDetails = getSelectedMethodsDetails();
    if (selectedDetails.length === 0) return 0;
    
    // Calculate average fees for selected methods
    const totalFees = selectedDetails.reduce((sum, method) => {
      const fee = parseFloat(method.fees.replace('%', '')) || 0;
      return sum + fee;
    }, 0);
    
    return (totalFees / selectedDetails.length).toFixed(1);
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    // Mock exchange rates (in real app, use live rates)
    const rates = {
      'USD_TO_SLL': 22000, // 1 USD = 22,000 SLL (approximate)
      'SLL_TO_USD': 0.000045 // 1 SLL = 0.000045 USD
    };
    
    if (fromCurrency === toCurrency) return amount;
    
    if (fromCurrency === 'USD' && toCurrency === 'SLL') {
      return Math.round(amount * rates.USD_TO_SLL);
    }
    
    if (fromCurrency === 'SLL' && toCurrency === 'USD') {
      return (amount * rates.SLL_TO_USD).toFixed(2);
    }
    
    return amount;
  };

  const formatPrice = (amount, currency) => {
    if (currency === 'SLL') {
      return `Le ${amount.toLocaleString()}`;
    }
    return `$${amount}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Methods</h3>
        <p className="text-sm text-gray-600">
          Select payment methods you'll accept for this event. Choose multiple options to accommodate more attendees.
        </p>
      </div>

      {/* Price Display */}
      {eventPrice > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Event Price</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-lg font-bold text-blue-600">
                {formatPrice(eventPrice, 'USD')}
              </div>
              <div className="text-xs text-gray-600">US Dollars</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-lg font-bold text-blue-600">
                {formatPrice(convertCurrency(eventPrice, 'USD', 'SLL'), 'SLL')}
              </div>
              <div className="text-xs text-gray-600">Sierra Leone Leones</div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Payments */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
          <SafeIcon icon={FiDollarSign} className="h-4 w-4 mr-2" />
          Cash Payments
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {getMethodsByType('cash').map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethods.includes(method.id)}
              onToggle={handleMethodToggle}
              eventPrice={eventPrice}
              onShowInfo={setShowInfo}
            />
          ))}
        </div>
      </div>

      {/* Mobile Money */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
          <SafeIcon icon={FiSmartphone} className="h-4 w-4 mr-2" />
          Mobile Money (Sierra Leone)
          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Most Popular
          </span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {getMethodsByType('mobile_money').map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethods.includes(method.id)}
              onToggle={handleMethodToggle}
              eventPrice={eventPrice}
              onShowInfo={setShowInfo}
            />
          ))}
        </div>
      </div>

      {/* Digital Wallets */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
          <SafeIcon icon={FiCreditCard} className="h-4 w-4 mr-2" />
          Digital Wallets
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {getMethodsByType('digital_wallet').map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethods.includes(method.id)}
              onToggle={handleMethodToggle}
              eventPrice={eventPrice}
              onShowInfo={setShowInfo}
            />
          ))}
        </div>
      </div>

      {/* Bank Transfers */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
          <SafeIcon icon={FiGlobe} className="h-4 w-4 mr-2" />
          Bank Transfers
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {getMethodsByType('bank_transfer').map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethods.includes(method.id)}
              onToggle={handleMethodToggle}
              eventPrice={eventPrice}
              onShowInfo={setShowInfo}
            />
          ))}
        </div>
      </div>

      {/* Selected Methods Summary */}
      {selectedMethods.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">
            Selected Payment Methods ({selectedMethods.length})
          </h4>
          <div className="space-y-2">
            {getSelectedMethodsDetails().map((method) => (
              <div key={method.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <span className="text-lg mr-2">{method.icon}</span>
                  {method.name}
                </span>
                <span className="text-green-600 font-medium">{method.fees} fee</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex justify-between text-sm">
              <span>Average Processing Fee:</span>
              <span className="font-medium">{calculateEstimatedFees()}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{showInfo.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-800">{showInfo.name}</h3>
                </div>
                <button
                  onClick={() => setShowInfo(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiIcons.FiX} className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{showInfo.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Processing Fee:</span>
                    <p className="text-gray-600">{showInfo.fees}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Processing Time:</span>
                    <p className="text-gray-600">{showInfo.processingTime}</p>
                  </div>
                </div>
                
                {showInfo.phoneFormat && (
                  <div>
                    <span className="font-medium text-gray-700 text-sm">Format:</span>
                    <p className="text-gray-600 text-sm">{showInfo.phoneFormat}</p>
                  </div>
                )}
                
                {eventPrice > 0 && (
                  <div className="bg-gray-50 rounded p-3">
                    <span className="font-medium text-gray-700 text-sm">Price in {showInfo.currency}:</span>
                    <p className="text-lg font-bold text-gray-800">
                      {showInfo.currency === 'USD' 
                        ? formatPrice(eventPrice, 'USD')
                        : formatPrice(convertCurrency(eventPrice, 'USD', 'SLL'), 'SLL')
                      }
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowInfo(null)}
                  className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PaymentMethodCard = ({ method, isSelected, onToggle, eventPrice, onShowInfo }) => {
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

  const formatPrice = (amount, currency) => {
    if (currency === 'SLL') {
      return `Le ${amount.toLocaleString()}`;
    }
    return `$${amount}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={() => onToggle(method.id)}
    >
      {/* Popular Badge */}
      {method.popular && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          Popular
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <SafeIcon icon={FiCheck} className="h-5 w-5 text-primary-600" />
        </div>
      )}

      <div className="flex items-start space-x-3">
        <span className="text-2xl">{method.icon}</span>
        <div className="flex-1">
          <h5 className="font-medium text-gray-800 mb-1">{method.name}</h5>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{method.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <span className="text-gray-500">Fee: </span>
              <span className="font-medium text-gray-700">{method.fees}</span>
            </div>
            
            {eventPrice > 0 && method.currency !== 'Both' && (
              <div className="text-xs font-medium text-primary-600">
                {method.currency === 'USD' 
                  ? formatPrice(eventPrice, 'USD')
                  : formatPrice(convertCurrency(eventPrice, 'USD', 'SLL'), 'SLL')
                }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShowInfo(method);
        }}
        className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <SafeIcon icon={FiInfo} className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

export default PaymentSelector;