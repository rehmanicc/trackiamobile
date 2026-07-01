import {
  MIN_DELTA_TIME,
  MAX_DELTA_TIME,
  IDLE_SPEED,
  SNAP_DISTANCE,
  POSITION_SMOOTHING,
  ROTATION_SMOOTHING,
  MAX_ROTATION_PER_FRAME,
  MAX_PREDICTION_DISTANCE,
  MAX_DRIFT_RECONCILIATION,
  HIGHWAY_SPEED,
  MAX_HIGHWAY_PREDICTION,
  SHARP_TURN_ANGLE,
  CORNER_DAMPING,
  GPS_REJOIN_SMOOTHING,
  normalizeAngle,
  shortestAngle,
  getDistanceMeters,
  lerp,
  projectCoordinate,
  calculateAdaptivePredictionTime,
  calculatePredictionDecay,
  clampPredictionDistance,
} from './frameUtils';

export const updateDeviceFrame = (device, currentTime) => {
  if (!device || !device.coordinate) return;

  const deltaTime = Math.min(
    MAX_DELTA_TIME,
    Math.max(MIN_DELTA_TIME, (currentTime - device.lastFrameTime) / 1000)
  );
  device.lastFrameTime = currentTime;

  const rendered = device.renderedCoordinate;
  const now = Date.now();
  const packetAge = now - (device.lastPacketTime || now);
  const predictionDecay = calculatePredictionDecay(packetAge);
  device.predictionStrength = predictionDecay;

  if (device.isPredicting && device.speedMps > 0.8 && predictionDecay > 0) {
    const predictionTime = calculateAdaptivePredictionTime(device.speedMps * 3.6, packetAge);
    let safePredictionTime = predictionTime;
    const speedKmh = device.speedMps * 3.6;
    if (speedKmh > HIGHWAY_SPEED) {
      safePredictionTime = Math.min(predictionTime, MAX_HIGHWAY_PREDICTION / speedKmh);
    }
    const projected = projectCoordinate(
      device.targetCoordinate.latitude,
      device.targetCoordinate.longitude,
      device.velocity,
      safePredictionTime
    );
    device.predictedCoordinate = projected;
    device.predictedCoordinate = clampPredictionDistance(rendered, device.predictedCoordinate, MAX_PREDICTION_DISTANCE);
  } else {
    device.predictedCoordinate = device.targetCoordinate;
  }

  const target = device.predictedCoordinate || device.targetCoordinate;

  if (packetAge > 30000) {
    device.isPredicting = false;
    device.predictedCoordinate = device.targetCoordinate;
    device.renderedCoordinate = {
      latitude: lerp(rendered.latitude, device.targetCoordinate.latitude, GPS_REJOIN_SMOOTHING),
      longitude: lerp(rendered.longitude, device.targetCoordinate.longitude, GPS_REJOIN_SMOOTHING),
    };
    return;
  }

  if (!rendered || !target) return;

  const distanceMeters = getDistanceMeters(rendered.latitude, rendered.longitude, target.latitude, target.longitude);
  const driftFromGps = distanceMeters;

  if (driftFromGps > MAX_DRIFT_RECONCILIATION) {
    device.renderedCoordinate = {
      latitude: lerp(rendered.latitude, target.latitude, GPS_REJOIN_SMOOTHING),
      longitude: lerp(rendered.longitude, target.longitude, GPS_REJOIN_SMOOTHING),
    };
  }

  const speedKmh = (device.speedMps || 0) * 3.6;
  if (speedKmh < 3) {
    device.isPredicting = false;
    device.predictedCoordinate = device.targetCoordinate;
  }

  if (speedKmh < IDLE_SPEED && distanceMeters < 1) {
    device.renderedCoordinate = { ...target };
    device.coordinate = { ...target };
    device.renderedHeading = device.targetHeading || 0;
    return;
  }

  if (distanceMeters > SNAP_DISTANCE) {
    device.renderedCoordinate = { ...target };
    device.targetCoordinate = { ...target };
    device.coordinate = { ...target };
    device.renderedHeading = device.targetHeading || 0;
    return;
  }

  let smoothing = POSITION_SMOOTHING;
  if (distanceMeters < 3) smoothing = 0.08;
  else if (distanceMeters < 10) smoothing = 0.12;
  else if (distanceMeters < 40) smoothing = 0.18;
  else smoothing = 0.32;

  const headingDifference = Math.abs(shortestAngle(device.renderedHeading || 0, device.targetHeading || 0));
  if (headingDifference > SHARP_TURN_ANGLE) smoothing *= CORNER_DAMPING;

  const frameFactor = Math.min(1, smoothing * (deltaTime * 60));
  const safeFrameFactor = Math.min(frameFactor, 0.35);

  let nextLat = lerp(rendered.latitude, target.latitude, safeFrameFactor);
  let nextLng = lerp(rendered.longitude, target.longitude, safeFrameFactor);
  const finalLat = Math.abs(target.latitude - nextLat) < 0.0000005 ? target.latitude : nextLat;
  const finalLng = Math.abs(target.longitude - nextLng) < 0.0000005 ? target.longitude : nextLng;
  device.renderedCoordinate = { latitude: finalLat, longitude: finalLng };

  if (device.isPredicting && speedKmh > 5) {
    device.targetHeading = normalizeAngle(device.targetHeading || 0);
  }

  if (speedKmh >= IDLE_SPEED) {
    const currentHeading = device.renderedHeading || 0;
    const targetHeading = device.targetHeading || 0;
    const angleDiff = shortestAngle(currentHeading, targetHeading);
    const rotationStep = Math.max(
      -MAX_ROTATION_PER_FRAME,
      Math.min(MAX_ROTATION_PER_FRAME, angleDiff * ROTATION_SMOOTHING * deltaTime * 60)
    );
    device.renderedHeading = normalizeAngle(currentHeading + rotationStep);
  }

  device.coordinate = { latitude: finalLat, longitude: finalLng };
};

export const startFrameEngine = ({ devicesRef, animationFrameRef, frameEngineRunning, lastUiUpdate, setLiveDevices }) => {
  if (frameEngineRunning.current) return;
  frameEngineRunning.current = true;

  const frameLoop = (currentTime) => {
    if (!devicesRef.current) {
      animationFrameRef.current = requestAnimationFrame(frameLoop);
      return;
    }
    Object.values(devicesRef.current).forEach((device) => {
      updateDeviceFrame(device, currentTime);
    });
    const now = Date.now();
    if (now - lastUiUpdate.current > 80) {
      lastUiUpdate.current = now;
      const snapshot = devicesRef.current;
      if (Object.keys(snapshot).length > 0) {
        setLiveDevices({ ...snapshot });
      }
    }
    animationFrameRef.current = requestAnimationFrame(frameLoop);
  };

  animationFrameRef.current = requestAnimationFrame(frameLoop);
};