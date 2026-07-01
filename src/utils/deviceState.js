import { toKmh } from './speed';

export const getDeviceState = (device) => {
  // If the device has an explicit 'online' flag from backend, use it.
  // Otherwise, fall back to timestamp-based check (old behavior).
  const isOnline = device.online !== undefined ? device.online : (() => {
    const position = device?.position || {};
    const lastUpdate = position?.lastRealtimeUpdate || position?.deviceTime;
    const diff = lastUpdate ? (Date.now() - new Date(lastUpdate).getTime()) / 1000 : 999999;
    return diff <= 180;
  })();

  if (!isOnline) return "OFFLINE";

  const position = device?.position || {};
  const speed = toKmh(position?.lastKnownSpeed ?? position?.speed ?? 0);
  const attrs = position?.attributes || {};
  const ignition = attrs.ignition;
  const acc = attrs.acc;
  const motion = attrs.motion;

  const engineOn =
    ignition === true || ignition === 1 || ignition === "1" ||
    acc === true || acc === 1 || acc === "1" ||
    motion === true || motion === 1 || motion === "1";

  
  if (speed >= 5) return "MOVING";

  
  if (engineOn || speed > 0) return "IDLE";

  return "PARKED";
};