import { useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Linking } from "react-native";
=======
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
import { fetchAlerts, markAlertRead, deleteAlert } from "../api/alerts";
import { useRealtime } from "../contexts/RealtimeContext";
import { getTimeAgo } from "../utils/date";
import styles from "../styles/alertStyles";

const FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Overspeed", value: "OVERSPEED" },
  { label: "Ignition ON", value: "ENGINE_ON" },
  { label: "Ignition OFF", value: "ENGINE_OFF" },
  { label: "Geo Exit", value: "GEOFENCE_EXIT" },
  { label: "Geo Enter", value: "GEOFENCE_ENTER" },
  { label: "Battery REM", value: "BATTERY_DISCONNECTED" },
  { label: "Device Expiry", value: "DEVICE_EXPIRY" },
];

const ICONS = {
  OVERSPEED: "🚨",
  ENGINE_ON: "🔑",
  ENGINE_OFF: "⛔",
  GEOFENCE_ENTER: "📍",
  GEOFENCE_EXIT: "📌",
  BATTERY_DISCONNECTED: "🔋",
  DEVICE_EXPIRY: "⏰",
};

export default function AlertsScreen() {
  const { alerts: realtimeAlerts } = useRealtime();
  const [historicalAlerts, setHistoricalAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [selectedAlerts, setSelectedAlerts] = useState([]);

  useEffect(() => {
    fetchAlertsList();
  }, []);

  const fetchAlertsList = async () => {
    try {
      setLoading(true);
      const res = await fetchAlerts();
      setHistoricalAlerts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("❌ ALERT ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await markAlertRead(id);
      setHistoricalAlerts((prev) =>
        prev.map((a) =>
          a._id === id
            ? { ...a, read: true }
            : a
        )
      );
    } catch (err) {
      console.log("❌ markRead:", err.message);
    }
  };

<<<<<<< HEAD
  const mergedAlerts = useMemo(() => {
=======
   const mergedAlerts = useMemo(() => {
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
    const map = new Map();
    realtimeAlerts.forEach((a) => map.set(a._id, a));
    historicalAlerts.forEach((a) => { if (!map.has(a._id)) map.set(a._id, a); });
    return Array.from(map.values());
  }, [historicalAlerts, realtimeAlerts]);

  const filteredAlerts = useMemo(() => {
    let alerts =
      filter === "ALL"
        ? [...mergedAlerts]
        : mergedAlerts.filter(
          a => a.type === filter
        );

    return alerts.sort((a, b) => {
<<<<<<< HEAD
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
=======
      // unread first
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }

      // newest first
      return (
        new Date(b.timestamp) -
        new Date(a.timestamp)
      );
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
    });
  }, [mergedAlerts, filter]);

  const unreadCount = useMemo(() => mergedAlerts.filter((a) => !a.read).length, [mergedAlerts]);

  const getPriorityStyle = (isCritical) => (isCritical ? styles.highCard : styles.lowCard);
<<<<<<< HEAD
  const isSelected = (id) => selectedAlerts.includes(id);

  const handleMarkSelectedRead = async () => {
    try {
      await Promise.all(selectedAlerts.map(id => markAlertRead(id)));
      setSelectedAlerts([]);
      fetchAlertsList();
    } catch (err) {
      console.log("❌ MARK SELECTED READ:", err.response?.data || err.message);
=======
  const isSelected = (id) =>
    selectedAlerts.includes(id);
  const handleMarkSelectedRead = async () => {
    try {
      await Promise.all(
        selectedAlerts.map(id => markAlertRead(id))
      );

      

      setSelectedAlerts([]);
      fetchAlertsList();
    } catch (err) {
      console.log(
        "❌ MARK SELECTED READ:",
        err.response?.data || err.message
      );
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
    }
  };

  const handleDeleteSelected = async () => {
    try {
<<<<<<< HEAD
      await Promise.all(selectedAlerts.map(id => deleteAlert(id)));
      setSelectedAlerts([]);
      fetchAlertsList();
    } catch (err) {
      console.log("❌ DELETE SELECTED:", err.response?.data || err.message);
    }
  };

  // ------------------------------------------------------------------
  // ✅ RENDER ALERT MESSAGE WITH TAPPABLE PHONE NUMBER
  // ------------------------------------------------------------------
  const renderAlertMessage = (item) => {
    if (item.type === 'CALL_REQUIRED' && item.metadata?.phoneNumber) {
      const phoneNumber = item.metadata.phoneNumber;
      const parts = item.message.split(`Make call to ${phoneNumber}`);
      return (
        <Text style={styles.alertMessage}>
          {parts[0]}
          <Text
            style={{ color: '#2563EB', textDecorationLine: 'underline' }}
            onPress={() => {
              const url = `tel:${phoneNumber}`;
              Linking.openURL(url).catch(err => console.log('Failed to open dialer:', err));
            }}
          >
            Make call to {phoneNumber}
          </Text>
          {parts[1] || ''}
        </Text>
      );
    }
    return <Text style={styles.alertMessage}>{item.message}</Text>;
=======
      await Promise.all(
        selectedAlerts.map(id => deleteAlert(id))
      );


      setSelectedAlerts([]);
      fetchAlertsList();
    } catch (err) {
      console.log(
        "❌ DELETE SELECTED:",
        err.response?.data || err.message
      );
    }
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            {selectedAlerts.length > 0
              ? `Selected: ${selectedAlerts.length}`
              : "Alerts"}
          </Text>

          <Text style={styles.subHeading}>
            {selectedAlerts.length > 0
              ? "Long press to select more alerts"
              : `${unreadCount} unread alerts`}
          </Text>
        </View>

        {selectedAlerts.length > 0 && (
          <View style={styles.headerBtns}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleMarkSelectedRead}
            >
              <Text style={styles.actionText}>Read</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearBtn}
              onPress={handleDeleteSelected}
            >
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(item) => item.value}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === item.value && styles.activeChip]}
            onPress={() => setFilter(item.value)}
          >
            <Text style={[styles.filterText, filter === item.value && styles.activeFilterText]}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAlertsList} tintColor="#fff" />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No alerts found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              if (selectedAlerts.length > 0) {
                setSelectedAlerts(prev =>
                  prev.includes(item._id)
                    ? prev.filter(id => id !== item._id)
                    : [...prev, item._id]
                );
                return;
              }
<<<<<<< HEAD
=======

>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
              if (!item.read) {
                markRead(item._id);
              }
            }}
            onLongPress={() => {
              setSelectedAlerts(prev =>
                prev.includes(item._id)
                  ? prev.filter(id => id !== item._id)
                  : [...prev, item._id]
              );
            }}
          >
            <View
              style={[
                styles.alertCard,
                getPriorityStyle(item.isCritical),
                !item.read && styles.unreadCard,
                isSelected(item._id) && styles.selectedCard,
              ]}
            >
              <View style={styles.topRow}>
                <View style={styles.leftRow}>
                  <Text style={styles.icon}>{ICONS[item.type] || "🚨"}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertType}>{item.type?.replace(/_/g, " ")}</Text>
<<<<<<< HEAD
                    {/* ✅ Use renderAlertMessage instead of static text */}
                    {renderAlertMessage(item)}
=======
                    <Text style={styles.alertMessage}>{item.message}</Text>
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
                  </View>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.bottomRow}>
                <Text style={styles.priorityText}>{item.isCritical ? "Critical" : "Normal"}</Text>
                <Text style={styles.timeText}>{getTimeAgo(item.timestamp)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}