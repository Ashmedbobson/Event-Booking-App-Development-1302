import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('sierraHub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sierraHub_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sierraHub_user');
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      interests: [],
      notificationPrefs: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        eventReminders: true,
        weeklyDigest: true,
        promotionalEmails: false,
        commentNotifications: true,
        followerNotifications: true
      },
      privacySettings: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        showAttendedEvents: true,
        showCreatedEvents: true,
        allowMessages: true
      }
    };
    setUser(newUser);
    localStorage.setItem('sierraHub_user', JSON.stringify(newUser));
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('sierraHub_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};