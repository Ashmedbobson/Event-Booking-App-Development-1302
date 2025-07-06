import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronLeft, FiChevronRight, FiCalendar } = FiIcons;

const EventCalendar = ({ events, onDateSelect, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiChevronLeft} className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiChevronRight} className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <motion.button
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-2 h-12 text-sm rounded-lg transition-all duration-200 ${
                !isCurrentMonth 
                  ? 'text-gray-300' 
                  : isSelected
                  ? 'bg-primary-500 text-white'
                  : isTodayDate
                  ? 'bg-primary-100 text-primary-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className="block">{format(day, 'd')}</span>
              {dayEvents.length > 0 && (
                <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                  isSelected ? 'bg-white' : 'bg-primary-500'
                }`} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">
            Events on {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="space-y-2">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map(event => (
                <motion.button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  whileHover={{ scale: 1.02 }}
                  className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(event.startDate), 'h:mm a')} - {event.location}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No events on this date</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;