import api from './client';

export const fetchAlerts = (params = {}) =>
  api.get('/alerts', { params });

export const fetchCriticalAlerts = () =>
  fetchAlerts({ isCritical: true });

export const markAlertRead = (id) =>
  api.put(`/alerts/${id}/read`);

export const deleteAlert = (id) =>
  api.delete(`/alerts/${id}`);

export const getAlertStats = () =>
  api.get('/alerts/stats');