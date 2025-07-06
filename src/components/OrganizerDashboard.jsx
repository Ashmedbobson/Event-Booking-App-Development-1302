import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBarChart3, FiUsers, FiDollarSign, FiCalendar, FiTrendingUp, FiMail, FiShare2, FiSettings } = FiIcons;

const OrganizerDashboard = ({ userEvents, onSendMessage, onPromoteEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [messageData, setMessageData] = useState({ subject: '', message: '' });

  const totalAttendees = userEvents.reduce((sum, event) => sum + event.currentAttendees, 0);
  const totalRevenue = userEvents.reduce((sum, event) => sum + (event.price * event.currentAttendees), 0);
  const avgAttendance = userEvents.length > 0 ? totalAttendees / userEvents.length : 0;

  const stats = [
    { label: 'Total Events', value: userEvents.length, icon: FiCalendar, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Attendees', value: totalAttendees, icon: FiUsers, color: 'bg-green-100 text-green-600' },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'bg-purple-100 text-purple-600' },
    { label: 'Avg Attendance', value: avgAttendance.toFixed(1), icon: FiTrendingUp, color: 'bg-orange-100 text-orange-600' }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (selectedEvent && messageData.subject && messageData.message) {
      onSendMessage(selectedEvent.id, messageData);
      setMessageData({ subject: '', message: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <SafeIcon icon={stat.icon} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Event Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Event Management</h3>
        
        <div className="space-y-4">
          {userEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{event.currentAttendees} / {event.maxAttendees} attendees</span>
                    <span>Revenue: ${(event.price * event.currentAttendees).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-center space-x-2 bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <SafeIcon icon={FiMail} className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                  
                  <button
                    onClick={() => onPromoteEvent(event.id)}
                    className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <SafeIcon icon={FiShare2} className="h-4 w-4" />
                    <span>Promote</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <SafeIcon icon={FiBarChart3} className="h-4 w-4" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Message Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Message Attendees - {selectedEvent.title}
            </h3>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={messageData.subject}
                  onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter message subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={messageData.message}
                  onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your message to attendees..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;