import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { fetchDevices, assignDevice, unassignDevice } from "../api/devices";
import { hasPermission } from "../utils/permissions";
import { PERMISSIONS } from "../constants/permissions";
import DeviceSelector from "../components/common/DeviceSelector";
import styles from "../styles/FormStyles";

export default function AssignDevicesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user: currentUser } = useAuth();
  const user = route.params?.user;
  const canManageDevices = hasPermission(currentUser, PERMISSIONS.MANAGE_DEVICES);
  const [selectedDevices, setSelectedDevices] = useState([]);

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await fetchDevices();
        const assigned = res.data.filter(d => d.assignedUsers?.some(u => u._id === user._id)).map(d => d._id);
        setSelectedDevices(assigned);
      } catch (err) { console.log("❌ PREFILL ERROR:", err); }
    };
    fetchAssigned();
    if (user?.devices) setSelectedDevices(user.devices.map(d => d._id || d));
  }, [user]);

  const handleSave = async () => {
    if (!canManageDevices) return;
    try {
      const previous = user?.devices ? user.devices.map(d => d._id || d) : [];
      const current = selectedDevices;
      const toAssign = current.filter(id => !previous.includes(id));
      const toUnassign = previous.filter(id => !current.includes(id));
      for (const deviceId of toAssign) await assignDevice(deviceId, user._id);
      for (const deviceId of toUnassign) await unassignDevice(deviceId, user._id);
      navigation.goBack();
    } catch (err) { console.log("❌ ASSIGN ERROR:", err.response?.data || err.message); }
  };

  if (!user) return <View style={styles.container}><Text style={{ color: "#fff" }}>User not found</Text></View>;
  if (!canManageDevices) return <View style={styles.container}><Text style={{ color: "#fff" }}>You are not allowed to assign devices</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Assign Devices</Text>
      <Text style={styles.subtitle}>{user.name} ({user.phoneNumber})</Text>
      <View style={styles.card}>
        <DeviceSelector selected={selectedDevices} onChange={setSelectedDevices} userId={user._id} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}><Text style={styles.buttonText}>Save Assignment</Text></TouchableOpacity>
    </View>
  );
}