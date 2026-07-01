// src/screens/MapScreen.js
<<<<<<< HEAD
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
=======
import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
import MapView, { Circle, Polygon, Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useAuth } from '../contexts/AuthContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { fetchDevices } from '../api/devices';
import { fetchGeofences, createGeofence, setCallGeofence, deleteGeofence } from '../api/geofences';
import { hasPermission } from '../utils/permissions';
import { PERMISSIONS } from '../constants/permissions';
import useGeofenceManager from '../hooks/useGeofenceManager';
import DeviceLayer from '../components/map/DeviceLayer';
import DeviceCarousel from '../components/map/DeviceCarousel';
import GeofenceLayer from '../components/map/GeofenceLayer';
import GeofenceActionPanel from '../components/map/GeofenceActionPanel';
import GeofenceNameModal from '../components/map/GeofenceNameModal';
import styles from '../styles/mapStyles';

export default function MapScreen() {
  const { user } = useAuth();
  const { liveDevices } = useRealtime();
  const mapRef = useRef(null);
  const [followDevice, setFollowDevice] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);
  const canManageGeofences = hasPermission(user, PERMISSIONS.MANAGE_GEOFENCES);

  const geofence = useGeofenceManager({
    selectedDeviceId,
    canManageGeofences,
    user,
  });

  const {
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
  } = geofence;

<<<<<<< HEAD
  const animateToDevice = (coord, duration = 400) => {
    if (!coord) return;
    mapRef.current?.animateCamera({ center: coord, zoom: 15.2, pitch: 45 }, { duration });
  };

  // Refresh devices when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadDevices = async () => {
        try {
          const res = await fetchDevices();
          setDevices(res.data || []);
        } catch (err) {
          console.log('❌ LOAD DEVICES ERROR:', err.message);
        }
      };
      loadDevices();

      // Re‑focus on selected device after refresh
      if (selectedDeviceId) {
        const dev = liveDevices[String(selectedDeviceId)];
        if (dev?.renderedCoordinate) {
          mapRef.current?.animateCamera(
            { center: dev.renderedCoordinate, zoom: 15.2, pitch: 45 },
            { duration: 400 }
          );
        }
      }
    }, [selectedDeviceId])
  );

  const selectedLiveDevice = liveDevices[String(selectedDeviceId)];

  // FOLLOW DEVICE – NO THROTTLE, SMOOTH 400MS ANIMATION
=======
  const animateToDevice = (coord, duration = 800) => {
    if (!coord) return;
    mapRef.current?.animateCamera({ center: coord, zoom: 15.2 }, { duration });
  };

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const res = await fetchDevices();
        setDevices(res.data || []);
      } catch (err) {
        console.log('❌ LOAD DEVICES ERROR:', err.message);
      }
    };
    loadDevices();
  }, []);

  const selectedLiveDevice = liveDevices[String(selectedDeviceId)];
  const lastCameraUpdate = useRef(0);

>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
  useEffect(() => {
    if (!followDevice || !selectedDeviceId) return;
    const device = selectedLiveDevice;
    if (!device) return;
    const coord = device.renderedCoordinate;
    if (!coord) return;
<<<<<<< HEAD

    // Immediately center the camera with a smooth animation
    mapRef.current?.animateCamera({ center: coord, zoom: 15.2, pitch: 45 }, { duration: 400 });
  }, [selectedLiveDevice?.renderedCoordinate?.latitude, selectedLiveDevice?.renderedCoordinate?.longitude, followDevice, selectedDeviceId]);
=======
    const speed = (device?.position?.speed || 0) * 3.6;
    if (speed < 5) return;
    const now = Date.now();
    if (now - lastCameraUpdate.current < 1400) return;
    lastCameraUpdate.current = now;
    mapRef.current?.animateCamera({ center: coord }, { duration: 1400 });
  }, [selectedDeviceId, selectedLiveDevice]);
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec

  const focusDevice = (deviceId) => {
    const dev = liveDevices[String(deviceId)];
    if (!dev) return;
    const coord = dev.renderedCoordinate;
    if (!coord) return;
    setSelectedDeviceId(deviceId);
    setFollowDevice(true);
<<<<<<< HEAD
    mapRef.current?.animateCamera({ center: coord, zoom: 16, pitch: 45 }, { duration: 400 });
=======
    mapRef.current?.animateCamera({ center: coord, zoom: 16 }, { duration: 900 });
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
  };

  const refreshMap = () => {
    if (selectedDeviceId) focusDevice(selectedDeviceId);
  };

  const handleSetCallGeofence = async (geofenceId) => {
    if (!selectedDeviceId) {
      Alert.alert('Error', 'No device selected');
      return;
    }
    try {
      await setCallGeofence(selectedDeviceId, geofenceId);
<<<<<<< HEAD
=======
      // Reload geofences to update call badge
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
      const res = await fetchGeofences(selectedDeviceId);
      setGeofences(res.data?.geofences || []);
      setDeviceMeta({
        callUserId: res.data?.callUserId || null,
        callGeofenceId: res.data?.callGeofenceId || null,
      });
      setSelectedGeofence(null);
      Alert.alert('Success', 'Call geofence updated');
    } catch (err) {
      console.log('❌ SET CALL ERROR:', err?.response?.data || err.message);
      Alert.alert('Error', err?.response?.data?.error || 'Failed to set call geofence');
    }
  };

  const handleDeleteGeofence = (geofenceId) => {
    Alert.alert('Delete Geofence', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteGeofence(geofenceId);
            setGeofences(prev => prev.filter(g => g._id !== geofenceId));
            setSelectedGeofence(null);
          } catch (err) {
            console.log('❌ DELETE ERROR:', err?.response?.data || err.message);
          }
        },
      },
    ]);
  };

  const handleSaveGeofence = async () => {
    if (!geofenceName.trim()) {
      alert('Name required');
      return;
    }
    try {
      let payload;
      if (drawType === 'circle') {
        payload = {
          name: geofenceName,
          type: 'circle',
          deviceId: selectedDeviceId,
          geometry: {
            center: [circleCenter.longitude, circleCenter.latitude],
            radius: circleRadius,
          },
        };
      } else if (drawType === 'polygon') {
        let coordinates = polygonCoords.map(c => [c.longitude, c.latitude]);
        if (coordinates.length > 0) {
          const first = coordinates[0];
          const last = coordinates[coordinates.length - 1];
          if (first[0] !== last[0] || first[1] !== last[1]) coordinates.push(first);
        }
        payload = {
          name: geofenceName,
          type: 'polygon',
          deviceId: selectedDeviceId,
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
        };
      }
      await createGeofence(payload);
      const res = await fetchGeofences(selectedDeviceId);
      setGeofences(res.data?.geofences || []);
      resetDrawing();
    } catch (err) {
      console.log('❌ SAVE GEOFENCE ERROR:', err.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        scrollEnabled={true}
        zoomEnabled={true}
        onPress={handleMapPress}
        onPanDrag={() => setFollowDevice(false)}
      >
        <DeviceLayer devices={devices} liveDevices={liveDevices} />
        {canManageGeofences && (
          <GeofenceLayer geofences={geofences} deviceMeta={deviceMeta} styles={styles} selectedGeofenceId={selectedGeofence?._id} />
        )}
        {drawType === 'circle' && circleCenter && circleRadius > 0 && (
          <Circle center={circleCenter} radius={circleRadius} strokeWidth={2} strokeColor="#007AFF" fillColor="rgba(0,122,255,0.22)" />
        )}
        {drawType === 'circle' && circleCenter && <Marker coordinate={circleCenter} />}
        {drawType === 'polygon' && polygonCoords.length > 0 && (
          <Polygon coordinates={polygonCoords} strokeColor="green" fillColor="rgba(0,255,0,0.25)" />
        )}
        {drawType === 'polygon' && polygonCoords.map((c, i) => <Marker key={i} coordinate={c} />)}
      </MapView>

      {!drawMode && canManageGeofences && (
        <View style={styles.geofenceButtonContainer}>
          <TouchableOpacity style={styles.drawButton} onPress={() => {
            if (!selectedDeviceId) { alert('Select device first'); return; }
            setDrawMode(true);
            setDrawType(null);
            resetCircle();
            resetPolygon();
          }}><Text style={styles.buttonText}>+ Geo</Text></TouchableOpacity>
          {selectedDeviceId && geofences.length > 0 && (
            <TouchableOpacity style={[styles.drawButton, styles.viewGeoButton]} onPress={() => setShowGeofenceList(true)}><Text style={styles.buttonText}>View Geo</Text></TouchableOpacity>
          )}
        </View>
      )}

      {drawMode && (
        <>
          <View style={styles.drawControls}>
            <TouchableOpacity style={[styles.drawOption, drawType === 'circle' && styles.activeDrawOption]} onPress={() => { setDrawType('circle'); setPolygonCoords([]); setPolygonReady(false); resetCircle(); }}>
              <Text style={styles.drawOptionText}>Circle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.drawOption, drawType === 'polygon' && styles.activeDrawOption]} onPress={() => { setDrawType('polygon'); resetCircle(); resetPolygon(); }}>
              <Text style={styles.drawOptionText}>Polygon</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={resetDrawing}><Text style={styles.drawOptionText}>Cancel</Text></TouchableOpacity>
          </View>
          <View style={styles.drawHintContainer}>
            <Text style={styles.drawHintText}>
              {drawType === 'circle' ? (circleCenter ? `Adjust radius (${circleRadius}m) and save` : 'Tap map to place circle center') :
               drawType === 'polygon' ? 'Tap map to add polygon points (min 3)' : 'Choose draw type'}
            </Text>
          </View>
          {drawType === 'circle' && circleCenter && !showNameModal && (
            <View style={styles.circleSliderContainer}>
              <Text>Radius: {circleRadius}m</Text>
              <Slider minimumValue={200} maximumValue={10000} step={10} value={circleRadius} onValueChange={setCircleRadius} />
              <TouchableOpacity style={styles.saveCircleButton} onPress={() => setShowNameModal(true)}><Text style={styles.buttonText}>Save Circle</Text></TouchableOpacity>
            </View>
          )}
          {drawType === 'polygon' && polygonReady && !showNameModal && (
            <TouchableOpacity style={styles.saveCircleButton} onPress={() => setShowNameModal(true)}><Text style={styles.buttonText}>Finish Polygon</Text></TouchableOpacity>
          )}
        </>
      )}

      <GeofenceNameModal
        visible={showNameModal} styles={styles} geofenceName={geofenceName} setGeofenceName={setGeofenceName}
        onCancel={() => { setShowNameModal(false); setGeofenceName(''); }}
        onCreate={handleSaveGeofence}
      />

      {showGeofenceList && (
        <View style={styles.geofenceListModal}>
          <Text style={styles.geofenceListTitle}>Geofences</Text>
          <ScrollView>
            {geofences.map(g => (
              <TouchableOpacity key={g._id} style={styles.geofenceListItem} onPress={() => { setSelectedGeofence(g); setShowGeofenceList(false); }}>
                <Text>{g.name}{deviceMeta.callGeofenceId === g._id ? ' 📞' : ''}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setShowGeofenceList(false)}><Text style={styles.geofenceListCloseText}>Close</Text></TouchableOpacity>
        </View>
      )}

      <GeofenceActionPanel
        selectedGeofence={selectedGeofence} drawMode={drawMode} user={user}
        onSetCall={() => handleSetCallGeofence(selectedGeofence._id)}
        onDelete={() => handleDeleteGeofence(selectedGeofence._id)}
        onClose={() => setSelectedGeofence(null)}
      />

      {!drawMode && (
        <TouchableOpacity style={styles.refreshButton} onPress={refreshMap}><Text style={styles.refreshButtonText}>↻</Text></TouchableOpacity>
      )}

      {!drawMode && (
        <DeviceCarousel devices={devices} liveDevices={liveDevices} onPress={focusDevice} styles={styles} />
      )}
    </View>
  );
}