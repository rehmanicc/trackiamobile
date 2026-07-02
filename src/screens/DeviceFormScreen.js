// src/screens/DeviceFormScreen.js
import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView,
  Platform, Alert, TextInput, Switch
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { fetchUsers } from "../api/users";
import { fetchTrackerModels } from "../api/trackers";
import { createDevice, updateDevice, getDevice } from "../api/devices";
import FormField from "../components/common/FormField";
import styles from "../styles/FormStyles";

export default function DeviceFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user: currentUser } = useAuth();
  const device = route.params?.device || null;
  const isEdit = !!device;

  const [admins, setAdmins] = useState([]);
  const [trackerModels, setTrackerModels] = useState([]);
  const [selectedTrackerModelId, setSelectedTrackerModelId] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [trackerSearch, setTrackerSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [showTrackerDropdown, setShowTrackerDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  const canEditTrackerSim = currentUser?.role === "platform_owner" || currentUser?.role === "admin";
  const isAdminUser = currentUser?.role === "platform_owner" || currentUser?.role === "admin";

  const [form, setForm] = useState({
    name: "", uniqueId: "", registrationNumber: "", trackerSimNo: "",
    speedLimit: "", fuelEfficiency: "", oilChangeReading: "", oilChangeLimit: "", callReceiverNumber: "",
  });
  const [callEnabled, setCallEnabled] = useState(true);

  const getAdminIdString = (adminField) => {
    if (!adminField) return null;
    if (typeof adminField === 'string') return adminField;
    if (adminField._id) return String(adminField._id);
    return String(adminField);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        let adminList = [];
        if (currentUser?.role === "platform_owner") {
          const usersRes = await fetchUsers();
          adminList = usersRes.data.filter(u => u.role === "admin");
          setAdmins(adminList);
        }

        let freshDevice = device;
        let adminIdFromDevice = null;
        let trackerIdFromDevice = null;
        if (isEdit && device?._id) {
          const deviceRes = await getDevice(device._id);
          freshDevice = deviceRes.data;
          adminIdFromDevice = getAdminIdString(freshDevice.adminId);
          trackerIdFromDevice = freshDevice.trackerModelId?._id || freshDevice.trackerModelId || null;

          setForm({
            name: freshDevice.name || "",
            uniqueId: freshDevice.uniqueId || "",
            registrationNumber: freshDevice.registrationNumber || "",
            trackerSimNo: freshDevice.deviceSimNumber || "",
            speedLimit: String(freshDevice.speedLimit || ""),
            fuelEfficiency: String(freshDevice.fuelEfficiency || ""),
            oilChangeReading: String(freshDevice.oilChangeReading || ""),
            oilChangeLimit: String(freshDevice.oilChangeLimit || ""),
            callReceiverNumber: freshDevice.callReceiverNumber || "",
          });
          setSelectedTrackerModelId(trackerIdFromDevice);
          setCallEnabled(freshDevice.callEnabled !== undefined ? freshDevice.callEnabled : true);
        } else if (device && !isEdit) {
          adminIdFromDevice = getAdminIdString(device.adminId);
          trackerIdFromDevice = device.trackerModelId?._id || device.trackerModelId || null;
          setForm({
            name: device.name || "",
            uniqueId: device.uniqueId || "",
            registrationNumber: device.registrationNumber || "",
            trackerSimNo: device.deviceSimNumber || "",
            speedLimit: String(device.speedLimit || ""),
            fuelEfficiency: String(device.fuelEfficiency || ""),
            oilChangeReading: String(device.oilChangeReading || ""),
            oilChangeLimit: String(device.oilChangeLimit || ""),
            callReceiverNumber: device.callReceiverNumber || "",
          });
          setSelectedTrackerModelId(trackerIdFromDevice);
          setCallEnabled(true);
        }

        if (adminIdFromDevice) {
          if (adminList.length > 0) {
            const exists = adminList.some(adm => String(adm._id) === String(adminIdFromDevice));
            if (exists) {
              setSelectedAdminId(adminIdFromDevice);
            } else {
              console.warn("Device admin not found in the admins list – admin may have been deleted.");
              setSelectedAdminId(null);
            }
          } else {
            setSelectedAdminId(adminIdFromDevice);
          }
        } else {
          setSelectedAdminId(null);
        }
      } catch (err) {
        console.log("❌ Error loading data:", err);
        if (device) {
          setForm({
            name: device.name || "",
            uniqueId: device.uniqueId || "",
            registrationNumber: device.registrationNumber || "",
            trackerSimNo: device.deviceSimNumber || "",
            speedLimit: String(device.speedLimit || ""),
            fuelEfficiency: String(device.fuelEfficiency || ""),
            oilChangeReading: String(device.oilChangeReading || ""),
            oilChangeLimit: String(device.oilChangeLimit || ""),
            callReceiverNumber: device.callReceiverNumber || "",
          });
          setSelectedTrackerModelId(device.trackerModelId?._id || device.trackerModelId || null);
          setSelectedAdminId(getAdminIdString(device.adminId));
          setCallEnabled(device.callEnabled !== undefined ? device.callEnabled : true);
        }
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [isEdit, device?._id, currentUser]);

  useEffect(() => {
    const loadTrackers = async () => {
      try {
        const res = await fetchTrackerModels();
        setTrackerModels(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("❌ TRACKER MODELS:", err?.response?.data || err.message);
      }
    };
    loadTrackers();
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleSave = async () => {
    const validationErrors = {};
    if (isAdminUser) {
      if (!selectedTrackerModelId && trackerModels.length > 0) validationErrors.trackerModel = "Tracker model required";
      if (!form.name.trim()) validationErrors.name = "Device name required";
      if (!isEdit && !form.uniqueId.trim()) validationErrors.uniqueId = "IMEI required";
      if (!form.registrationNumber.trim()) validationErrors.registrationNumber = "Registration number required";
    }
    if (!isEdit && currentUser?.role === "platform_owner" && !selectedAdminId) {
      Alert.alert("Admin Required", "Please select admin");
      return;
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        speedLimit: Number(form.speedLimit),
        fuelEfficiency: Number(form.fuelEfficiency),
        oilChangeReading: Number(form.oilChangeReading),
        oilChangeLimit: Number(form.oilChangeLimit),
        callReceiverNumber: form.callReceiverNumber,
        callEnabled: callEnabled,
      };
      if (isAdminUser) {
        Object.assign(payload, {
          name: form.name.trim(),
          uniqueId: form.uniqueId.trim(),
          trackerModelId: selectedTrackerModelId,
          registrationNumber: form.registrationNumber.trim(),
          deviceSimNumber: form.trackerSimNo?.trim() || undefined,
          adminId: currentUser?.role === "admin" ? currentUser._id : selectedAdminId,
        });
      }
      if (isEdit) {
        await updateDevice(device._id, payload);
      } else {
        await createDevice(payload);
      }
      Alert.alert("Success", isEdit ? "Device updated" : "Device created");
      navigation.goBack();
    } catch (err) {
      console.log("❌ DEVICE ERROR:", err?.response?.data || err.message);
      Alert.alert("Error", err?.response?.data?.error || "Failed to save device");
    }
  };

  if (loadingData) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{isEdit ? "Edit Device" : "Add Device"}</Text>
        <Text style={styles.subtitle}>Register and manage your tracking device</Text>

        {isAdminUser && (
          <View style={styles.card}>
            <FormField label="Device Name" value={form.name} onChange={(v) => handleChange("name", v)} placeholder="Car 1" error={errors.name} />
            <FormField label="Device IMEI / Unique ID" value={form.uniqueId} onChange={(v) => handleChange("uniqueId", v)} placeholder="Enter IMEI" error={errors.uniqueId} editable={!isEdit} />

            <Text style={styles.label}>Tracker Model</Text>
            <TouchableOpacity activeOpacity={1} onPress={() => setShowTrackerDropdown(!showTrackerDropdown)} style={styles.dropdownSelector}>
              <Text style={styles.dropdownText}>
                {trackerModels.find(t => String(t?._id) === String(selectedTrackerModelId))?.name || "Select Tracker Model"}
              </Text>
            </TouchableOpacity>
            {showTrackerDropdown && (
              <View style={styles.dropdownContainer}>
                <TextInput placeholder="Search tracker..." placeholderTextColor="#888" value={trackerSearch} onChangeText={setTrackerSearch} style={styles.dropdownSearch} />
                <ScrollView>
                  {trackerModels.filter(t => t?.name?.toLowerCase()?.includes(trackerSearch.toLowerCase()) || t?.brand?.toLowerCase()?.includes(trackerSearch.toLowerCase())).map(tracker => (
                    <TouchableOpacity key={tracker._id} onPress={() => { setSelectedTrackerModelId(tracker._id); setTrackerSearch(""); setShowTrackerDropdown(false); }} style={styles.dropdownItem}>
                      <Text style={styles.dropdownItemText}>{tracker.brand} • {tracker.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {currentUser?.role === "platform_owner" && (
              <>
                <Text style={styles.label}>Select Admin</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => setShowAdminDropdown(!showAdminDropdown)} style={styles.dropdownSelector}>
                  <Text style={styles.dropdownText}>
                    {admins.find(a => String(a._id) === String(selectedAdminId))?.fullName || "Choose Admin"}
                  </Text>
                </TouchableOpacity>
                {showAdminDropdown && (
                  <View style={styles.dropdownContainer}>
                    <TextInput placeholder="Search admin..." placeholderTextColor="#888" value={adminSearch} onChangeText={setAdminSearch} style={styles.dropdownSearch} />
                    <ScrollView>
                      {admins.filter(a => a.fullName?.toLowerCase()?.includes(adminSearch.toLowerCase())).map(admin => (
                        <TouchableOpacity key={admin._id} onPress={() => { setSelectedAdminId(admin._id); setAdminSearch(""); setShowAdminDropdown(false); }} style={styles.dropdownItem}>
                          <Text style={styles.dropdownItemText}>{admin.fullName}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            )}

            <FormField label="Registration Number" value={form.registrationNumber} onChange={(v) => handleChange("registrationNumber", v)} placeholder="AUS 403" error={errors.registrationNumber} />
            <FormField label="Tracker SIM No (Optional)" value={form.trackerSimNo} onChange={(v) => handleChange("trackerSimNo", v)} placeholder="Optional" editable={canEditTrackerSim} />

            {/* Call Service Toggle – admin-only */}
            <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.label}>Enable Call Service</Text>
              <Switch
                value={callEnabled}
                onValueChange={setCallEnabled}
                trackColor={{ false: '#d1d5db', true: '#2563EB' }}
              />
            </View>
            <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2, marginBottom: 8 }}>
              When enabled, exiting the call geofence will send a call alert.
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vehicle Settings</Text>
          <FormField label="Speed Limit" value={form.speedLimit} onChange={v => handleChange("speedLimit", v)} keyboardType="numeric" editable={isAdminUser} />
          <FormField label="Fuel Average" value={form.fuelEfficiency} onChange={v => handleChange("fuelEfficiency", v)} keyboardType="numeric" editable={isAdminUser} />
          <FormField label="Oil Change Reading" value={form.oilChangeReading} onChange={v => handleChange("oilChangeReading", v)} keyboardType="numeric" editable={isAdminUser} />
          <FormField label="Oil Change Limit" value={form.oilChangeLimit} onChange={v => handleChange("oilChangeLimit", v)} keyboardType="numeric" editable={isAdminUser} />
          <FormField label="Call Receiver Number" value={form.callReceiverNumber} onChange={v => handleChange("callReceiverNumber", v)} keyboardType="phone-pad" editable={isAdminUser} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{isEdit ? "Update Device" : "Create Device"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}