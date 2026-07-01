import api from './client';

export const getDashboardStats = () => api.get('/dashboard/stats');

export const getGeofenceDurations = (deviceId, from, to) =>
  api.get('/analytics/geofence-durations', { params: { deviceId, from, to } });

export const getDailyReport = (date) =>
  api.get('/analytics/daily-report', { params: { date } });

export const getTripAnalytics = (deviceId, from, to) =>
  api.get('/analytics/trips', { params: { deviceId, from, to } });