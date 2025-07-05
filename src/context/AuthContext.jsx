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
    const storedUser = localStorage.getItem('eventHub_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('eventHub_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventHub_user');
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('eventHub_user', JSON.stringify(newUser));
  };

  const value = {
    user,
    login,
    logout,
    register,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};