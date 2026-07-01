import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { connectSocket } from '../services/socket';
import { useAuth } from './AuthContext';
<<<<<<< HEAD

const RealtimeContext = createContext(null);

const DEFAULT_INTERPOLATION_DURATION = 1500;
const POLL_INTERVAL = 1500; // Fetch new positions every 1.5 seconds

/**
 * Compute interpolation duration based on speed and previous speed.
 * - If stationary (speed < 1 km/h) and was also stationary before, snap instantly (duration = 0).
 * - Otherwise, adapt duration to speed: slow = 1.2s, medium = 1s, fast = 700ms.
 * - Minimum duration is 200ms to avoid jerkiness.
 */
function getInterpolationDuration(timeGapMs, speedMps, prevSpeedMps) {
  const speedKmh = speedMps * 3.6;
  const prevSpeedKmh = prevSpeedMps ? prevSpeedMps * 3.6 : 0;

  // If we are stopped and were stopped before, snap instantly
  if (speedKmh < 1 && prevSpeedKmh < 0.5) {
    return 0;
  }

  let maxDuration;
  if (speedKmh < 5) {
    maxDuration = 1200; // slow: smooth over 1.2 seconds
  } else if (speedKmh < 20) {
    maxDuration = 1000;
  } else {
    maxDuration = 700;   // fast: quick response
  }

  const duration = Math.min(timeGapMs, maxDuration);
  return Math.max(duration, 200);
}

=======
import { startFrameEngine } from '../realtime/frameEngine';
import {
  LOW_SPEED,
  GPS_NOISE_THRESHOLD,
  shortestAngle,
  getDistanceMeters,
  lerp,
  calculateVelocityVector,
} from '../realtime/frameUtils';

const RealtimeContext = createContext(null);

>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
export const RealtimeProvider = ({ children }) => {
  const { token } = useAuth();

  const devicesRef = useRef({});
<<<<<<< HEAD
  const [liveDevices, setLiveDevices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const hydrationFailedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // ------------------------------------------------------------------
  // Animation loop – runs every frame (60fps)
  // ------------------------------------------------------------------
  const animate = () => {
    const now = Date.now();
    let updated = false;

    for (const [deviceKey, device] of Object.entries(devicesRef.current)) {
      if (!device.interpolationStart || !device.targetCoordinate) continue;

      const elapsed = now - device.interpolationStart;
      const duration = device.interpolationDuration ?? DEFAULT_INTERPOLATION_DURATION;
      const progress = Math.min(elapsed / duration, 1);

      // Ease‑in‑out for natural feel
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const start = device.interpolationStartCoord || device.coordinate;
      const target = device.targetCoordinate;

      device.renderedCoordinate = {
        latitude: start.latitude + (target.latitude - start.latitude) * ease,
        longitude: start.longitude + (target.longitude - start.longitude) * ease,
      };
      device.coordinate = { ...device.renderedCoordinate };

      if (progress >= 1) {
        // Snap to target when done
        device.renderedCoordinate = { ...target };
        device.coordinate = { ...target };
        device.interpolationStart = null;
      }
      updated = true;
    }

    if (updated) {
      setLiveDevices({ ...devicesRef.current });
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // ------------------------------------------------------------------
  // Process a single position update – starts interpolation
  // ------------------------------------------------------------------
  const processPosition = (p) => {
    if (!p?.deviceId) return;
    const lat = Number(p.latitude);
    const lng = Number(p.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const deviceKey = String(p.deviceId);
    const now = Date.now();
    const speedMps = Number(p.speed || 0);

    let existing = devicesRef.current[deviceKey];

    if (!existing) {
      // First ever position – snap directly
      const coord = { latitude: lat, longitude: lng };
      devicesRef.current[deviceKey] = {
        coordinate: coord,
        renderedCoordinate: coord,
        targetCoordinate: coord,
        interpolationStartCoord: coord,
        interpolationStart: null,
        interpolationDuration: DEFAULT_INTERPOLATION_DURATION,
        renderedHeading: p.course || 0,
        speedMps,
        position: {
          ...p,
          course: p.course || 0,
          attributes: p.attributes || {},
        },
        lastReceivedTime: now,
      };
    } else {
      // Update target and start interpolation
      const target = { latitude: lat, longitude: lng };
      const prevTime = existing.lastReceivedTime || now;
      const timeGap = Math.max(now - prevTime, 50);
      const prevSpeed = existing.speedMps || 0;

      // Compute dynamic duration using speed and previous speed
      const duration = getInterpolationDuration(timeGap, speedMps, prevSpeed);

      existing.targetCoordinate = target;
      existing.interpolationStartCoord = { ...existing.renderedCoordinate };
      existing.interpolationStart = now;
      existing.interpolationDuration = duration;
      existing.renderedHeading = p.course || existing.renderedHeading;
      existing.speedMps = speedMps;
      existing.position = {
        ...p,
        course: p.course || 0,
        attributes: p.attributes || {},
      };
      existing.lastReceivedTime = now;
    }
  };

  // ------------------------------------------------------------------
  // Load initial positions (hydration)
  // ------------------------------------------------------------------
  const loadInitialPositions = async () => {
    if (hydrationFailedRef.current) return;
    try {
      const res = await axios.get(
        'https://api.trackiatech.com/api/traccar/positions/latest',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const positions = Array.isArray(res.data) ? res.data : [];
      console.log('📥 INITIAL HYDRATION:', positions.length);

      positions.forEach((p) => {
        if (!p?.deviceId) return;
        const lat = Number(p.latitude);
        const lng = Number(p.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        const deviceKey = String(p.deviceId);
        const coord = { latitude: lat, longitude: lng };
        const now = Date.now();

        if (!devicesRef.current[deviceKey]) {
          devicesRef.current[deviceKey] = {
            coordinate: coord,
            renderedCoordinate: coord,
            targetCoordinate: coord,
            interpolationStartCoord: coord,
            interpolationStart: null,
            interpolationDuration: DEFAULT_INTERPOLATION_DURATION,
            renderedHeading: p.course || 0,
            speedMps: Number(p.speed || 0),
            position: {
              ...p,
              course: p.course || 0,
              attributes: p.attributes || {},
            },
            lastReceivedTime: now,
          };
        } else {
          const existing = devicesRef.current[deviceKey];
          existing.renderedCoordinate = coord;
          existing.coordinate = coord;
          existing.targetCoordinate = coord;
          existing.interpolationStartCoord = coord;
          existing.interpolationStart = null;
          existing.renderedHeading = p.course || 0;
          existing.speedMps = Number(p.speed || 0);
          existing.position = {
            ...p,
            course: p.course || 0,
            attributes: p.attributes || {},
          };
          existing.lastReceivedTime = now;
        }
      });
      setLiveDevices({ ...devicesRef.current });
    } catch (err) {
      if (err.response?.status === 401) {
        hydrationFailedRef.current = true;
        console.log('🔴 401 on hydration – will retry after login');
      } else {
        console.log('⚠️ INITIAL HYDRATION error:', err?.message);
      }
    }
  };

  // ------------------------------------------------------------------
  // HTTP Poller – fallback in case socket fails
  // ------------------------------------------------------------------
  const fetchLatestPositions = async () => {
    try {
      const res = await axios.get(
        'https://api.trackiatech.com/api/traccar/positions/latest',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const positions = Array.isArray(res.data) ? res.data : [];
      if (positions.length > 0) {
        console.log('🔄 POLL: Received', positions.length, 'positions');
        positions.forEach(processPosition);
        // Update state after processing
        setLiveDevices({ ...devicesRef.current });
      }
    } catch (err) {
      // Ignore – fallback
    }
  };

  // ------------------------------------------------------------------
  // Socket callback
  // ------------------------------------------------------------------
  const handleSocketData = (payload) => {
    console.log('📡 Socket payload received at', new Date().toISOString());
    if (payload?.type === 'alert') {
      const alert = payload.data;
      setAlerts((prev) => {
        if (prev.find((a) => a._id === alert._id)) return prev;
        return [alert, ...prev].slice(0, 50);
      });
      return;
    }
    const positions = Array.isArray(payload) ? payload : [payload];
    positions.forEach(processPosition);
    setLiveDevices({ ...devicesRef.current });
  };

  // ------------------------------------------------------------------
  // Initialize socket and poller
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!token || typeof token !== 'string' || token.length < 20) {
      setSocketConnected(false);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    hydrationFailedRef.current = false;
    let socket;

    const init = async () => {
      await loadInitialPositions();

      // Start HTTP poller (safety net)
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(fetchLatestPositions, POLL_INTERVAL);

      // Connect socket
=======
  const animationFrameRef = useRef(null);
  const frameEngineRunning = useRef(false);
  const [liveDevices, setLiveDevices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const lastUiUpdate = useRef(0);

  useEffect(() => {
    if (!token || typeof token !== 'string' || token.length < 20) {
      setSocketConnected(false);
      return;
    }

    let socket;

    // ------------------------------------------------------------------
    // 1. Load initial positions (one‑time hydration)
    // ------------------------------------------------------------------
    const loadInitialPositions = async () => {
      try {
        const res = await axios.get(
          'https://api.trackiatech.com/api/traccar/positions/latest',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const positions = Array.isArray(res.data) ? res.data : [];

        positions.forEach((p) => {
          if (!p?.deviceId) return;
          const lat = Number(p.latitude);
          const lng = Number(p.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

          const deviceKey = String(p.deviceId);
          if (!devicesRef.current[deviceKey]) {
            devicesRef.current[deviceKey] = {
              coordinate: { latitude: lat, longitude: lng },
              renderedCoordinate: { latitude: lat, longitude: lng },
              targetCoordinate: { latitude: lat, longitude: lng },
              velocity: { vx: 0, vy: 0 },
              predictedCoordinate: { latitude: lat, longitude: lng },
              predictionStrength: 0,
              isPredicting: false,
              renderedHeading: p.course || 0,
              targetHeading: p.course || 0,
              lastFrameTime: Date.now(),
              speedMps: Number(p.speed || 0),
              lastUpdate: Date.now(),
              lastPacketTime: Date.now(),
              position: {
                ...p,
                course: p.course || 0,
                attributes: p.attributes || {},
              },
            };
          } else {
            const existing = devicesRef.current[deviceKey];
            existing.targetCoordinate = { latitude: lat, longitude: lng };
            existing.position = {
              ...existing.position,
              ...p,
              course: p.course ?? existing.position?.course ?? 0,
              attributes: p.attributes ?? existing.position?.attributes ?? {},
            };
            existing.lastUpdate = Date.now();
            existing.lastPacketTime = Date.now();
          }
        });
        console.log('✅ INITIAL HYDRATION:', positions.length);
      } catch (err) {
        console.log('⚠️ INITIAL HYDRATION (skipped):', err?.message);
      }
      setLiveDevices({ ...devicesRef.current });
    };

    // ------------------------------------------------------------------
    // 2. Process a single position update (from socket)
    // ------------------------------------------------------------------
    const processPosition = (p) => {
      if (!p?.deviceId) return;
      const lat = Number(p.latitude);
      const lng = Number(p.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const deviceKey = String(p.deviceId);
      const existing = devicesRef.current[deviceKey];

      if (!existing) {
        devicesRef.current[deviceKey] = {
          coordinate: { latitude: lat, longitude: lng },
          renderedCoordinate: { latitude: lat, longitude: lng },
          targetCoordinate: { latitude: lat, longitude: lng },
          velocity: { vx: 0, vy: 0 },
          predictedCoordinate: { latitude: lat, longitude: lng },
          predictionStrength: 0,
          isPredicting: false,
          renderedHeading: p.course || 0,
          targetHeading: p.course || 0,
          lastFrameTime: Date.now(),
          speedMps: Number(p.speed || 0),
          lastUpdate: Date.now(),
          lastPacketTime: Date.now(),
          position: {
            ...p,
            course: p.course || 0,
            attributes: p.attributes || {},
          },
        };
        return;
      }

      const packetTime = new Date(p.fixTime || p.serverTime || Date.now()).getTime();
      if (existing.lastPacketTimestamp && packetTime < existing.lastPacketTimestamp) return;
      existing.lastPacketTimestamp = packetTime;

      const current = existing.renderedCoordinate;
      const driftDistance = getDistanceMeters(current.latitude, current.longitude, lat, lng);

      existing.position = {
        ...existing.position,
        ...p,
        lastRealtimeUpdate: Date.now(),
        lastKnownSpeed: p.speed ?? existing.position?.lastKnownSpeed ?? 0,
        lastKnownCourse: p.course ?? existing.position?.lastKnownCourse ?? 0,
        course: p.course ?? existing.position?.course ?? 0,
        attributes: p.attributes ?? existing.position?.attributes ?? {},
      };

      if (driftDistance < 3) {
        const incomingHeading = Number(p.course || 0);
        const speedKmh = Number(p.speed || 0) * 3.6;
        if (speedKmh > LOW_SPEED) {
          const currentHeading = existing.targetHeading || 0;
          const diff = Math.abs(shortestAngle(currentHeading, incomingHeading));
          if (diff > 2) existing.targetHeading = incomingHeading;
        }
        return;
      }

      const previous = existing.targetCoordinate || existing.renderedCoordinate;
      const distance = getDistanceMeters(previous.latitude, previous.longitude, lat, lng);
      if (distance < GPS_NOISE_THRESHOLD) {
        existing.lastUpdate = Date.now();
        existing.lastPacketTime = Date.now();
        return;
      }

      const speedKmh = Number(p.speed || 0) * 3.6;
      let filteredLat = lat, filteredLng = lng;
      if (speedKmh < LOW_SPEED) {
        filteredLat = lerp(previous.latitude, lat, 0.45);
        filteredLng = lerp(previous.longitude, lng, 0.45);
      }

      const incomingHeading = Number(p.course || 0);
      existing.targetCoordinate = {
        latitude: lerp(previous.latitude, filteredLat, 0.65),
        longitude: lerp(previous.longitude, filteredLng, 0.65),
      };

      existing.speedMps = Number(p.speed || 0);
      existing.velocity = calculateVelocityVector(lat, lng, speedKmh, incomingHeading);
      existing.predictionStrength = 1;
      existing.isPredicting = true;
      existing.predictedCoordinate = { latitude: lat, longitude: lng };

      if (speedKmh > LOW_SPEED) {
        const currentHeading = existing.targetHeading || 0;
        const diff = Math.abs(shortestAngle(currentHeading, incomingHeading));
        if (diff > 2) existing.targetHeading = incomingHeading;
      }

      existing.lastUpdate = Date.now();
      existing.lastPacketTime = Date.now();
    };

    // ------------------------------------------------------------------
    // 3. Socket callback handler
    // ------------------------------------------------------------------
    const handleSocketData = (payload) => {
      if (payload?.type === 'alert') {
        const alert = payload.data;
        setAlerts((prev) => {
          if (prev.find((a) => a._id === alert._id)) return prev;
          return [alert, ...prev].slice(0, 50);
        });
        return;
      }

      const positions = Array.isArray(payload) ? payload : [payload];
      positions.forEach(processPosition);
    };

    // ------------------------------------------------------------------
    // 4. Initialize (no polling)
    // ------------------------------------------------------------------
    const init = async () => {
      await loadInitialPositions();
      startFrameEngine({
        devicesRef,
        animationFrameRef,
        frameEngineRunning,
        lastUiUpdate,
        setLiveDevices,
      });
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
      socket = connectSocket(token, handleSocketData);
      setSocketConnected(true);
    };

    init();

    return () => {
<<<<<<< HEAD
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
=======
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      frameEngineRunning.current = false;
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
      if (socket) {
        socket.off?.('positions');
        socket.off?.('alert');
        socket.disconnect?.();
      }
      setSocketConnected(false);
    };
  }, [token]);

<<<<<<< HEAD
  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
  return (
    <RealtimeContext.Provider value={{ liveDevices, alerts, socketConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) throw new Error('useRealtime must be used within RealtimeProvider');
  return context;
};