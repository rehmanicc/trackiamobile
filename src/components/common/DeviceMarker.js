<<<<<<< HEAD
import React from "react";
=======
import React, { memo, useEffect, useState } from "react";
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
import { Image } from "react-native";
import { Marker } from "react-native-maps";
import { getDeviceState } from "../../utils/deviceState";
import { getVehicleIcon } from "../../utils/deviceIcon";

<<<<<<< HEAD
const DeviceMarker = ({
  position,
  coordinate,
  rotation,
  online = true,
  isPlayback,
  playbackStatus,
}) => {
  if (!position || !coordinate) return null;

  const safeCoordinate = coordinate?.__getValue
    ? coordinate.__getValue()
    : coordinate;
  if (
    !safeCoordinate ||
    typeof safeCoordinate.latitude !== "number" ||
    typeof safeCoordinate.longitude !== "number"
  ) {
    return null;
  }

  const heading = Number.isFinite(rotation)
    ? rotation
    : Number.isFinite(position?.course)
    ? position.course
    : 0;

  let icon;
  if (isPlayback) {
    icon =
      playbackStatus === "Stopped"
        ? require("../../assets/caridle.png")
        : require("../../assets/carg.png");
  } else {
=======
const DeviceMarker = ({ position, coordinate, rotation, online = true, isPlayback, playbackStatus }) => {
  if (!position || !coordinate) return null;

  const safeCoordinate = coordinate?.__getValue ? coordinate.__getValue() : coordinate;
  if (!safeCoordinate || typeof safeCoordinate.latitude !== "number" || typeof safeCoordinate.longitude !== "number") return null;

  const safeRotation = Number(rotation);
  const safeCourse = Number(position?.course);
  const heading = Number.isFinite(safeRotation) ? safeRotation : (Number.isFinite(safeCourse) ? safeCourse : 0);

  let icon;
  if (isPlayback) {
    icon = playbackStatus === "Stopped" ? require("../../assets/caridle.png") : require("../../assets/carg.png");
  } else {
    // Pass online flag and position to getDeviceState
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
    const deviceState = getDeviceState({ online, position });
    icon = getVehicleIcon(deviceState);
  }

<<<<<<< HEAD
=======
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setTracksViewChanges(false), 1200);
    return () => clearTimeout(timer);
  }, []);

>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
  return (
    <Marker
      coordinate={safeCoordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      rotation={heading}
<<<<<<< HEAD
      tracksViewChanges={true} // Always update for smooth movement
      zIndex={10}
    >
      <Image
        source={icon}
        resizeMode="contain"
        fadeDuration={0}
        style={{ width: 44, height: 44 }}
      />
=======
      tracksViewChanges={tracksViewChanges}
      zIndex={10}
    >
      <Image source={icon} resizeMode="contain" fadeDuration={0} style={{ width: 44, height: 44 }} />
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
    </Marker>
  );
};

<<<<<<< HEAD
export default DeviceMarker;
=======
export default memo(DeviceMarker, (prev, next) => {
  return (
    prev.coordinate.latitude === next.coordinate.latitude &&
    prev.coordinate.longitude === next.coordinate.longitude &&
    prev.rotation === next.rotation &&
    prev.online === next.online &&
    prev.position?.deviceId === next.position?.deviceId &&
    prev.position?.speed === next.position?.speed &&
    prev.position?.course === next.position?.course
  );
});
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
