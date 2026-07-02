import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appEvents } from '../utils/events';

const BASE_URL = 'https://api.trackiatech.com/api';

let cachedToken = null; // In-memory token cache

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from cache or AsyncStorage
api.interceptors.request.use(async (config) => {
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  } else {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      cachedToken = token;
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401 by clearing credentials and emitting event
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      cachedToken = null;
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      appEvents.emit('unauthorized');
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

export const useApi = () => api;
export default api;