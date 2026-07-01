import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function TripDetails({ tripData, setTripData, setTripMode, styles, setCustomTripDate }) {
  if (!tripData?.stats) return null;

  return (
    <View style={styles.analyticsWrapper}>
      <TouchableOpacity
        style={styles.analyticsCloseBtn}
        onPress={() => {
          setTripData(null);
          setCustomTripDate(null);
          setTripMode(null);
        }}
      >
        <Text style={styles.analyticsCloseText}>✕</Text>
      </TouchableOpacity>
      <View style={styles.analyticsGrid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Distance</Text>
          <Text style={styles.cardValue}>{tripData.stats.distance?.toFixed(2)} km</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Avg Speed</Text>
          <Text style={styles.cardValue}>{tripData.stats.avgSpeed?.toFixed(1)} km/h</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Max Speed</Text>
          <Text style={styles.cardValue}>{tripData.stats.maxSpeed?.toFixed(1)} km/h</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stops</Text>
          <Text style={styles.cardValue}>{tripData.stats.stops}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fuel Used</Text>
          <Text style={styles.cardValue}>{tripData.stats.fuelUsed?.toFixed(2)} L</Text>
        </View>
      </View>
    </View>
  );
}