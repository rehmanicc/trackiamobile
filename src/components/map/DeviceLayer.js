<<<<<<< HEAD
import React from "react";
=======
import React, { memo } from "react";
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
import DeviceMarker from "../common/DeviceMarker";

function DeviceLayer({ devices = [], liveDevices = {} }) {
  return devices.map((dev) => {
    const live = liveDevices?.[String(dev.traccarId)];
    if (!live) return null;
    const position = live?.position || live;
    const coordinate = live?.renderedCoordinate;
    if (!coordinate) return null;
<<<<<<< HEAD

    const online = position?.deviceTime
      ? Date.now() - new Date(position.deviceTime) < 300000
      : false;

    // ✅ Use stable device ID as key – prevents flicker
=======
    // Compute online status similar to backend (position received within last 120 seconds)
    const online = position?.deviceTime ? (Date.now() - new Date(position.deviceTime)) < 120000 : false;
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
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
<<<<<<< HEAD

export default DeviceLayer;
=======
export default memo(DeviceLayer);
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
