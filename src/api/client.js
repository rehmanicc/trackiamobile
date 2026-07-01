import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
<<<<<<< HEAD
import { appEvents } from '../utils/events';
=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec

const BASE_URL = 'https://api.trackiatech.com/api';

let cachedToken = null; // In-memory token cache

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from cache (fast) or AsyncStorage (initial)
api.interceptors.request.use(async (config) => {
  // If token is already cached, use it immediately
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  } else {
    // Fallback: try to load from AsyncStorage (only once)
    const token = await AsyncStorage.getItem('token');
    if (token) {
      cachedToken = token;
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

<<<<<<< HEAD
// Response interceptor: handle 401 by clearing credentials and emitting event
=======
// Response interceptor: handle 401 by clearing credentials
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear cached token and AsyncStorage on authentication failure
      cachedToken = null;
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
<<<<<<< HEAD
      // Emit event to trigger React logout
      appEvents.emit('unauthorized');
=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  cachedToken = token;
  if (token) {
    AsyncStorage.setItem('token', token);
  } else {
    AsyncStorage.removeItem('token');
  }
};
<<<<<<< HEAD

=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
export const useApi = () => api;
export default api;