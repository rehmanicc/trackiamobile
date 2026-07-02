import React from "react";
import DeviceMarker from "../common/DeviceMarker";

function DeviceLayer({ devices = [], liveDevices = {} }) {
  return devices.map((dev) => {
    const live = liveDevices?.[String(dev.traccarId)];
    if (!live) return null;
    const position = live?.position || live;
    const coordinate = live?.renderedCoordinate;
    if (!coordinate) return null;

    const online = position?.deviceTime
      ? Date.now() - new Date(position.deviceTime) < 300000
      : false;

    // Use stable device ID as key – prevents flicker
    return (
      <DeviceMarker
        key={dev._id}
        position={position}
        coordinate={{ latitude: coordinate.latitude, longitude: coordinate.longitude }}
        rotation={live?.renderedHeading || position?.course || 0}
        online={online}
      />
    );
  });
}

export default DeviceLayer;