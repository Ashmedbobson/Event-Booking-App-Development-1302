import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTicket, FiQrCode, FiShare2, FiCalendar, FiMapPin, FiDownload, FiSend } = FiIcons;

const TicketManager = ({ userTickets, onShareTicket, onDownloadTicket }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const generateQRCode = (ticketId) => {
    // Mock QR code - in real app, this would generate actual QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket_${ticketId}`;
  };

  const handleAddToCalendar = (event) => {
    // Mock calendar integration
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Tickets List */}
      <div className="grid gap-4">
        {userTickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{ticket.event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                      <span>{format(new Date(ticket.event.startDate), 'EEEE, MMMM d, yyyy at h:mm a')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMapPin} className="h-4 w-4" />
                      <span>{ticket.event.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {ticket.type}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    ${ticket.price}
                  </div>
                </div>
              </div>

              {/* Ticket Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiQrCode} className="h-4 w-4" />
                  <span>Show QR Code</span>
                </button>
                
                <button
                  onClick={() => handleAddToCalendar(ticket.event)}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                  <span>Add to Calendar</span>
                </button>
                
                <button
                  onClick={() => onShareTicket(ticket)}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiShare2} className="h-4 w-4" />
                  <span>Share</span>
                </button>
                
                <button
                  onClick={() => onDownloadTicket(ticket)}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiDownload} className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Ticket Stub */}
            <div className="bg-gray-50 border-t border-dashed border-gray-200 p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <span className="font-medium">Ticket ID:</span> {ticket.id}
                </div>
                <div>
                  <span className="font-medium">Order:</span> {ticket.orderId}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* QR Code Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 w-full max-w-md text-center"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Ticket</h3>
            
            <div className="mb-6">
              <img
                src={generateQRCode(selectedTicket.id)}
                alt="QR Code"
                className="mx-auto mb-4"
              />
              <p className="text-sm text-gray-600">
                Show this QR code at the event entrance
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">{selectedTicket.event.title}</h4>
              <p className="text-sm text-gray-600">
                {format(new Date(selectedTicket.event.startDate), 'EEEE, MMMM d, yyyy at h:mm a')}
              </p>
              <p className="text-sm text-gray-600">{selectedTicket.event.location}</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => onShareTicket(selectedTicket)}
                className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Share Ticket
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TicketManager;