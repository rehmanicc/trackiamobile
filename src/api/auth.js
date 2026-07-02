import api from './client';

export const login = (phoneNumber, password) =>
  api.post('/auth/login', { phoneNumber, password });

export const registerPlatformOwner = (data) =>
  api.post('/auth/register', data);

export const createUser = (userData) =>
  api.post('/auth/users', userData);

export const getCurrentUser = () =>
  api.get('/auth/me');

export const saveFcmToken = (token) =>
  api.post('/fcm/save-token', { token });

export const changePassword = (currentPassword, newPassword) =>
  api.post('/auth/change-password', { currentPassword, newPassword });