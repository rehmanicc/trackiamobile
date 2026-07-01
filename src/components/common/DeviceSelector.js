import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { fetchDevices } from "../../api/devices";
import styles from "../../styles/FormStyles";

export default function DeviceSelector({ selected = [], onChange, userId }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDevicesList(); }, []);

  const fetchDevicesList = async () => {
    try {
      const res = await fetchDevices();
      setDevices(res.data);
    } catch (err) {
      console.log("❌ DEVICE FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDevice = (id) => {
    const updated = selected.includes(id)
      ? selected.filter(d => d !== id)
      : [...selected, id];
    onChange(updated);
  };

  const renderItem = ({ item }) => {
    const isSelected = selected.includes(item._id);
    return (
      <TouchableOpacity
        style={[styles.card, { marginBottom: 10, borderWidth: isSelected ? 2 : 0, borderColor: "#3b82f6" }]}
        onPress={() => toggleDevice(item._id)}
      >
        <View style={styles.row}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.deviceName}>{item.name || ""}</Text>
            <Text style={styles.reg}>  {item.registrationNumber || ""}</Text>
          </View>
          <View style={styles.checkbox}>{isSelected && <View style={styles.checkboxInner} />}</View>
        </View>
        <Text style={styles.hint}>{isSelected ? "Selected" : "Tap to select"}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) return <Text style={{ color: "#999" }}>Loading devices...</Text>;

  return (
    <FlatList
      data={devices}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
    />
  );
}