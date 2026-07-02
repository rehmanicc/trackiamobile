import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { connectSocket } from '../services/socket';
import { useAuth } from './AuthContext';

const RealtimeContext = createContext(null);

const DEFAULT_INTERPOLATION_DURATION = 1500;
const POLL_INTERVAL = 1500; // Fetch new positions every 1.5 seconds

function getInterpolationDuration(timeGapMs, speedMps, prevSpeedMps) {
  const speedKmh = speedMps * 3.6;
  const prevSpeedKmh = prevSpeedMps ? prevSpeedMps * 3.6 : 0;

  if (speedKmh < 1 && prevSpeedKmh < 0.5) {
    return 0;
  }

  let maxDuration;
  if (speedKmh < 5) {
    maxDuration = 1200;
  } else if (speedKmh < 20) {
    maxDuration = 1000;
  } else {
    maxDuration = 700;
  }

  const duration = Math.min(timeGapMs, maxDuration);
  return Math.max(duration, 200);
}

export const RealtimeProvider = ({ children }) => {
  const { token } = useAuth();

  const devicesRef = useRef({});
  const [liveDevices, setLiveDevices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const hydrationFailedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const animate = () => {
    const now = Date.now();
    let updated = false;

    for (const [deviceKey, device] of Object.entries(devicesRef.current)) {
      if (!device.interpolationStart || !device.targetCoordinate) continue;

      const elapsed = now - device.interpolationStart;
      const duration = device.interpolationDuration ?? DEFAULT_INTERPOLATION_DURATION;
      const progress = Math.min(elapsed / duration, 1);

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
      const target = { latitude: lat, longitude: lng };
      const prevTime = existing.lastReceivedTime || now;
      const timeGap = Math.max(now - prevTime, 50);
      const prevSpeed = existing.speedMps || 0;

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
        setLiveDevices({ ...devicesRef.current });
      }
    } catch (err) {
      // Ignore – fallback
    }
  };

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
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(fetchLatestPositions, POLL_INTERVAL);
      socket = connectSocket(token, handleSocketData);
      setSocketConnected(true);
    };

    init();

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      if (socket) {
        socket.off?.('positions');
        socket.off?.('alert');
        socket.disconnect?.();
      }
      setSocketConnected(false);
    };
  }, [token]);

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