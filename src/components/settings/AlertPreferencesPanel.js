import React, { useEffect, useState } from "react";
import { View, Text, Switch } from "react-native";
import { fetchCurrentUser, updateUserAlertPreferences } from "../../api/users";
import settingsStyles from "../../styles/settingsStyles";

const alertLabels = {
  ENGINE_ON: "Ignition ON",
  ENGINE_OFF: "Ignition OFF",
  BATTERY_DISCONNECTED: "Battery Disconnect",
  GEOFENCE_ENTER: "Geofence Enter",
  GEOFENCE_EXIT: "Geofence Exit",
  OVERSPEED: "Overspeed",
  DEVICE_EXPIRY: "Device Expiry",
};

export default function AlertPreferencesPanel() {
  const [prefs, setPrefs] = useState({});

  useEffect(() => { loadPrefs(); }, []);

  const loadPrefs = async () => {
    try {
      const res = await fetchCurrentUser();
      setPrefs(res.data.alertPreferences || {});
    } catch (err) { console.log(err); }
  };

  const toggle = async (type, value) => {
    const newPrefs = { ...prefs, [type]: value };
    setPrefs(newPrefs);
    try {
      await updateUserAlertPreferences(newPrefs);
    } catch (err) { console.log(err); }
  };

  return (
    <View style={settingsStyles.card}>
      <Text style={settingsStyles.cardTitle}>Alert Preferences</Text>
      {Object.keys(alertLabels).map(type => (
        <View key={type} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" }}>
          <Text style={{ color: "#330f0f", fontSize: 15, fontWeight: "500" }}>{alertLabels[type]}</Text>
          <Switch value={prefs[type] !== false} onValueChange={(v) => toggle(type, v)} />
        </View>
      ))}
    </View>
  );
}