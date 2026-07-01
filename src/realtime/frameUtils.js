export const MIN_DELTA_TIME = 0.001;
export const MAX_DELTA_TIME = 0.05;
export const IDLE_SPEED = 1.2;
export const LOW_SPEED = 6;
export const GPS_NOISE_THRESHOLD = 2.5;
export const SNAP_DISTANCE = 120;
export const POSITION_SMOOTHING = 0.12;
export const ROTATION_SMOOTHING = 0.12;
export const MAX_ROTATION_PER_FRAME = 8;
export const MAX_PREDICTION_DISTANCE = 45;
export const MAX_DRIFT_RECONCILIATION = 25;
export const HIGHWAY_SPEED = 70;
export const MAX_HIGHWAY_PREDICTION = 18;
export const SHARP_TURN_ANGLE = 55;
export const CORNER_DAMPING = 0.45;
export const GPS_REJOIN_SMOOTHING = 0.08;

export const toRad = (deg) => deg * (Math.PI / 180);

export const lerp = (start, end, t) => start + (end - start) * t;

export const normalizeAngle = (angle) => ((angle % 360) + 360) % 360;

export const shortestAngle = (from, to) => {
  let diff = normalizeAngle(to) - normalizeAngle(from);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
};

export const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const calculateVelocityVector = (latitude, longitude, speedKph, heading) => {
  const speedMps = speedKph / 3.6;
  const headingRad = heading * (Math.PI / 180);
  const metersLat = Math.cos(headingRad) * speedMps;
  const metersLng = Math.sin(headingRad) * speedMps;
  return { vx: metersLng, vy: metersLat };
};

export const projectCoordinate = (latitude, longitude, velocity, deltaTimeSeconds) => {
  const earthRadius = 6378137;
  const deltaLat = (velocity.vy * deltaTimeSeconds) / earthRadius;
  const deltaLng = (velocity.vx * deltaTimeSeconds) / (earthRadius * Math.cos(latitude * Math.PI / 180));
  return {
    latitude: latitude + deltaLat * (180 / Math.PI),
    longitude: longitude + deltaLng * (180 / Math.PI),
  };
};

export const calculateAdaptivePredictionTime = (speed, packetAge) => {
  if (speed < 3) return 0;
  if (packetAge < 2000) return 1.5;
  if (packetAge < 5000) return 3;
  return 5;
};

export const calculatePredictionDecay = (packetAge) => {
  if (packetAge <= 5000) return 1;
  if (packetAge >= 15000) return 0;
  return 1 - (packetAge - 5000) / 10000;
};

export const clampPredictionDistance = (rendered, predicted, maxDistance) => {
  const distance = getDistanceMeters(rendered.latitude, rendered.longitude, predicted.latitude, predicted.longitude);
  if (distance <= maxDistance) return predicted;
  const ratio = maxDistance / distance;
  return {
    latitude: lerp(rendered.latitude, predicted.latitude, ratio),
    longitude: lerp(rendered.longitude, predicted.longitude, ratio),
  };
};