import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Switch } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { fetchDevices, updateDevicePermissions } from "../api/devices";
import { fetchUsers } from "../api/users";
import styles from "../styles/userStyles";

export default function DeviceAccessScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user: currentUser } = useAuth();
  const device = route.params?.device;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [ownerUserId, setOwnerUserId] = useState(null);
  const [callUserId, setCallUserId] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  useEffect(() => {
    loadDevice();
  }, []);

  const loadDevice = async () => {
    try {
      setLoading(true);
      const res = await fetchDevices();
      const freshDevice = res.data.find(d => d._id === device?._id);
      if (!freshDevice) {
        Alert.alert("Error", "Device not found");
        navigation.goBack();
        return;
      }
      setAssignedUsers(freshDevice.assignedUsers || []);
      setOwnerUserId(freshDevice.ownerUserId?._id || freshDevice.ownerUserId || null);
      setCallUserId(freshDevice.callUserId?._id || freshDevice.callUserId || null);
      setPermissions(freshDevice.devicePermissions || []);
    } catch (err) {
      console.log("❌ DEVICE ACCESS ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to load device");
    } finally {
      setLoading(false);
    }
  };

  const getPermission = (userId) => {
    const existing = permissions.find(p => String(p.userId) === String(userId));
    return existing || {
      userId,
      engineControl: false,
      editSpeedLimit: false,
      editFuelAverage: false,
      editOilChangeReading: false,
      editOilChangeLimit: false,
      editCallNumber: false,
    };
  };

  const updatePermission = (userId, field, value) => {
    setPermissions(prev => {
      const copy = [...prev];
      const index = copy.findIndex(p => String(p.userId) === String(userId));
      if (index >= 0) {
        copy[index] = { ...copy[index], [field]: value };
      } else {
        copy.push({
          userId,
          engineControl: false,
          editSpeedLimit: false,
          editFuelAverage: false,
          editOilChangeReading: false,
          editOilChangeLimit: false,
          editCallNumber: false,
          [field]: value,
        });
      }
      return copy;
    });
  };

  const handleOwnerChange = (user) => {
    const isOwner = String(ownerUserId) === String(user._id);
    Alert.alert(
      isOwner ? "Remove Vehicle Owner" : "Change Vehicle Owner",
      isOwner ? `${user.name} will no longer be vehicle owner.` : `${user.name} will become vehicle owner.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => setOwnerUserId(isOwner ? null : user._id) },
      ]
    );
  };

  const handleCallUserChange = (user) => {
    const isCallUser = String(callUserId) === String(user._id);
    Alert.alert(
      isCallUser ? "Remove Call User" : "Change Call User",
      isCallUser ? `${user.name} will no longer be call user.` : `${user.name} will become call user.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => setCallUserId(isCallUser ? null : user._id) },
      ]
    );
  };

  const renderPermissionRow = (label, value, onChange, disabled = false) => (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.permissionItem, value && styles.permissionItemSelected]}
      onPress={() => !disabled && onChange(!value)}
    >
      <Text style={styles.permissionText}>{label}</Text>
      <Switch
        disabled={disabled}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#d1d5db", true: "#2563EB" }}
      />
    </TouchableOpacity>
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      let finalCallUserId = callUserId;
      if (!device?.callEnabled) finalCallUserId = null;
      await updateDevicePermissions(device._id, {
        ownerUserId,
        callUserId: finalCallUserId,
        permissions,
      });
      Alert.alert("Success", "Device access updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.log("❌ DEVICE ACCESS SAVE ERROR:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.error || "Failed to update device access");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.cardRow}>
        <View style={styles.deviceInfo}>
          <Text style={styles.title}>{device?.name}</Text>
          <Text style={styles.subText}>{device?.registrationNumber}</Text>
        </View>
      </View>

      <Text style={{ color: "#721b1b", fontSize: 18, fontWeight: "700", marginBottom: 12, marginTop: 12 }}>
        Assigned Users
      </Text>

      {(assignedUsers || []).map(user => {
        const expanded = expandedUser === user._id;
        const perm = getPermission(user._id);
        const isOwner = String(ownerUserId) === String(user._id);
        const isCallUser = String(callUserId) === String(user._id);

        return (
          <View key={user._id} style={styles.card}>
            <TouchableOpacity
              onPress={() => setExpandedUser(expanded ? null : user._id)}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name={expanded ? "chevron-down" : "chevron-forward"} size={18} color="#0F172A" />
                <Text style={[styles.title, { marginLeft: 8 }]}>{user.name}</Text>
                {isOwner && (
                  <View style={{ backgroundColor: "#F59E0B", marginLeft: 8, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>👑 OWNER</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {expanded && (
              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                  {isOwner ? (
                    <TouchableOpacity onPress={() => handleOwnerChange(user)} style={{ backgroundColor: "#F59E0B", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginRight: 10 }}>
                      <Text style={{ color: "#fff", fontWeight: "700" }}>👑 OWNER</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => handleOwnerChange(user)} style={{ marginRight: 16 }}>
                      <Text style={{ color: "#2563EB", fontWeight: "700" }}>Make Owner</Text>
                    </TouchableOpacity>
                  )}
                  {device?.callEnabled && (
                    isCallUser ? (
                      <TouchableOpacity onPress={() => handleCallUserChange(user)} style={{ backgroundColor: "#16A34A", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                        <Text style={{ color: "#fff", fontWeight: "700" }}>📞 CALL USER</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => handleCallUserChange(user)}>
                        <Text style={{ color: "#DC2626", fontWeight: "700" }}>📞 Set</Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
                {renderPermissionRow("Engine Control", perm.engineControl, value => updatePermission(user._id, "engineControl", value))}
                {renderPermissionRow("Edit Speed Limit", perm.editSpeedLimit, value => updatePermission(user._id, "editSpeedLimit", value))}
                {renderPermissionRow("Edit Fuel Average", perm.editFuelAverage, value => updatePermission(user._id, "editFuelAverage", value))}
                {renderPermissionRow("Edit Oil Reading", perm.editOilChangeReading, value => updatePermission(user._id, "editOilChangeReading", value))}
                {renderPermissionRow("Edit Oil Limit", perm.editOilChangeLimit, value => updatePermission(user._id, "editOilChangeLimit", value))}
                {renderPermissionRow("Edit Call Number", perm.editCallNumber, value => updatePermission(user._id, "editCallNumber", value))}
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        style={[styles.fab, { alignSelf: "center", marginTop: 20, marginBottom: 30, minWidth: 180, alignItems: "center", opacity: saving ? 0.7 : 1 }]}
        disabled={saving}
        onPress={handleSave}
      >
        <Text style={styles.fabText}>{saving ? "Saving..." : "Save Permissions"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}