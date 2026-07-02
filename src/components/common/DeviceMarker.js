import React from "react";
import { Image } from "react-native";
import { Marker } from "react-native-maps";
import { getDeviceState } from "../../utils/deviceState";
import { getVehicleIcon } from "../../utils/deviceIcon";

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
    const deviceState = getDeviceState({ online, position });
    icon = getVehicleIcon(deviceState);
  }

  return (
    <Marker
      coordinate={safeCoordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      rotation={heading}
      tracksViewChanges={true}
      zIndex={10}
    >
      <Image
        source={icon}
        resizeMode="contain"
        fadeDuration={0}
        style={{ width: 44, height: 44 }}
      />
    </Marker>
  );
};

export default DeviceMarker;