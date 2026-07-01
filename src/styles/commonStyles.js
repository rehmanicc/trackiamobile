import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  tabBar: {
    position: "absolute",   // 👈 required for floating
    bottom: 15,             // 👈 move upward
    left: 10,
    right: 10,

    height: 65,
    backgroundColor: "#0B0B0B",

    borderTopWidth: 0,
    borderRadius: 15,       // 👈 rounded corners

    elevation: 8,           // Android shadow
    shadowColor: "#000",    // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  markerWrapper: {
    alignItems: "center",
},

vehicleMarker: {
    width: 46,
    height: 46,
},
});
export const COLORS = {
  primary: "#1e73be",
  accent: "#3b82f6",

  background: "#f3f4f6",   // light silver
  card: "#ffffff",

  text: "#1f2933",
  subtext: "#6b7280",

  border: "#e5e7eb",
  inputBg: "#f9fafb",

  success: "green",
  danger: "red",
};


export const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};
