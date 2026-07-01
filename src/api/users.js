import api from './client';

export const fetchUsers = () => api.get('/users');

export const getUser = (id) => api.get(`/users/${id}`);

export const createUser = (userData) => api.post('/auth/users', userData);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const updateUserAlertPreferences = (preferences) =>
  api.put('/users/me', { alertPreferences: preferences });

export const transferDeviceOwnership = (fromUserId, toUserId, deviceId) =>
  api.post('/users/transfer', { fromUserId, toUserId, deviceId });