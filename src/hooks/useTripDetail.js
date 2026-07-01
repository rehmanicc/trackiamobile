import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Marker, Polyline } from 'react-native-maps';
import TripDetails from '../components/history/TripDetails';
import TripPickers from '../components/history/TripPickers';
import { toKmh } from '../utils/speed';

export default function useTripDetail({ api, mapRef, selectedDeviceId, styles, setTripLoading }) {
  const [tripData, setTripData] = useState(null);
  const [tripMode, setTripMode] = useState(null);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customTripDate, setCustomTripDate] = useState(null);

  const calculateStats = (positions) => {
    if (!positions || positions.length < 2) {
      return { distance: 0, avgSpeed: 0, maxSpeed: 0, stops: 0, fuelUsed: 0 };
    }
    let distance = 0, maxSpeed = 0, speedSum = 0, movingPoints = 0, stops = 0;
    for (let i = 1; i < positions.length; i++) {
      const p1 = positions[i - 1];
      const p2 = positions[i];
      const R = 6371;
      const dLat = (p2.latitude - p1.latitude) * Math.PI / 180;
      const dLon = (p2.longitude - p1.longitude) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(p1.latitude * Math.PI / 180) * Math.cos(p2.latitude * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
      distance += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const speed = toKmh(p2.speed);
      maxSpeed = Math.max(maxSpeed, speed);
      if (speed > 2) { speedSum += speed; movingPoints++; }
      if (speed < 2) stops++;
    }
    return { distance, avgSpeed: movingPoints ? speedSum / movingPoints : 0, maxSpeed, stops, fuelUsed: distance / 12 };
  };

  const loadTripByDates = async (from, to) => {
    if (!selectedDeviceId) return;
    setTripLoading(true);
    try {
      const res = await api.get('/traccar/route', { params: { deviceId: selectedDeviceId, from: from.toISOString(), to: to.toISOString() } });
      const positions = Array.isArray(res.data) ? res.data : [];
      if (positions.length === 0) { setTripData(null); return; }
      setTripData({ positions, stats: calculateStats(positions) });
      mapRef.current?.fitToCoordinates(positions.map(p => ({ latitude: p.latitude, longitude: p.longitude })), {
        edgePadding: { top: 120, right: 60, bottom: 250, left: 60 }, animated: true,
      });
    } catch (err) { console.log('❌ TRIP ERROR:', err); }
    finally { setTripLoading(false); }
  };

  const handleTodayTrip = async () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    setTripMode('today');
    await loadTripByDates(start, now);
  };

  const handleWeekTrip = async () => {
    const now = new Date();
    const start = new Date(); start.setDate(now.getDate() - 7); start.setHours(0,0,0,0);
    setTripMode('week');
    await loadTripByDates(start, now);
  };

  const handleMonthTrip = async () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    setTripMode('month');
    await loadTripByDates(start, now);
  };

  const handleCustomTripDate = async (selectedDate) => {
    const start = new Date(selectedDate); start.setHours(0,0,0,0);
    const end = new Date(selectedDate); end.setHours(23,59,59,999);
    setTripMode('custom');
    await loadTripByDates(start, end);
  };

  const controls = (
    <View style={[styles.tripControls, tripData && { display: 'none' }]}>
      <View style={styles.modeRow}>
        <TouchableOpacity style={[styles.modeBtn, tripMode === 'today' && styles.activeMode]} onPress={handleTodayTrip}><Text style={styles.modeText}>Today</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.modeBtn, tripMode === 'week' && styles.activeMode]} onPress={handleWeekTrip}><Text style={styles.modeText}>Last Week</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.modeBtn, tripMode === 'month' && styles.activeMode]} onPress={handleMonthTrip}><Text style={styles.modeText}>Month</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.modeBtn, tripMode === 'custom' && styles.activeMode]} onPress={() => setShowCustomDate(true)}><Text style={styles.modeText}>Custom</Text></TouchableOpacity>
      </View>
    </View>
  );

  const overlays = (
    <>
      {tripData?.positions?.length > 0 && (
        <>
          <Polyline coordinates={tripData.positions.map(p => ({ latitude: p.latitude, longitude: p.longitude }))} strokeColor="#3b82f6" strokeWidth={4} />
          <Marker coordinate={{ latitude: tripData.positions[0].latitude, longitude: tripData.positions[0].longitude }} pinColor="green" />
          <Marker coordinate={{ latitude: tripData.positions[tripData.positions.length-1].latitude, longitude: tripData.positions[tripData.positions.length-1].longitude }} pinColor="red" />
        </>
      )}
    </>
  );

  const analytics = <TripDetails tripData={tripData} setTripData={setTripData} setTripMode={setTripMode} setCustomTripDate={setCustomTripDate} styles={styles} />;
  const pickers = <TripPickers showCustomDate={showCustomDate} customTripDate={customTripDate} setShowCustomDate={setShowCustomDate} setCustomTripDate={setCustomTripDate} onSelectDate={handleCustomTripDate} />;

  return { tripData, controls, overlays, analytics, pickers };
}