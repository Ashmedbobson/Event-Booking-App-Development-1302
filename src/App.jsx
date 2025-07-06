import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import OnboardingFlow from './components/OnboardingFlow';
import NotificationCenter from './components/NotificationCenter';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailPage from './pages/EventDetailPage';
import AccountPage from './pages/AccountPage';
import SavedEventsPage from './pages/SavedEventsPage';
import { EventProvider } from './context/EventContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'event_reminder',
      title: 'Event Reminder',
      message: 'Tech Conference 2024 starts in 2 hours',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '2',
      type: 'new_attendee',
      title: 'New Attendee',
      message: 'John Doe registered for your workshop',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ]);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check if user is new (in real app, check server/storage)
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (userData) => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(userData));
    setShowOnboarding(false);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">SierraHub</h2>
          <p className="text-gray-600 dark:text-gray-300">Loading amazing events...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 md:pb-0 transition-colors duration-200">
            <Header
              NotificationCenter={
                <NotificationCenter
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
              }
            />

            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/create-event" element={<CreateEventPage />} />
                <Route path="/event/:id" element={<EventDetailPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/saved" element={<SavedEventsPage />} />
              </Routes>
            </AnimatePresence>

            <BottomNavigation />

            <OnboardingFlow
              isOpen={showOnboarding}
              onClose={() => setShowOnboarding(false)}
              onComplete={handleOnboardingComplete}
            />
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;