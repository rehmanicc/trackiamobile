import React, { useCallback, useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useRealtime } from "../contexts/RealtimeContext";
import { fetchCriticalAlerts } from "../api/alerts";
import { getDashboardStats } from "../api/analytics";
import { hasPermission } from "../utils/permissions";
import { PERMISSIONS } from "../constants/permissions";
import { useNavigation } from "@react-navigation/native";
import dashboardStyles from "../styles/dashboardStyles";
import StatCard from "../components/dashboard/StatCard";
import VehiclePieChart from "../components/dashboard/VehiclePieChart";
import RecentAlertsCard from "../components/dashboard/RecentAlertsCard";

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { liveDevices, alerts: realtimeAlerts } = useRealtime();
  const [stats, setStats] = useState({ totalVehicles: 0, movingVehicles: 0, stoppedVehicles: 0, expiredVehicles: 0 });
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const realtimeDevices = Array.isArray(liveDevices) ? liveDevices : Object.values(liveDevices || {});
  const realtimeStats = {
    totalVehicles: realtimeDevices.length,
    movingVehicles: realtimeDevices.filter(d => (d?.position?.speed || 0) * 3.6 > 5).length,
    stoppedVehicles: realtimeDevices.filter(d => (d?.position?.speed || 0) * 3.6 <= 5).length,
  };

  // Add "CALL_REQUIRED" to critical alerts filter
  const mergedCriticalAlerts = (realtimeAlerts || []).filter(a =>
    ["BATTERY_DISCONNECTED", "GEOFENCE_EXIT", "DEVICE_EXPIRY", "CALL_REQUIRED"].includes(a.type)
  );

  // Sort and limit to latest 5 critical alerts
  const criticalAlertsToShow = useMemo(() => {
    const alerts = mergedCriticalAlerts.length > 0 ? mergedCriticalAlerts : criticalAlerts;
    return alerts
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  }, [mergedCriticalAlerts, criticalAlerts]);

  const fetchDashboardStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.log("❌ Dashboard stats error:", error?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadCriticalAlerts = async () => {
    try {
      const res = await fetchCriticalAlerts();
      setCriticalAlerts(res.data || []);
    } catch (err) {
      console.log("❌ Critical alerts load failed:", err?.message);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    loadCriticalAlerts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardStats(), loadCriticalAlerts()]);
  }, []);

  if (loading) {
    return <View style={dashboardStyles.loaderContainer}><ActivityIndicator size="large" color="#C0C7D1" /></View>;
  }

  return (
    <ScrollView
      style={dashboardStyles.container}
      contentContainerStyle={dashboardStyles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C0C7D1" />}
      showsVerticalScrollIndicator={false}
    >
      <View style={dashboardStyles.header}>
        <View>
          <Text style={dashboardStyles.greeting}>{user?.name || "Dashboard"}</Text>
          <Text style={dashboardStyles.subGreeting}>{String(user?.role || "").toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={dashboardStyles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={22} color="#665f5f" />
        </TouchableOpacity>
      </View>

      <View style={dashboardStyles.statsGrid}>
        <StatCard title="Total Vehicles" value={realtimeStats.totalVehicles} color="#1d95b9" icon={<MaterialCommunityIcons name="truck-outline" size={26} color="#FFFFFF" />} />
        <StatCard title="Moving" value={realtimeStats.movingVehicles} color="#1DB954" icon={<Ionicons name="speedometer-outline" size={26} color="#FFFFFF" />} />
        <StatCard title="Stopped" value={realtimeStats.stoppedVehicles} color="#FF9800" icon={<MaterialCommunityIcons name="pause-circle-outline" size={26} color="#FFFFFF" />} />
        <StatCard title="Expired" value={stats.expiredVehicles} color="#F44336" icon={<MaterialCommunityIcons name="alert-circle-outline" size={26} color="#FFFFFF" />} />
      </View>

      <VehiclePieChart moving={Number(realtimeStats.movingVehicles || 0)} stopped={Number(realtimeStats.stoppedVehicles || 0)} expired={Number(stats.expiredVehicles || 0)} />

      <RecentAlertsCard alerts={criticalAlertsToShow} />

      <View style={dashboardStyles.quickActionsCard}>
        <Text style={dashboardStyles.quickActionsTitle}>Quick Actions</Text>
        <View style={dashboardStyles.quickActionsRow}>
          <TouchableOpacity style={dashboardStyles.quickButton} onPress={() => navigation.navigate("Devices")}>
            <View style={[dashboardStyles.quickActionIcon, { backgroundColor: "#1d95b9" }]}><Ionicons name="car-outline" size={24} color="#FFFFFF" /></View>
            <Text style={dashboardStyles.quickButtonText}>Vehicles</Text>
          </TouchableOpacity>
          {hasPermission(user, PERMISSIONS.MANAGE_USERS) && (
            <TouchableOpacity style={dashboardStyles.quickButton} onPress={() => navigation.navigate("Users")}>
              <View style={[dashboardStyles.quickActionIcon, { backgroundColor: "#1db954" }]}><Ionicons name="people-outline" size={24} color="#FFFFFF" /></View>
              <Text style={dashboardStyles.quickButtonText}>Users</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={dashboardStyles.quickButton} onPress={() => navigation.navigate("Map")}>
            <View style={[dashboardStyles.quickActionIcon, { backgroundColor: "#FF9800" }]}><Ionicons name="map-outline" size={24} color="#FFFFFF" /></View>
            <Text style={dashboardStyles.quickButtonText}>Live Map</Text>
          </TouchableOpacity>
          {(user?.role === "platform_owner" || hasPermission(user, PERMISSIONS.MANAGE_TRACKER_MODELS)) && (
            <TouchableOpacity style={dashboardStyles.quickButton} onPress={() => navigation.navigate("TrackerModels")}>
              <View style={[dashboardStyles.quickActionIcon, { backgroundColor: "#F44336" }]}><MaterialCommunityIcons name="radar" size={20} color="#FFFFFF" /></View>
              <Text style={dashboardStyles.quickButtonText}>Trackers</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}