import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailPage from './pages/EventDetailPage';
import ProfilePage from './pages/ProfilePage';
import { EventProvider } from './context/EventContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">EventHub</h2>
          <p className="text-gray-600">Loading amazing events...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/create-event" element={<CreateEventPage />} />
                <Route path="/event/:id" element={<EventDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;