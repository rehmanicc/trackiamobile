import api from './client';

export const fetchDevices = () => api.get('/devices');

export const getDevice = (id) => api.get(`/devices/${id}`);

export const createDevice = (data) => api.post('/devices', data);

export const updateDevice = (id, data) => api.put(`/devices/${id}`, data);

export const deleteDevice = (id) => api.delete(`/devices/${id}`);

export const assignDevice = (deviceId, userId) =>
  api.post(`/devices/${deviceId}/assign`, { userId });

export const unassignDevice = (deviceId, userId) =>
  api.post(`/devices/${deviceId}/unassign`, { userId });

export const updateDevicePermissions = (deviceId, permissionsData) =>
  api.put(`/devices/${deviceId}/permissions`, permissionsData);