// src/screens/HistoryScreen.js
import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { fetchDevices } from "../api/devices";
import { getHistory } from "../api/traccar";
import { useApi } from "../api/client";
import { useRealtime } from "../contexts/RealtimeContext";
import PlaybackPickers from "../components/history/PlaybackPickers";
import PlaybackPanel from "../components/history/PlaybackPanel";
import HistoryVehicleCarousel from "../components/history/HistoryVehicleCarousel";
import useTripDetail from "../hooks/useTripDetail";
import usePlayback from "../hooks/usePlayback";
import styles from "../styles/historyStyles";

// Dedicated History Marker – separates history from live map
const HistoryMarker = ({ coordinate, rotation, playbackStatus }) => {
  if (!coordinate) return null;
  const icon = playbackStatus === "Stopped"
    ? require("../assets/caridle.png")
    : require("../assets/carg.png");
  return (
    <Marker
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      rotation={rotation || 0}
      tracksViewChanges={true}
      zIndex={10}
    >
      <Image source={icon} resizeMode="contain" style={{ width: 44, height: 44 }} />
    </Marker>
  );
};

export default function HistoryScreen() {
  const api = useApi();
  const mapRef = useRef(null);
  const { liveDevices } = useRealtime();

  const [devices, setDevices] = useState({});
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [history, setHistory] = useState([]);
  const [playbackLoading, setPlaybackLoading] = useState(false);
  const [tripLoading, setTripLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("playback");
  const [playbackMode, setPlaybackMode] = useState(null);
  const [playbackStarted, setPlaybackStarted] = useState(false);
  const [showPlaybackDate, setShowPlaybackDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    playbackIndex, setPlaybackIndex,
    isPlaying, setIsPlaying,
    speed, setSpeed,
    markerRotation, playbackStatus, currentPoint, interpolatedCoord,
    resetPlaybackEngine,
  } = usePlayback({ history, mapRef });

  const tripTab = useTripDetail({
    api,
    mapRef,
    selectedDeviceId,
    styles,
    setTripLoading,
  });

  // Reset playback engine and clear history, but NEVER change the date unless resetDate = true
  const resetPlayback = ({ resetDate = false } = {}) => {
    resetPlaybackEngine();
    setHistory([]);
    setPlaybackStarted(false);
    setPlaybackMode(null);
    setPlaybackLoading(false);
    setShowPlaybackDate(false);
    if (resetDate) {
      setSelectedDate(new Date());
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    resetPlayback({ resetDate: true });
  }, [activeTab]);

  const loadDevices = async () => {
    try {
      const res = await fetchDevices();
      const list = Array.isArray(res.data) ? res.data : [];
      const mapped = {};
      list.forEach((d) => { mapped[d.traccarId] = d; });
      setDevices(mapped);
      if (list.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(list[0].traccarId);
      }
    } catch (err) {
      console.log("❌ LOAD DEVICES:", err.message);
    }
  };

  const loadPlaybackHistory = async (fromDate, toDate, mode) => {
    if (!selectedDeviceId) return;
    setPlaybackLoading(true);
    try {
      const res = await getHistory(selectedDeviceId, fromDate.toISOString(), toDate.toISOString(), 30000);
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      console.log(`📜 History loaded: ${data.length} positions for device ${selectedDeviceId}`);
      if (data.length === 0) {
        setHistory([]);
        if (mode !== "old") {
          resetPlayback({ resetDate: true });
        } else {
          setPlaybackStarted(true);
        }
        Alert.alert("No Data", "No positions found for this date.");
        return;
      }
      setHistory(data);
      setPlaybackIndex(0);
      setIsPlaying(true);
      mapRef.current?.animateCamera(
        { center: { latitude: data[0].latitude, longitude: data[0].longitude }, zoom: 17, pitch: 45 },
        { duration: 800 }
      );
    } catch (err) {
      console.error("❌ HISTORY ERROR:", err.message);
      if (mode !== "old") {
        resetPlayback({ resetDate: true });
      } else {
        setPlaybackStarted(true);
      }
      Alert.alert("Error", err.message || "Failed to load history. Please try again.");
    } finally {
      setPlaybackLoading(false);
    }
  };

  const handlePlaybackDate = async (selectedDate) => {
    if (!selectedDeviceId) return;
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    const start = new Date(Date.UTC(year, month, day, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
    setSelectedDate(selectedDate);
    setPlaybackMode("old");
    setPlaybackStarted(true);
    await loadPlaybackHistory(start, end, "old");
  };

  const showPlaybackMarker = activeTab === "playback" && currentPoint;
  const hideCarousel = (activeTab === "playback" && history.length > 0) || (activeTab === "trip" && tripTab.tripData);

  return (
    <View style={styles.container}>
      <View style={styles.tabWrapper}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === "playback" && styles.activeTab]} onPress={() => setActiveTab("playback")}>
          <Text style={styles.tabText}>Playback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === "trip" && styles.activeTab]} onPress={() => setActiveTab("trip")}>
          <Text style={styles.tabText}>Trip Detail</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "playback" && (
        <View style={styles.topControls}>
          <View style={styles.modeRow}>
            {!playbackStarted ? (
              <>
                <TouchableOpacity
                  style={[styles.modeBtn, playbackMode === "today" && styles.activeMode]}
                  onPress={async () => {
                    if (!selectedDeviceId) return;
                    setPlaybackMode("today");
                    resetPlayback();
                    const now = new Date();
                    const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
                    const end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));
                    setSelectedDate(now);
                    setPlaybackStarted(true);
                    await loadPlaybackHistory(start, end, "today");
                  }}
                >
                  <Text style={styles.modeText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeBtn, playbackMode === "old" && styles.activeMode]}
                  onPress={() => {
                    setPlaybackMode("old");
                    setShowPlaybackDate(true);
                  }}
                >
                  <Text style={styles.modeText}>Previous</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.modeBtn} onPress={() => resetPlayback({ resetDate: true })}>
                <Text style={styles.modeText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {activeTab === "trip" && tripTab.controls}

      <MapView ref={mapRef} style={styles.map} initialRegion={{ latitude: 31.267, longitude: 72.359, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
        {history.length > 0 && (
          <Polyline
            coordinates={[
              ...history.slice(0, playbackIndex + 1).map(p => ({ latitude: p.latitude, longitude: p.longitude })),
              ...(interpolatedCoord ? [interpolatedCoord] : []),
            ]}
            strokeColor="#22c55e"
            strokeWidth={4}
          />
        )}
        {activeTab === "trip" && tripTab.overlays}

        {showPlaybackMarker && (
          <HistoryMarker
            coordinate={interpolatedCoord || { latitude: currentPoint.latitude, longitude: currentPoint.longitude }}
            rotation={markerRotation}
            playbackStatus={playbackStatus}
          />
        )}
      </MapView>

      {(playbackLoading || tripLoading) && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.35)" }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 12, fontSize: 16, fontWeight: "600" }}>
            {playbackLoading ? "Loading Playback..." : "Loading Trip Details..."}
          </Text>
        </View>
      )}

      {activeTab === "playback" && currentPoint && (
        <View style={styles.floatingSpeed}>
          <Text style={styles.floatingSpeedText}>
            {playbackStatus ? playbackStatus : `${Math.round(currentPoint.speed * 1.852)} km/h`}
          </Text>
        </View>
      )}

      {!hideCarousel && (
        <HistoryVehicleCarousel
          styles={styles}
          devices={devices}
          liveDevices={liveDevices}
          selectedDeviceId={selectedDeviceId}
          setSelectedDeviceId={setSelectedDeviceId}
        />
      )}

      {activeTab === "playback" && history.length > 0 && (
        <PlaybackPanel
          styles={styles}
          history={history}
          playbackIndex={playbackIndex}
          setPlaybackIndex={setPlaybackIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
          currentPoint={currentPoint}
        />
      )}

      {activeTab === "trip" && tripTab.analytics}

      <PlaybackPickers
        showPlaybackDate={showPlaybackDate}
        playbackDate={selectedDate}
        setShowPlaybackDate={setShowPlaybackDate}
        setPlaybackDate={setSelectedDate}
        onSelectDate={handlePlaybackDate}
      />

      {tripTab.pickers}
    </View>
  );
}