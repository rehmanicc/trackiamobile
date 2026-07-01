<<<<<<< HEAD
// src/components/history/HistoryVehicleCarousel.js
=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
import React from "react";
import { View, ScrollView } from "react-native";
import VehicleCard from "../common/VehicleCard";

<<<<<<< HEAD
function HistoryVehicleCarousel({
  styles,
  devices,
  liveDevices,
  selectedDeviceId,
  setSelectedDeviceId,
}) {
  return (
    <View style={styles.carouselWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.entries(devices || {}).map(([id, dev]) => {
          // Merge static device with live data (if available)
          const live = liveDevices?.[String(dev.traccarId)];
          const mergedDevice = live
            ? {
                ...dev,
                position: live.position,
                online: live.position?.deviceTime
                  ? Date.now() - new Date(live.position.deviceTime) < 300000
                  : false,
              }
            : dev;

          return (
            <VehicleCard
              key={id}
              id={id}
              dev={mergedDevice}
              isSelected={selectedDeviceId == id}
              onPress={() => setSelectedDeviceId(id)}
            />
          );
        })}
=======
function HistoryVehicleCarousel({ styles, devices, selectedDeviceId, setSelectedDeviceId }) {
  return (
    <View style={styles.carouselWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.entries(devices || {}).map(([id, dev]) => (
          <VehicleCard
            key={id}
            id={id}
            dev={dev}
            isSelected={selectedDeviceId == id}
            onPress={() => setSelectedDeviceId(id)}
          />
        ))}
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
      </ScrollView>
    </View>
  );
}

export default React.memo(HistoryVehicleCarousel);