// src/components/history/HistoryVehicleCarousel.js
import React from "react";
import { View, ScrollView } from "react-native";
import VehicleCard from "../common/VehicleCard";

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
      </ScrollView>
    </View>
  );
}

export default React.memo(HistoryVehicleCarousel);