import React from "react";
import { View, FlatList } from "react-native";
import VehicleCard from "../common/VehicleCard";

export default function DeviceCarousel({ devices = [], liveDevices = {}, onPress, styles }) {
  const renderItem = ({ item: dev }) => {
    const live = liveDevices[String(dev.traccarId)];
    return (
      <VehicleCard
        id={dev.traccarId}
        dev={{
          ...dev,
          position: live?.position,
          engineOn: live?.position?.attributes?.ignition === true || live?.position?.attributes?.ignition === 1 || live?.position?.attributes?.ignition === "1",
        }}
        onPress={() => onPress?.(dev.traccarId)}
      />
    );
  };
  return (
    <View style={styles.carouselWrapper}>
<<<<<<< HEAD
      <FlatList
        horizontal
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        extraData={liveDevices} // ✅ Forces re‑render when liveDevices updates
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
      />
=======
      <FlatList horizontal data={devices} renderItem={renderItem} keyExtractor={(item) => item._id} showsHorizontalScrollIndicator={false} removeClippedSubviews initialNumToRender={8} maxToRenderPerBatch={8} windowSize={5} />
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
    </View>
  );
}