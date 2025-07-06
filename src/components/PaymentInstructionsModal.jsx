import React from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiX,FiCopy,FiCheck,FiSmartphone,FiDollarSign} = FiIcons;

const PaymentInstructionsModal = ({isOpen, onClose, paymentMethod, eventDetails, organizerInfo}) => {
  const [copied, setCopied] = React.useState('');

  if (!isOpen || !paymentMethod) return null;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const getPaymentInstructions = () => {
    const {method} = paymentMethod;
    const amount = paymentMethod.amount;
    const currency = paymentMethod.currency;

    switch (method.id) {
      case 'orange_money':
        return {
          title: 'Orange Money Payment Instructions',
          steps: [
            'Dial *144# on your Orange phone',
            'Select "Send Money"',
            'Enter the recipient number: +232 76 123 456',
            `Enter amount: Le ${amount.toLocaleString()}`,
            'Enter your PIN to confirm',
            'Save the transaction reference number',
            'Send the reference to the organizer'
          ],
          recipientInfo: {
            name: organizerInfo.name,
            phone: '+232 76 123 456',
            amount: `Le ${amount.toLocaleString()}`
          },
          additionalInfo: 'Transaction fee: Le 500 (charged by Orange Money)'
        };

      case 'airtel_money':
        return {
          title: 'Airtel Money Payment Instructions',
          steps: [
            'Dial *432# on your Airtel phone',
            'Select "Send Money"',
            'Enter the recipient number: +232 78 987 654',
            `Enter amount: Le ${amount.toLocaleString()}`,
            'Enter your PIN to confirm',
            'Save the transaction reference number',
            'Send the reference to the organizer'
          ],
          recipientInfo: {
            name: organizerInfo.name,
            phone: '+232 78 987 654',
            amount: `Le ${amount.toLocaleString()}`
          },
          additionalInfo: 'Transaction fee: Le 500 (charged by Airtel Money)'
        };

      case 'afrimoney':
        return {
          title: 'AfriMoney Payment Instructions',
          steps: [
            'Open the AfriMoney app or dial *797#',
            'Select "Send Money"',
            'Enter recipient: +232 77 555 123',
            `Enter amount: Le ${amount.toLocaleString()}`,
            'Confirm with your PIN',
            'Save the transaction ID',
            'Share the transaction ID with organizer'
          ],
          recipientInfo: {
            name: organizerInfo.name,
            phone: '+232 77 555 123',
            amount: `Le ${amount.toLocaleString()}`
          },
          additionalInfo: 'Transaction fee: Le 300-1000 depending on amount'
        };

      case 'qmoney':
        return {
          title: 'QMoney Payment Instructions',
          steps: [
            'Dial *955# or use QMoney app',
            'Select "Send Money"',
            'Enter recipient: +232 99 888 777',
            `Enter amount: Le ${amount.toLocaleString()}`,
            'Enter your PIN',
            'Note the transaction reference',
            'Send reference to organizer'
          ],
          recipientInfo: {
            name: organizerInfo.name,
            phone: '+232 99 888 777',
            amount: `Le ${amount.toLocaleString()}`
          },
          additionalInfo: 'Transaction fee: 1.5% of amount'
        };

      case 'cashapp':
        return {
          title: 'Cash App Payment Instructions',
          steps: [
            'Open your Cash App',
            'Tap the "Pay" button',
            `Enter $${amount} amount`,
            'Search for $SierraEvents or enter phone +1-555-123-4567',
            'Add note: "Event Booking - ' + eventDetails.title + '"',
            'Confirm payment with PIN/Face ID',
            'Screenshot the confirmation'
          ],
          recipientInfo: {
            cashtag: '$SierraEvents',
            phone: '+1-555-123-4567',
            amount: `$${amount}`
          },
          additionalInfo: 'No fees for standard transfers'
        };

      case 'zelle':
        return {
          title: 'Zelle Payment Instructions',
          steps: [
            'Open your banking app or Zelle app',
            'Select "Send Money with Zelle"',
            'Enter email: sierraevents@example.com',
            `Enter amount: $${amount}`,
            'Add memo: "Event: ' + eventDetails.title + '"',
            'Review and send',
            'Save the confirmation number'
          ],
          recipientInfo: {
            email: 'sierraevents@example.com',
            name: organizerInfo.name,
            amount: `$${amount}`
          },
          additionalInfo: 'Usually instant, no fees from Zelle'
        };

      case 'bank_transfer':
        return {
          title: 'Bank Transfer Instructions',
          steps: [
            'Visit your bank or use online banking',
            'Select "Transfer Money" or "Wire Transfer"',
            'Use the account details provided below',
            `Transfer amount: $${amount} or Le ${(amount * 22000).toLocaleString()}`,
            'Include reference: ' + eventDetails.title + ' - Your Name',
            'Keep the transfer receipt',
            'Send receipt photo to organizer'
          ],
          recipientInfo: {
            bankName: 'Sierra Leone Commercial Bank',
            accountName: organizerInfo.name,
            accountNumber: '1234567890',
            swiftCode: 'SLCBSLPA',
            amount: `$${amount} or Le ${(amount * 22000).toLocaleString()}`
          },
          additionalInfo: 'Allow 1-5 business days for processing'
        };

      case 'paypal':
        return {
          title: 'PayPal Payment Instructions',
          steps: [
            'Login to your PayPal account',
            'Click "Send & Request"',
            'Enter email: payments@sierraevents.com',
            `Enter amount: $${amount}`,
            'Select "Sending to a friend"',
            'Add note: "Event Booking - ' + eventDetails.title + '"',
            'Review and send payment'
          ],
          recipientInfo: {
            email: 'payments@sierraevents.com',
            name: organizerInfo.name,
            amount: `$${amount}`
          },
          additionalInfo: 'PayPal fees may apply for business transactions'
        };

      default:
        return {
          title: 'Cash Payment Instructions',
          steps: [
            'Bring exact change to the event',
            'Payment will be collected at the entrance',
            'Keep this confirmation as your receipt',
            'Arrive 15 minutes early for payment processing'
          ],
          recipientInfo: {
            amount: currency === 'USD' ? `$${amount}` : `Le ${amount.toLocaleString()}`,
            location: eventDetails.location
          },
          additionalInfo: 'Cash payments accepted at event venue only'
        };
    }
  };

  const instructions = getPaymentInstructions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.9}}
        className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{paymentMethod.method.icon}</span>
            <h3 className="text-lg font-semibold text-gray-800">
              {instructions.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="h-5 w-5" />
          </button>
        </div>

        {/* Event Details */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2">Event Details</h4>
          <p className="text-sm text-blue-700">{eventDetails.title}</p>
          <p className="text-sm text-blue-600">{eventDetails.date}</p>
          <p className="text-lg font-bold text-blue-800 mt-2">
            Amount: {instructions.recipientInfo.amount}
          </p>
        </div>

        {/* Payment Steps */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Payment Steps</h4>
          <ol className="space-y-2">
            {instructions.steps.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Recipient Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Payment Details</h4>
          <div className="space-y-2">
            {Object.entries(instructions.recipientInfo).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-800">{value}</span>
                  <button
                    onClick={() => copyToClipboard(value, key)}
                    className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <SafeIcon icon={copied === key ? FiCheck : FiCopy} className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        {instructions.additionalInfo && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">Important Note</h4>
            <p className="text-sm text-yellow-700">{instructions.additionalInfo}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-2">
            Contact the event organizer if you have any payment issues:
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{organizerInfo.name}</span>
            <button
              onClick={() => copyToClipboard(organizerInfo.contact, 'contact')}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <span className="text-sm">{organizerInfo.contact}</span>
              <SafeIcon icon={copied === 'contact' ? FiCheck : FiCopy} className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Got it, I'll make the payment
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentInstructionsModal;