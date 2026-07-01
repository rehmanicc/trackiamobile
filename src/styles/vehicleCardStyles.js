import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginRight: 12,
    padding: 10,
    borderRadius: 16,
    width: 160,
    elevation: 4,

    flexDirection: "row",
    alignItems: "stretch",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  right: {
  justifyContent: "space-between",
  alignItems: "center",
},
  left: {
  flex: 1,
  justifyContent: "center",
  paddingTop: 6,
},

  title: {
  fontSize: 15,
  fontWeight: "700",
  marginBottom: 6,
},

  subtitle: {
  fontSize: 12,
  color: "#999",
  marginBottom: 8,
},

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
  },

  statusText: {
    marginLeft: 6,
    fontSize: 12,
  },

  speedText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  movingDot: {
    backgroundColor: "#22c55e",
  },

  idleDot: {
    backgroundColor: "#898f99",
  },

  offlineDot: {
    backgroundColor: "#ef4444",
  },

  parkedDot: {
    backgroundColor: "#f59e0b",
  },

  // 🔹 IMAGE
  carImage: {
    width: 70,
    height: 40,
    resizeMode: "contain",
  },

});