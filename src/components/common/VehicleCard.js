import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { toKmh } from "../../utils/speed";
import { getDeviceState } from "../../utils/deviceState";
import styles from "../../styles/vehicleCardStyles";

const VehicleCard = ({ id, dev, isSelected, onPress }) => {
<<<<<<< HEAD
  // ✅ Use speed (raw) first; fallback to lastKnownSpeed (if ever set)
  const speedKmh = Math.round(toKmh(dev.position?.speed ?? dev.position?.lastKnownSpeed ?? 0));
  const state = getDeviceState(dev);

=======
  // Pass the entire device object (including dev.online) to getDeviceState
  const state = getDeviceState(dev);
  const speedKmh = Math.round(toKmh(dev.position?.lastKnownSpeed));
  
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
  const getLastUpdate = () => {
    const time = dev?.position?.lastRealtimeUpdate || dev?.position?.deviceTime;
    if (!time) return "--";
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const dotStyle =
    state === "MOVING" ? styles.movingDot
    : state === "IDLE" ? styles.idleDot
    : state === "OFFLINE" ? styles.offlineDot
    : styles.parkedDot;

  const statusLabel =
    state === "MOVING" ? "Moving"
    : state === "IDLE" ? "Idle"
    : state === "OFFLINE" ? "Offline"
    : "Parked";

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>{dev.name || `Device ${id}`}</Text>
        <Text style={styles.subtitle}>{dev.registrationNumber || "No Reg"}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, dotStyle]} />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.speedText}>{speedKmh} km/h</Text>
        <Image source={require("../../assets/vcar.png")} style={styles.carImage} />
        <Text style={styles.lastUpdateTime}>{getLastUpdate()}</Text>
      </View>
    </TouchableOpacity>
  );
};

<<<<<<< HEAD
// Keep memo; extraData in FlatList ensures updates
=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
export default React.memo(VehicleCard);