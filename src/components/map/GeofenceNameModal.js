import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function GeofenceNameModal({
  visible,
  styles,
  geofenceName,
  setGeofenceName,
  onCreate,
  onCancel,
}) {
  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Enter Geofence Name</Text>
      <TextInput
        value={geofenceName}
        onChangeText={setGeofenceName}
        placeholder="Geofence Name"
        style={styles.modalInput}
      />
      <View style={styles.modalButtonRow}>
        <TouchableOpacity style={styles.modalSaveButton} onPress={onCreate}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalCancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}