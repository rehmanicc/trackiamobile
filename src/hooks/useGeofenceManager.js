import { useState, useEffect } from 'react';
import { fetchGeofences, setCallGeofence, deleteGeofence } from '../api/geofences';

export default function useGeofenceManager({ api, selectedDeviceId, canManageGeofences, user }) {
  const [geofences, setGeofences] = useState([]);
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [drawMode, setDrawMode] = useState(false);
  const [drawType, setDrawType] = useState(null);
  const [circleCenter, setCircleCenter] = useState(null);
  const [circleRadius, setCircleRadius] = useState(100);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [polygonReady, setPolygonReady] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [geofenceName, setGeofenceName] = useState('');
  const [showGeofenceList, setShowGeofenceList] = useState(false);
  const [deviceMeta, setDeviceMeta] = useState({ callUserId: null, callGeofenceId: null });

  const resetCircle = () => {
    setCircleCenter(null);
    setCircleRadius(100);
  };

  const resetPolygon = () => {
    setPolygonCoords([]);
    setPolygonReady(false);
  };

  const resetDrawing = () => {
    setDrawMode(false);
    setDrawType(null);
    resetCircle();
    resetPolygon();
    setShowNameModal(false);
    setGeofenceName('');
  };

  const handleMapPress = (e) => {
    const coord = e?.nativeEvent?.coordinate;
    if (!coord) return;

    if (drawMode && drawType === 'polygon') {
      const updated = [...polygonCoords, coord];
      setPolygonCoords(updated);
      if (updated.length >= 3) setPolygonReady(true);
      return;
    }

    if (drawMode && drawType === 'circle' && !circleCenter) {
      setCircleCenter(coord);
      setCircleRadius(100);
    }
  };

  useEffect(() => {
    if (!selectedDeviceId || !canManageGeofences) return;

    const load = async () => {
      try {
        const res = await fetchGeofences(selectedDeviceId);
        setGeofences(res.data?.geofences || []);
        setDeviceMeta({
          callUserId: res.data?.callUserId || null,
          callGeofenceId: res.data?.callGeofenceId || null,
        });
      } catch (err) {
        console.log('❌ LOAD GEOFENCE:', err.message);
      }
    };
    load();
  }, [selectedDeviceId, canManageGeofences]);

  return {
    geofences, setGeofences,
    selectedGeofence, setSelectedGeofence,
    drawMode, setDrawMode,
    drawType, setDrawType,
    circleCenter, circleRadius, setCircleRadius,
    polygonCoords, polygonReady,
    showNameModal, setShowNameModal,
    geofenceName, setGeofenceName,
    showGeofenceList, setShowGeofenceList,
    deviceMeta, setDeviceMeta,
    resetCircle, resetPolygon, resetDrawing,
    handleMapPress,
  };
}