import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, saveFcmToken } from '../api/auth';
import { registerForPushNotificationsAsync } from '../services/notificationService';
import { setAuthToken } from '../api/client';
import { appEvents } from '../utils/events';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuth();
  }, []);

  // Listen for 401 events from API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('🔴 Unauthorized detected – logging out');
      logout();
    };
    appEvents.on('unauthorized', handleUnauthorized);
    return () => {
      appEvents.off('unauthorized', handleUnauthorized);
    };
  }, []);

  const loadAuth = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const savedToken = await AsyncStorage.getItem('token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setAuthToken(savedToken);
      }
    } catch (err) {
      console.log('❌ Load auth error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phoneNumber, password) => {
    try {
      const res = await loginApi(phoneNumber, password);
      const { user: userData, token: authToken } = res.data;

      setUser(userData);
      setToken(authToken);
      setAuthToken(authToken);

      await AsyncStorage.setItem('user', JSON.stringify(userData));

      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await saveFcmToken(pushToken);
      }

      return true;
    } catch (err) {
      console.log('❌ Login error:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};