// src/screens/UserPermissionsScreen.js
import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { updateUser } from "../api/users";
import { PERMISSIONS } from "../constants/permissions";
import styles from "../styles/permissionStyles";

export default function UserPermissionsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user: currentUser } = useAuth();
  const user = route.params?.user;
  const [selected, setSelected] = useState([]);

  const GROUPS = [
    { key: PERMISSIONS.MANAGE_USERS, label: "Manage Users" },
    { key: PERMISSIONS.MANAGE_DEVICES, label: "Manage Devices" },
    { key: PERMISSIONS.MANAGE_GEOFENCES, label: "Manage Geofences" },
    { key: PERMISSIONS.MANAGE_ALERTS, label: "Manage Alerts" },
    { key: PERMISSIONS.VIEW_DASHBOARD, label: "View Dashboard" },
    { key: PERMISSIONS.SEND_COMMANDS, label: "Send Commands" },
    { key: PERMISSIONS.RENEW_DEVICES, label: "Renew Devices" },
    { key: PERMISSIONS.MANAGE_TRACKER_MODELS, label: "Manage Tracker Models" },
  ];

  const visibleGroups = user?.role === "user"
    ? GROUPS.filter(group => ![
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.MANAGE_DEVICES,
        PERMISSIONS.RENEW_DEVICES,
        PERMISSIONS.MANAGE_TRACKER_MODELS,
      ].includes(group.key))
    : GROUPS;

  useEffect(() => {
    if (currentUser?.role !== "platform_owner") {
      navigation.goBack();
    }
  }, [currentUser]);

  useEffect(() => {
    if (user?.permissions) {
      setSelected(user.permissions);
    }
  }, [user]);

  const toggleGroup = (group) => {
    setSelected(prev => 
      prev.includes(group.key)
        ? prev.filter(p => p !== group.key)
        : [...prev, group.key]
    );
  };

  const handleSave = async () => {
    try {
      // ✅ FIXED: Use updateUser endpoint to set permissions
      await updateUser(user._id, { permissions: selected });
      Alert.alert("Success", "Permissions updated successfully");
      navigation.goBack();
    } catch (err) {
      console.log("❌ SAVE PERMISSIONS ERROR:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.error || "Failed to update permissions");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: 60 }]}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions for {user?.name}</Text>
          <View style={styles.rowWrap}>
            {visibleGroups.map(group => {
              const checked = selected.includes(group.key);
              return (
                <TouchableOpacity
                  key={group.key}
                  onPress={() => toggleGroup(group)}
                  style={[styles.permissionItem, checked && styles.permissionItemSelected]}
                >
                  <Text style={styles.permissionText}>{group.label}</Text>
                  <Switch
                    value={checked}
                    onValueChange={() => toggleGroup(group)}
                    trackColor={{ false: "#f3f3f3", true: "#26610e" }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save Permissions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}