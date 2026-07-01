export const getVehicleIcon = (state) => {
  switch (state) {
    case "MOVING":
      return require("../assets/carg.png");
    case "IDLE":
      return require("../assets/caridle.png");
    case "OFFLINE":
      return require("../assets/carr.png");
    default:
      return require("../assets/carr.png");
  }
};