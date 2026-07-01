import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { hasPermission } from "../../utils/permissions";
import { PERMISSIONS } from "../../constants/permissions";

export default function GeofenceActionPanel({
  selectedGeofence,
  drawMode,
  user,
  onSetCall,
  onDelete,
  onClose,
}) {
  const canManageGeofences = hasPermission(user, PERMISSIONS.MANAGE_GEOFENCES);

  if (!selectedGeofence || drawMode) return null;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 140,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.85)",
        borderRadius: 14,
        padding: 14,
        zIndex: 999,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600", flex: 1 }} numberOfLines={1}>
        {selectedGeofence.name}
      </Text>

      {canManageGeofences && (
        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={onSetCall}>
          <Text style={{ color: "#00D084" }}>Set Call</Text>
        </TouchableOpacity>
      )}

      {canManageGeofences && (
        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={onDelete}>
          <Text style={{ color: "#FF4D4D" }}>Delete</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={onClose}>
        <Text style={{ color: "#999" }}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}