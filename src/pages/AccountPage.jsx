import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import TicketManager from '../components/TicketManager';
import OrganizerDashboard from '../components/OrganizerDashboard';
import DarkModeToggle from '../components/DarkModeToggle';
import AuthModal from '../components/AuthModal';

const {
  FiUser, FiCalendar, FiUsers, FiTrendingUp, FiEdit, FiSettings, FiTicket,
  FiMail, FiMapPin, FiPhone, FiBell, FiLogIn, FiUserPlus, FiHeart, FiStar,
  FiCamera, FiSave, FiX, FiCheck, FiEye, FiEyeOff, FiShield, FiClock,
  FiAward, FiBarChart, FiMessageSquare, FiBookmark, FiThumbsUp, FiGift,
  FiDownload, FiTrash2, FiUpload, FiRefreshCw
} = FiIcons;

const AccountPage = () => {
  const { user, updateUser } = useAuth();
  const { userEvents, attendedEvents, savedEvents, getSavedEventsCount } = useEvents();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Profile form state with enhanced fields
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    website: user?.website || '',
    profilePicture: user?.profilePicture || null,
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    occupation: user?.occupation || '',
    company: user?.company || '',
    socialLinks: user?.socialLinks || {
      twitter: '',
      linkedin: '',
      instagram: '',
      facebook: ''
    }
  });

  // Enhanced interests with more categories
  const availableInterests = [
    { id: 'technology', name: 'Technology', icon: '💻', color: 'bg-blue-100 text-blue-600' },
    { id: 'business', name: 'Business', icon: '💼', color: 'bg-green-100 text-green-600' },
    { id: 'arts', name: 'Arts & Culture', icon: '🎨', color: 'bg-purple-100 text-purple-600' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'bg-orange-100 text-orange-600' },
    { id: 'music', name: 'Music', icon: '🎵', color: 'bg-pink-100 text-pink-600' },
    { id: 'food', name: 'Food & Drink', icon: '🍕', color: 'bg-red-100 text-red-600' },
    { id: 'education', name: 'Education', icon: '📚', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'health', name: 'Health & Wellness', icon: '🏃', color: 'bg-emerald-100 text-emerald-600' },
    { id: 'travel', name: 'Travel', icon: '✈️', color: 'bg-sky-100 text-sky-600' },
    { id: 'photography', name: 'Photography', icon: '📸', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'gaming', name: 'Gaming', icon: '🎮', color: 'bg-violet-100 text-violet-600' },
    { id: 'networking', name: 'Networking', icon: '🤝', color: 'bg-teal-100 text-teal-600' },
    { id: 'finance', name: 'Finance', icon: '💰', color: 'bg-amber-100 text-amber-600' },
    { id: 'marketing', name: 'Marketing', icon: '📢', color: 'bg-rose-100 text-rose-600' },
    { id: 'design', name: 'Design', icon: '🎯', color: 'bg-cyan-100 text-cyan-600' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'bg-lime-100 text-lime-600' }
  ];

  const [userInterests, setUserInterests] = useState(
    user?.interests || []
  );

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: user?.notificationPrefs?.emailNotifications ?? true,
    pushNotifications: user?.notificationPrefs?.pushNotifications ?? true,
    smsNotifications: user?.notificationPrefs?.smsNotifications ?? false,
    eventReminders: user?.notificationPrefs?.eventReminders ?? true,
    weeklyDigest: user?.notificationPrefs?.weeklyDigest ?? true,
    promotionalEmails: user?.notificationPrefs?.promotionalEmails ?? false,
    commentNotifications: user?.notificationPrefs?.commentNotifications ?? true,
    followerNotifications: user?.notificationPrefs?.followerNotifications ?? true
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: user?.privacySettings?.profileVisibility || 'public',
    showEmail: user?.privacySettings?.showEmail ?? false,
    showPhone: user?.privacySettings?.showPhone ?? false,
    showAttendedEvents: user?.privacySettings?.showAttendedEvents ?? true,
    showCreatedEvents: user?.privacySettings?.showCreatedEvents ?? true,
    allowMessages: user?.privacySettings?.allowMessages ?? true
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Enhanced user statistics
  const userStats = {
    totalEventsCreated: userEvents.length,
    totalEventsAttended: attendedEvents.length,
    totalEventsSaved: getSavedEventsCount(),
    totalReviews: 12,
    averageRating: 4.8,
    totalConnections: 156,
    profileCompleteness: calculateProfileCompleteness(),
    joinDate: user?.createdAt || new Date().toISOString(),
    lastActive: new Date().toISOString(),
    accountLevel: 'Premium',
    loyaltyPoints: 1250,
    monthlyActiveEvents: 8,
    totalNetworkReach: 2450
  };

  // Calculate profile completeness percentage
  function calculateProfileCompleteness() {
    const fields = [
      profileForm.name,
      profileForm.email,
      profileForm.bio,
      profileForm.location,
      profileForm.profilePicture,
      userInterests.length > 0,
      profileForm.phone,
      profileForm.occupation
    ];
    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  }

  // Mock reviews data with more variety
  const userReviews = [
    {
      id: '1',
      eventTitle: 'Tech Conference 2024',
      rating: 5,
      comment: 'Amazing event! Great speakers and networking opportunities. The workshops were particularly valuable.',
      date: '2024-01-15',
      helpful: 12,
      category: 'Technology'
    },
    {
      id: '2',
      eventTitle: 'Photography Workshop',
      rating: 4,
      comment: 'Learned a lot about composition and lighting techniques. Would recommend to beginners.',
      date: '2024-01-10',
      helpful: 8,
      category: 'Photography'
    },
    {
      id: '3',
      eventTitle: 'Business Networking Mixer',
      rating: 5,
      comment: 'Excellent networking opportunities and great venue. Made valuable connections.',
      date: '2024-01-05',
      helpful: 15,
      category: 'Business'
    }
  ];

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Enhanced profile image handling with upload simulation
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setSaveMessage('Please select a valid image file.');
        setTimeout(() => setSaveMessage(''), 3000);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setSaveMessage('Image size must be less than 5MB.');
        setTimeout(() => setSaveMessage(''), 3000);
        return;
      }

      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileForm(prev => ({
            ...prev,
            profilePicture: e.target.result
          }));
          setIsUploading(false);
          setSaveMessage('Profile picture updated! Don\'t forget to save your changes.');
          setTimeout(() => setSaveMessage(''), 3000);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsUploading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await updateUser({
        ...profileForm,
        interests: userInterests,
        notificationPrefs,
        privacySettings
      });
      
      setSaveMessage('Profile updated successfully! 🎉');
      setIsEditingProfile(false);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to update profile. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInterestToggle = (interestId) => {
    setUserInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNotificationChange = (key, value) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSaveMessage('Passwords do not match!');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setSaveMessage('Password must be at least 8 characters long!');
      return;
    }
    
    setIsUploading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveMessage('Password updated successfully! 🔒');
    setShowPasswordChange(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaveMessage(''), 3000);
    setIsUploading(false);
  };

  // If user is not authenticated, show sign-in/sign-up options
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 pb-20 md:pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Welcome Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SafeIcon icon={FiUser} className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  Welcome to Your Account
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg mb-8 max-w-2xl mx-auto">
                  Sign in to manage your events, customize your profile, track your activities, and connect with the community. 
                  New to SierraHub? Create an account to get started!
                </p>

                {/* Auth Options */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="w-full sm:flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiLogIn} className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="w-full sm:flex-1 border-2 border-primary-500 text-primary-500 dark:border-primary-400 dark:text-primary-400 px-6 py-3 rounded-lg font-medium hover:bg-primary-500 hover:text-white dark:hover:bg-primary-400 dark:hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiUserPlus} className="h-5 w-5" />
                    <span>Create Account</span>
                  </button>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    icon: FiUser,
                    title: 'Profile Management',
                    description: 'Customize your profile, upload photos, manage interests, and control privacy settings',
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                  },
                  {
                    icon: FiCalendar,
                    title: 'Event Tracking',
                    description: 'Track events you\'ve created, attended, saved, and get detailed analytics',
                    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                  },
                  {
                    icon: FiSettings,
                    title: 'Account Settings',
                    description: 'Manage notifications, privacy, theme preferences, and account security',
                    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                  >
                    <div className={`p-3 rounded-lg w-12 h-12 mx-auto mb-4 ${feature.color}`}>
                      <SafeIcon icon={feature.icon} className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Benefits Section */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Why Join SierraHub?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                  {[
                    { icon: FiStar, title: 'Free to Join', description: 'Create your account and start exploring events for free' },
                    { icon: FiUsers, title: 'Connect with Community', description: 'Meet like-minded people and build lasting connections' },
                    { icon: FiBell, title: 'Smart Notifications', description: 'Get notified about events that match your interests' },
                    { icon: FiShield, title: 'Privacy Protected', description: 'Your data is secure with advanced privacy controls' }
                  ].map((benefit, index) => (
                    <div key={benefit.title} className="flex items-start space-x-3">
                      <SafeIcon icon={benefit.icon} className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">{benefit.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart, count: 0 },
    { id: 'profile', label: 'Profile', icon: FiUser, count: 0 },
    { id: 'interests', label: 'Interests', icon: FiHeart, count: userInterests.length },
    { id: 'events', label: 'My Events', icon: FiCalendar, count: userEvents.length },
    { id: 'attended', label: 'Attended', icon: FiUsers, count: attendedEvents.length },
    { id: 'saved', label: 'Saved', icon: FiBookmark, count: getSavedEventsCount() },
    { id: 'reviews', label: 'Reviews', icon: FiStar, count: userReviews.length },
    { id: 'settings', label: 'Settings', icon: FiSettings, count: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Save Message */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
                saveMessage.includes('success') || saveMessage.includes('🎉') || saveMessage.includes('🔒')
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={saveMessage.includes('success') || saveMessage.includes('🎉') || saveMessage.includes('🔒') ? FiCheck : FiX} className="h-5 w-5" />
                <span className="text-sm">{saveMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Enhanced Profile Picture Section */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 p-1">
                {profileForm.profilePicture ? (
                  <img
                    src={profileForm.profilePicture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                
                {/* Upload overlay when uploading */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiRefreshCw} className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Enhanced Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50 shadow-lg"
                title="Change profile picture"
              >
                <SafeIcon icon={isUploading ? FiRefreshCw : FiCamera} className={`h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                  {profileForm.name || 'Your Name'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userStats.accountLevel === 'Premium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {userStats.accountLevel}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm sm:text-base">{profileForm.email}</p>
              
              {/* Profile Completeness Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Profile Completeness</span>
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{userStats.profileCompleteness}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${userStats.profileCompleteness}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-500 dark:text-gray-400 text-sm">
                <div className="flex items-center">
                  <SafeIcon icon={FiCalendar} className="h-4 w-4 mr-2" />
                  <span>Member since {format(new Date(userStats.joinDate), 'MMMM yyyy')}</span>
                </div>
                {profileForm.location && (
                  <div className="flex items-center">
                    <SafeIcon icon={FiMapPin} className="h-4 w-4 mr-2" />
                    <span>{profileForm.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <SafeIcon icon={FiGift} className="h-4 w-4 mr-2" />
                  <span>{userStats.loyaltyPoints} points</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <SafeIcon icon={isEditingProfile ? FiX : FiEdit} className="h-4 w-4" />
                <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <SafeIcon icon={FiSettings} className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            { icon: FiCalendar, label: 'Events Created', value: userStats.totalEventsCreated, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' },
            { icon: FiUsers, label: 'Events Attended', value: userStats.totalEventsAttended, color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
            { icon: FiBookmark, label: 'Events Saved', value: userStats.totalEventsSaved, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' },
            { icon: FiStar, label: 'Reviews Given', value: userStats.totalReviews, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                  <SafeIcon icon={stat.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 lg:p-8"
        >
          {/* Enhanced Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {/* Enhanced Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Account Status Cards */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Account Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Account Health */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-green-500 p-3 rounded-lg">
                          <SafeIcon icon={FiShield} className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Account Health</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Excellent</p>
                        </div>
                      </div>
                      <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-full"></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Profile {userStats.profileCompleteness}% complete, active engagement
                      </p>
                    </div>

                    {/* Reputation Score */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-blue-500 p-3 rounded-lg">
                          <SafeIcon icon={FiAward} className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Reputation</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{userStats.averageRating}/5.0</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <SafeIcon
                            key={star}
                            icon={FiStar}
                            className={`h-4 w-4 ${
                              star <= Math.round(userStats.averageRating)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Based on {userStats.totalReviews} reviews</p>
                    </div>

                    {/* Activity Level */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-purple-500 p-3 rounded-lg">
                          <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Activity Level</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Very Active</p>
                        </div>
                      </div>
                      <div className="w-full bg-purple-200 dark:bg-purple-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {userStats.monthlyActiveEvents} events this month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { icon: FiCalendar, text: 'Created "Tech Meetup 2024"', time: '2 hours ago', color: 'text-blue-500' },
                      { icon: FiUsers, text: 'Attended "Photography Workshop"', time: '1 day ago', color: 'text-green-500' },
                      { icon: FiStar, text: 'Reviewed "Business Conference"', time: '3 days ago', color: 'text-yellow-500' },
                      { icon: FiHeart, text: 'Saved "Music Festival 2024"', time: '1 week ago', color: 'text-red-500' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <SafeIcon icon={activity.icon} className={`h-5 w-5 ${activity.color}`} />
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-white">{activity.text}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Profile Information</h3>
                    {isEditingProfile && (
                      <button
                        onClick={handleSaveProfile}
                        disabled={isUploading}
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <SafeIcon icon={isUploading ? FiRefreshCw : FiSave} className={`h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
                        <span>{isUploading ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Occupation</label>
                      <input
                        type="text"
                        value={profileForm.occupation}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, occupation: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                        placeholder="Software Engineer, Designer, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                      <input
                        type="text"
                        value={profileForm.company}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                        placeholder="Company Name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                        placeholder="https://your-website.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditingProfile}
                        rows={4}
                        maxLength={500}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-xs text-gray-500 mt-1">{profileForm.bio.length}/500 characters</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Interests Tab */}
            {activeTab === 'interests' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Your Interests</h3>
                      <p className="text-gray-600 dark:text-gray-300">Select topics you're interested in to get personalized event recommendations</p>
                    </div>
                    <button
                      onClick={() => setIsEditingInterests(!isEditingInterests)}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                    >
                      <SafeIcon icon={isEditingInterests ? FiCheck : FiEdit} className="h-4 w-4" />
                      <span>{isEditingInterests ? 'Done' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {availableInterests.map((interest) => (
                      <motion.button
                        key={interest.id}
                        onClick={() => isEditingInterests && handleInterestToggle(interest.id)}
                        disabled={!isEditingInterests}
                        whileHover={isEditingInterests ? { scale: 1.02 } : {}}
                        whileTap={isEditingInterests ? { scale: 0.98 } : {}}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          userInterests.includes(interest.id)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:border-primary-400 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                        } ${isEditingInterests ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <div className="text-2xl mb-2">{interest.icon}</div>
                        <div className="text-sm font-medium text-gray-800 dark:text-white">{interest.name}</div>
                        {userInterests.includes(interest.id) && (
                          <SafeIcon icon={FiCheck} className="h-4 w-4 text-primary-500 dark:text-primary-400 mx-auto mt-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Recommendation Engine</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Based on your {userInterests.length} selected interests, we'll show you events that match your preferences.
                      The more interests you select, the better our recommendations become!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                {userEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiCalendar} className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No events created yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Start creating amazing events for your community</p>
                    <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Create Your First Event
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Attended Tab */}
            {activeTab === 'attended' && (
              <div>
                {attendedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attendedEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiUsers} className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No events attended yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Discover and join amazing events in your area</p>
                    <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Browse Events
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Saved Tab */}
            {activeTab === 'saved' && (
              <div>
                {savedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedEvents.slice(0, 6).map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiBookmark} className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No saved events yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Save events you're interested in to keep track of them</p>
                    <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Explore Events
                    </button>
                  </div>
                )}
                {savedEvents.length > 6 && (
                  <div className="text-center mt-8">
                    <a
                      href="/#/saved"
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      View All Saved Events ({savedEvents.length})
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Your Reviews</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiStar} className="h-4 w-4 text-yellow-500" />
                      <span>Average: {userStats.averageRating}/5</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiThumbsUp} className="h-4 w-4 text-green-500" />
                      <span>{userReviews.reduce((total, review) => total + review.helpful, 0)} helpful votes</span>
                    </div>
                  </div>
                </div>

                {userReviews.length > 0 ? (
                  <div className="space-y-4">
                    {userReviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-800 dark:text-white">{review.eventTitle}</h4>
                              <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded text-xs">
                                {review.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <SafeIcon
                                  key={star}
                                  icon={FiStar}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(review.date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                            <SafeIcon icon={FiThumbsUp} className="h-4 w-4" />
                            <span>{review.helpful} people found this helpful</span>
                          </div>
                          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                            Edit Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiStar} className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No reviews yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Attend events and share your experience with others</p>
                    <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                      Find Events to Attend
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* Theme Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Appearance</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">Theme Preference</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Choose your preferred theme or let it follow your system setting
                        </p>
                      </div>
                      <DarkModeToggle size="default" showLabel={false} />
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {Object.entries({
                      emailNotifications: 'Email notifications',
                      pushNotifications: 'Push notifications',
                      smsNotifications: 'SMS notifications',
                      eventReminders: 'Event reminders',
                      weeklyDigest: 'Weekly digest',
                      promotionalEmails: 'Promotional emails',
                      commentNotifications: 'Comment notifications',
                      followerNotifications: 'Follower notifications'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiBell} className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          <span className="font-medium text-gray-800 dark:text-white">{label}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationPrefs[key]}
                            onChange={(e) => handleNotificationChange(key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Privacy</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-800 dark:text-white">Profile Visibility</span>
                      </div>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                      >
                        <option value="public">Public - Anyone can see your profile</option>
                        <option value="friends">Friends Only - Only your connections can see your profile</option>
                        <option value="private">Private - Your profile is hidden</option>
                      </select>
                    </div>

                    {[
                      { key: 'showEmail', label: 'Show email address on profile' },
                      { key: 'showPhone', label: 'Show phone number on profile' },
                      { key: 'showAttendedEvents', label: 'Show attended events' },
                      { key: 'showCreatedEvents', label: 'Show created events' },
                      { key: 'allowMessages', label: 'Allow messages from other users' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-medium text-gray-800 dark:text-white">{setting.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings[setting.key]}
                            onChange={(e) => handlePrivacyChange(setting.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Security</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowPasswordChange(true)}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiShield} className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white">Change Password</span>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Update your account password</p>
                          </div>
                        </div>
                        <SafeIcon icon={FiEdit} className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>

                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiShield} className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white">Two-Factor Authentication</span>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Add an extra layer of security</p>
                          </div>
                        </div>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Actions</h3>
                  <div className="space-y-4">
                    <button className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiDownload} className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        <div>
                          <span className="font-medium text-gray-800 dark:text-white">Download Your Data</span>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Get a copy of all your data</p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full p-4 bg-red-50 dark:bg-red-900 rounded-lg text-left hover:bg-red-100 dark:hover:bg-red-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiTrash2} className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <div>
                          <span className="font-medium text-red-600 dark:text-red-400">Delete Account</span>
                          <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Password Change Modal */}
        {showPasswordChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={isUploading ? FiRefreshCw : FiShield} className={`h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
                    <span>{isUploading ? 'Updating...' : 'Update Password'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;