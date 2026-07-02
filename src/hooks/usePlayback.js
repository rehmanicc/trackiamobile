import { useEffect, useState, useRef } from 'react';
import { toKmh } from '../utils/speed';

export default function usePlayback({ history, mapRef }) {
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [markerRotation, setMarkerRotation] = useState(0);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [interpolatedCoord, setInterpolatedCoord] = useState(null);
  const animationFrameRef = useRef(null);
  const segmentStartTimeRef = useRef(0);
  const headingRef = useRef(0);
  const cameraThrottleRef = useRef(0);
  const interpolatedCoordRef = useRef(null);
  const markerRotationRef = useRef(0);

  const currentPoint = history[playbackIndex] || history[0];

  const resetPlaybackEngine = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    markerRotationRef.current = 0;
    headingRef.current = 0;
    setPlaybackIndex(0);
    setIsPlaying(false);
    setMarkerRotation(0);
    setPlaybackStatus(null);
    setInterpolatedCoord(null);
  };

  const getRotation = (start, end) => {
    const course = Number(end?.course);
    if (Number.isFinite(course)) return course;
    return markerRotationRef.current;
  };

  const getDistanceMeters = (start, end) => {
    const R = 6371000;
    const dLat = (end.latitude - start.latitude) * Math.PI / 180;
    const dLon = (end.longitude - start.longitude) * Math.PI / 180;
    const lat1 = start.latitude * Math.PI / 180;
    const lat2 = end.latitude * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    if (!isPlaying || history.length === 0) return;

    let currentIndex = playbackIndex;

    const animateSegment = () => {
      if (currentIndex >= history.length - 1) {
        setIsPlaying(false);
        return;
      }

      const start = history[currentIndex];
      const end = history[currentIndex + 1];
      const currentSpeed = toKmh(end?.speed || 0);
      const isStopped = currentSpeed < 1;

      const startLat = start.latitude;
      const startLng = start.longitude;
      const endLat = end.latitude;
      const endLng = end.longitude;
      let targetHeading = getRotation(start, end);

      const realGap = new Date(end.deviceTime) - new Date(start.deviceTime);

      let duration;
      if (isStopped) {
        if (realGap > 30000) {
          duration = 0;
        } else {
          duration = 150;
        }
      } else {
        duration = Math.max(300, Math.min(realGap / (12 * speed), 1400));
      }

      if (duration === 0) {
        interpolatedCoordRef.current = { latitude: endLat, longitude: endLng };
        headingRef.current = targetHeading;
        markerRotationRef.current = targetHeading;
        setInterpolatedCoord(interpolatedCoordRef.current);
        setMarkerRotation(markerRotationRef.current);
        currentIndex++;
        setPlaybackIndex(currentIndex);
        animateSegment();
        return;
      }

      segmentStartTimeRef.current = performance.now();

      const step = (now) => {
        let progress = (now - segmentStartTimeRef.current) / duration;
        if (progress > 1) progress = 1;

        const latitude = startLat + (endLat - startLat) * progress;
        const longitude = startLng + (endLng - startLng) * progress;

        interpolatedCoordRef.current = { latitude, longitude };
        headingRef.current = targetHeading;
        markerRotationRef.current = headingRef.current;
        setInterpolatedCoord(interpolatedCoordRef.current);
        setMarkerRotation(markerRotationRef.current);

        if (now - cameraThrottleRef.current > 220) {
          cameraThrottleRef.current = now;
          mapRef.current?.animateCamera(
            { center: { latitude, longitude }, zoom: 15, pitch: 45 },
            { duration: 350 }
          );
        }

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          currentIndex++;
          setPlaybackIndex(currentIndex);
          animateSegment();
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animateSegment();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, history, speed, playbackIndex]);

  return {
    playbackIndex, setPlaybackIndex,
    isPlaying, setIsPlaying,
    speed, setSpeed,
    markerRotation,
    playbackStatus,
    currentPoint,
    interpolatedCoord,
    resetPlaybackEngine,
  };
}