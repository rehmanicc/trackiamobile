import api from './client';

export const fetchTrackerModels = () => api.get('/tracker-models');

export const getTrackerModel = (id) => api.get(`/tracker-models/${id}`);

export const createTrackerModel = (data) => api.post('/tracker-models', data);

export const updateTrackerModel = (id, data) => api.put(`/tracker-models/${id}`, data);

export const deleteTrackerModel = (id) => api.delete(`/tracker-models/${id}`);