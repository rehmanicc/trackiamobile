import api from './client';

export const fetchGeofences = (deviceId) =>
  api.get('/geofences', { params: { deviceId } });

export const createGeofence = (payload) =>
  api.post('/geofences', payload);

export const updateGeofence = (id, payload) =>
  api.put(`/geofences/${id}`, payload);

export const deleteGeofence = (id) =>
  api.delete(`/geofences/${id}`);

export const setCallGeofence = (deviceId, geofenceId) =>
  api.post(`/devices/${deviceId}/call-geofence`, { geofenceId });