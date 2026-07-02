import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ImageBackground, TextInput, Modal } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { fetchDevices, deleteDevice, updateDevicePermissions } from "../api/devices";
import { sendCommand } from "../api/traccar";
import { hasPermission } from "../utils/permissions";
import { PERMISSIONS } from "../constants/permissions";
import styles from "../styles/userStyles";

export default function DeviceScreen() {
  const api = null;
  const navigation = useNavigation();
  const { user: currentUser } = useAuth();
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");
  const [engineModalVisible, setEngineModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const canManageDevices = hasPermission(currentUser, PERMISSIONS.MANAGE_DEVICES);

  useFocusEffect(useCallback(() => { fetchDevicesList(); }, []));

  const fetchDevicesList = async () => {
    try {
      const res = await fetchDevices();
      setDevices(res.data);
    } catch (err) {
      console.log("❌ DEVICE ERROR:", err.response?.data || err.message);
    }
  };

  const filteredDevices = devices.filter(device => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      device?.name?.toLowerCase()?.includes(query) ||
      device?.uniqueId?.toLowerCase()?.includes(query) ||
      device?.registrationNumber?.toLowerCase()?.includes(query)
    );
  });

  const getExpiryInfo = (expiryDate) => {
    if (!expiryDate) return { text: "No Expiry", color: "#94A3B8" };
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: "Expired", color: "#EF4444" };
    if (days <= 30) return { text: `${days} Days`, color: "#F59E0B" };
    return { text: `${days} Days`, color: "#22C55E" };
  };

  const handleEngineCommand = async (device, type) => {
    const isOwner = currentUser?.role === "platform_owner";
    const isAdmin = currentUser?.role === "admin";
    if (!isOwner && !isAdmin) {
      alert("You are not authorized for engine control");
      return;
    }
    try {
      await sendCommand(device.traccarId, type);
      await fetchDevicesList();
      alert(type === "engineResume" ? "Engine Released" : "Engine Killed");
    } catch (err) {
      console.log("❌ ENGINE ERROR:", err.response?.data || err.message);
    }
  };

  const openEngineModal = (device) => {
    const isAuthority = currentUser?.role === "platform_owner" || currentUser?.role === "admin";
    const lockedByAuthority = device.engineLastAction === "stop" && device.engineLockedByAuthority;
    if (lockedByAuthority && !isAuthority) {
      Alert.alert("Engine Locked", "This vehicle has been disabled by Admin/Owner. Please contact support.");
      return;
    }
    setSelectedDevice(device);
    setEngineModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Device", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await deleteDevice(id);
          setDevices(prev => prev.filter(d => d._id !== id));
        } catch (err) { console.log("❌ DELETE ERROR:", err.response?.data || err.message); }
      }},
    ]);
  };

  const canEditDevice = (device) => {
    if (canManageDevices) return true;
    const myPermission = device?.devicePermissions?.find(p => String(p.userId?._id || p.userId) === String(currentUser?._id));
    if (!myPermission) return false;
    return myPermission.editSpeedLimit || myPermission.editFuelAverage || myPermission.editOilChangeReading || myPermission.editOilChangeLimit || myPermission.editCallNumber;
  };

  return (
    <ImageBackground source={require("../assets/trackia_bg.png")} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput placeholder="Search device, IMEI or registration" placeholderTextColor="#94A3B8" value={search} onChangeText={setSearch} style={styles.searchInput} />
          </View>
          <FlatList
            data={filteredDevices}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const canControlEngineUI = item?.trackerModelId?.supportsEngineControl && (currentUser?.role === "platform_owner" || currentUser?.role === "admin");
              return (
                <View style={styles.cardRow}>
                  <View style={styles.deviceInfo}>
                    <View style={styles.deviceHeaderRow}>
                      <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.deviceDot}>•</Text>
                      <Text style={styles.subText} numberOfLines={1}>{item.registrationNumber}</Text>
                    </View>
                    <View style={styles.expiryRow}>
                      <Ionicons name="time-outline" size={16} color="#304f8d" />
                      <Text style={[styles.expiryText, { color: getExpiryInfo(item.expiryDate).color }]}>{getExpiryInfo(item.expiryDate).text}</Text>
                      {item.engineLastAction === "stop" && <><Text style={styles.deviceDot}>•</Text><Text style={styles.engineKilledText}>Killed</Text></>}
                    </View>
                  </View>
                  <View style={styles.actionColumn}>
                    {canEditDevice(item) && (
                      <TouchableOpacity style={[styles.iconBtn, styles.iconEdit]} onPress={() => navigation.navigate("Device", { device: item })}>
                        <Ionicons name="create-outline" size={18} color="#fff" />
                      </TouchableOpacity>
                    )}
                    {canManageDevices && (
                      <>
                        <TouchableOpacity style={[styles.iconBtn, styles.iconDelete]} onPress={() => handleDelete(item._id)}>
                          <Ionicons name="trash-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, styles.iconPermission]} onPress={() => navigation.navigate("DeviceAccess", { device: item })}>
                          <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                      </>
                    )}
                    {canControlEngineUI && (
                      <TouchableOpacity style={[styles.iconBtn, styles.engineBtn]} onPress={() => openEngineModal(item)}>
                        <MaterialCommunityIcons name="engine" size={18} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
          <Modal visible={engineModalVisible} transparent animationType="slide" onRequestClose={() => setEngineModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setEngineModalVisible(false)} />
              <View style={styles.engineModal}>
                <View style={styles.modalHandle} />
                <View style={styles.engineModalHeader}>
                  <View style={styles.engineSingleLineContainer}>
                    <Text style={styles.engineModalTitle} numberOfLines={1}>{selectedDevice?.name}</Text>
                    <Text style={styles.engineDot}> • </Text>
                    <Text style={styles.engineModalSubTitle} numberOfLines={1}>{selectedDevice?.registrationNumber}</Text>
                    <Text style={styles.engineDot}> • </Text>
                    <Text style={[styles.expiryInlineText, { color: getExpiryInfo(selectedDevice?.expiryDate).color }]} numberOfLines={1}>
                      {getExpiryInfo(selectedDevice?.expiryDate).text}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setEngineModalVisible(false)}>
                    <Ionicons name="close" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.engineKillBtn} onPress={() => {
                  Alert.alert("Engine Kill", `Are you sure you want to stop ${selectedDevice?.name}?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Kill Engine", style: "destructive", onPress: () => { handleEngineCommand(selectedDevice, "engineStop"); setEngineModalVisible(false); } }
                  ]);
                }}>
                  <MaterialCommunityIcons name="engine-off" size={20} color="#fff" />
                  <Text style={styles.engineBtnText}>Engine Kill</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.engineReleaseBtn} onPress={() => {
                  Alert.alert("Engine Release", `Are you sure you want to release ${selectedDevice?.name}?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Release Engine", onPress: () => { handleEngineCommand(selectedDevice, "engineResume"); setEngineModalVisible(false); } }
                  ]);
                }}>
                  <MaterialCommunityIcons name="engine" size={20} color="#fff" />
                  <Text style={styles.engineBtnText}>Engine Release</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {canManageDevices && (
            <View style={styles.fabContainer}>
              <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("Device")}>
                <Text style={styles.fabText}>+ Device</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}