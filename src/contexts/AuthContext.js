import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, saveFcmToken } from '../api/auth';
import { registerForPushNotificationsAsync } from '../services/notificationService';
<<<<<<< HEAD
import { setAuthToken } from '../api/client';
import { appEvents } from '../utils/events';
=======
import api, { setAuthToken } from '../api/client';
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Load saved auth on app start
=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
  useEffect(() => {
    loadAuth();
  }, []);

<<<<<<< HEAD
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

=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
  const loadAuth = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const savedToken = await AsyncStorage.getItem('token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
<<<<<<< HEAD
        setAuthToken(savedToken);
=======
        setAuthToken(savedToken);  // ✅ Restore token to apiClient cache
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
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
<<<<<<< HEAD
      setAuthToken(authToken);

      await AsyncStorage.setItem('user', JSON.stringify(userData));
=======
      setAuthToken(authToken);  // ✅ Save to both AsyncStorage and apiClient cache

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      // No need to manually set token – setAuthToken already does it
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec

      // Register FCM token
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
<<<<<<< HEAD
    setAuthToken(null);
    await AsyncStorage.removeItem('user');
=======
    setAuthToken(null);  // ✅ Clear token from apiClient cache
    await AsyncStorage.removeItem('user');
    // token removal is handled by setAuthToken
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
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