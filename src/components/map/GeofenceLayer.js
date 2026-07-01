import React from "react";
import { View, Text } from "react-native";
import { Circle, Polygon, Marker } from "react-native-maps";

export default function GeofenceLayer({ geofences = [], deviceMeta, styles, selectedGeofenceId }) {
  return (
    <>
      {geofences.map((g) => {
        const isCall = deviceMeta?.callGeofenceId === g._id;
        const isSelected = selectedGeofenceId === g._id;
        const style = isSelected ? styles.geofenceSelected : isCall ? styles.geofenceCall : styles.geofenceDefault;
        if (g.type === "circle" && g.geometry?.center) {
          const [lng, lat] = g.geometry.center;
          const radius = g.geometry.radius || 100;
          return (
            <React.Fragment key={g._id}>
              <Circle center={{ latitude: lat, longitude: lng }} radius={radius} strokeColor={style.strokeColor} fillColor={style.fillColor} strokeWidth={isSelected ? 4 : 2} />
              <Marker coordinate={{ latitude: lat, longitude: lng }} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.geofenceLabel}><Text style={styles.geofenceLabelText}>{g.name}{isCall ? " 📞" : ""}</Text></View>
              </Marker>
            </React.Fragment>
          );
        }
        if (g.type === "polygon" && g.geometry?.coordinates?.length) {
          const coords = g.geometry.coordinates[0].map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
          const centerLat = coords.reduce((sum, c) => sum + c.latitude, 0) / coords.length;
          const centerLng = coords.reduce((sum, c) => sum + c.longitude, 0) / coords.length;
          return (
            <React.Fragment key={g._id}>
              <Polygon coordinates={coords} strokeColor={style.strokeColor} fillColor={style.fillColor} strokeWidth={isSelected ? 4 : 2} />
              <Marker coordinate={{ latitude: centerLat, longitude: centerLng }} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.geofenceLabel}><Text style={styles.geofenceLabelText}>{g.name}{isCall ? " 📞" : ""}</Text></View>
              </Marker>
            </React.Fragment>
          );
        }
        return null;
      })}
    </>
  );
}