import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../utils/permissions";
import { PERMISSIONS } from "../constants/permissions";
import { fetchTrackerModels, deleteTrackerModel } from "../api/trackers";
import styles from "../styles/userStyles";

export default function TrackerModelScreen() {
  const navigation = useNavigation();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trackers, setTrackers] = useState([]);

  const canManageTrackers = currentUser?.role === "platform_owner" || hasPermission(currentUser, PERMISSIONS.MANAGE_TRACKER_MODELS);

  const loadTrackers = async () => {
    try {
      setLoading(true);
      const res = await fetchTrackerModels();
      setTrackers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      Alert.alert("Error", "Failed to load trackers");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(React.useCallback(() => { loadTrackers(); }, []));

  const handleDelete = (tracker) => {
    Alert.alert("Delete Tracker Model", `Delete "${tracker.brand} • ${tracker.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await deleteTrackerModel(tracker._id);
          Alert.alert("Success", "Tracker model deleted");
          loadTrackers();
        } catch (err) {
          Alert.alert("Error", err?.response?.data?.error || "Failed to delete");
        }
      }},
    ]);
  };

  if (!canManageTrackers) return null;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <Text style={styles.title}>Tracker Models</Text>
        <Text style={styles.subtitle}>Manage tracker models</Text>
        {trackers.map(tracker => (
          <View key={tracker._id} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: "600", color: "#0F172A" }}>
                  {tracker.brand} • {tracker.name}
                </Text>
                {tracker.supportsEngineControl && (
                  <MaterialCommunityIcons name="engine" size={20} color="#22C55E" style={{ marginLeft: 6 }} />
                )}
              </View>
              <View style={styles.actionColumn}>
                {canManageTrackers && (
                  <TouchableOpacity style={[styles.iconBtn, styles.iconEdit]} onPress={() => navigation.navigate("TrackerModelForm", { tracker })}>
                    <Ionicons name="create-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
                {currentUser?.role === "platform_owner" && (
                  <TouchableOpacity style={[styles.iconBtn, styles.iconDelete]} onPress={() => handleDelete(tracker)}>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {canManageTrackers && (
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("TrackerModelForm")}>
            <Text style={styles.fabText}>+ Tracker</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}