import api from './client';

export const login = (phoneNumber, password) =>
  api.post('/auth/login', { phoneNumber, password });

export const registerPlatformOwner = (data) =>
  api.post('/auth/register', data);

export const createUser = (userData) =>
  api.post('/auth/users', userData);

export const getCurrentUser = () =>
  api.get('/auth/me');

<<<<<<< HEAD

export const saveFcmToken = (token) =>
  api.post('/fcm/save-token', { token });

export const changePassword = (currentPassword, newPassword) =>
  api.post('/auth/change-password', { currentPassword, newPassword });
=======
export const saveFcmToken = (token) =>
  api.post('/auth/fcm-token', { token });

export const changePassword = (userId, newPassword) =>
  api.put(`/users/${userId}`, { password: newPassword });
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
