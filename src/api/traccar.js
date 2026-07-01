import api from './client';

export const getPositions = (deviceId) =>
  api.get('/traccar/positions', { params: { deviceId } });

export const getRoute = (deviceId, from, to) =>
  api.get('/traccar/route', { params: { deviceId, from, to } });

export const getTrips = (deviceId, from, to) =>
  api.get('/traccar/trips', { params: { deviceId, from, to } });

export const sendCommand = (deviceId, type, attributes = {}) =>
  api.post('/traccar/command', { deviceId, type, attributes });

export const getHistory = (deviceId, from, to) =>
  api.get('/traccar/history', { params: { deviceId, from, to } });