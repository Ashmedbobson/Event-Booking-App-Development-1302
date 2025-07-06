import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronRight, FiChevronLeft, FiMapPin, FiHeart, FiUser, FiCheck } = FiIcons;

const OnboardingFlow = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    interests: [],
    location: '',
    preferences: {
      notifications: true,
      emailUpdates: true,
      locationServices: true
    }
  });

  const steps = [
    {
      title: "Welcome to SierraHub!",
      subtitle: "Let's personalize your experience",
      component: WelcomeStep
    },
    {
      title: "What interests you?",
      subtitle: "Select your favorite event categories",
      component: InterestsStep
    },
    {
      title: "Where are you located?",
      subtitle: "We'll show you events nearby",
      component: LocationStep
    },
    {
      title: "Notification preferences",
      subtitle: "Stay updated on events you love",
      component: PreferencesStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiIcons.FiX} className="h-5 w-5" />
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600">
            {steps[currentStep].subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent userData={userData} setUserData={setUserData} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <SafeIcon icon={FiChevronLeft} className="h-4 w-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <SafeIcon icon={currentStep === steps.length - 1 ? FiCheck : FiChevronRight} className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const WelcomeStep = () => (
  <div className="text-center">
    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
      <SafeIcon icon={FiIcons.FiCalendar} className="h-10 w-10 text-white" />
    </div>
    <p className="text-gray-600 leading-relaxed">
      Discover amazing events, connect with like-minded people, and create unforgettable memories. 
      Let's set up your profile to show you the best events in your area.
    </p>
  </div>
);

const InterestsStep = ({ userData, setUserData }) => {
  const interests = [
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'arts', name: 'Arts & Culture', icon: '🎨' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'food', name: 'Food & Drink', icon: '🍕' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'health', name: 'Health & Wellness', icon: '🏃' }
  ];

  const toggleInterest = (interestId) => {
    setUserData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {interests.map(interest => (
        <button
          key={interest.id}
          onClick={() => toggleInterest(interest.id)}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            userData.interests.includes(interest.id)
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-2xl mb-2">{interest.icon}</div>
          <div className="text-sm font-medium text-gray-800">{interest.name}</div>
        </button>
      ))}
    </div>
  );
};

const LocationStep = ({ userData, setUserData }) => {
  const popularCities = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA'
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Enter your city or zip code"
          value={userData.location}
          onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-3">Or choose from popular cities:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {popularCities.slice(0, 4).map(city => (
            <button
              key={city}
              onClick={() => setUserData(prev => ({ ...prev, location: city }))}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PreferencesStep = ({ userData, setUserData }) => {
  const updatePreference = (key, value) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const preferences = [
    {
      key: 'notifications',
      title: 'Push Notifications',
      description: 'Get notified about new events and updates'
    },
    {
      key: 'emailUpdates',
      title: 'Email Updates',
      description: 'Receive weekly event recommendations'
    },
    {
      key: 'locationServices',
      title: 'Location Services',
      description: 'Show events near your current location'
    }
  ];

  return (
    <div className="space-y-4">
      {preferences.map(pref => (
        <div key={pref.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{pref.title}</h3>
            <p className="text-sm text-gray-600">{pref.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userData.preferences[pref.key]}
              onChange={(e) => updatePreference(pref.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default OnboardingFlow;