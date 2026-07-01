import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // =========================
  // MAP
  // =========================
  map: {
    flex: 1,
  },

  // =========================
  // MAIN DRAW BUTTON
  // =========================
  drawButton: {
    backgroundColor: "rgba(0,0,0,0.75)",

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 9999,
    elevation: 20,
  },

  drawText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  // =========================
  // TOP DRAW CONTROLS
  // =========================
  drawControls: {
    position: "absolute",
    top: 55,

    width: "100%",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    zIndex: 9999,
    elevation: 20,
  },

  // =========================
  // NORMAL DRAW BUTTON
  // =========================
  drawOption: {
    backgroundColor: "rgba(0,0,0,0.42)",

    paddingHorizontal: 18,
    paddingVertical: 9,

    borderRadius: 20,

    marginHorizontal: 5,

    minWidth: 90,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  // =========================
  // ACTIVE BUTTON
  // =========================
  activeDrawOption: {
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  // =========================
  // CANCEL BUTTON
  // =========================
  cancelButton: {
    backgroundColor: "rgba(255,59,48,0.82)",

    paddingHorizontal: 18,
    paddingVertical: 9,

    borderRadius: 20,

    marginHorizontal: 5,

    minWidth: 90,

    alignItems: "center",
    justifyContent: "center",
  },

  drawOptionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // =========================
  // HINT TEXT
  // =========================
  drawHintContainer: {
    position: "absolute",
    top: 95,
    alignSelf: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 999,
  },

  drawHintText: {
    color: "#1322ec",
    fontSize: 15,
    fontWeight: "500",

    backgroundColor: "transparent",
  },

  // =========================
  // SAVE BUTTON
  // =========================
  saveCircleButton: {
    position: "absolute",
    bottom: 130,

    alignSelf: "center",

    backgroundColor: "#007AFF",

    paddingHorizontal: 24,
    paddingVertical: 14,

    borderRadius: 24,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 9999,
    elevation: 20,
  },

  savePolygonButton: {
    position: "absolute",
    bottom: 130,

    alignSelf: "center",

    backgroundColor: "#16a34a",

    paddingHorizontal: 24,
    paddingVertical: 14,

    borderRadius: 24,

    zIndex: 9999,
    elevation: 20,
  },

  undoButton: {
    position: "absolute",
    bottom: 190,

    alignSelf: "center",

    backgroundColor: "#f59e0b",

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 20,

    zIndex: 9999,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // =========================
  // DEVICE CAROUSEL
  // =========================
  carouselWrapper: {
    position: "absolute",
    bottom: 90,

    width: "100%",
  },

  carouselContent: {
    paddingHorizontal: 10,
  },

  // =========================
  // GEOFENCE COLORS
  // =========================
  geofenceSelected: {
    strokeColor: "#007AFF",
    fillColor: "rgba(0,122,255,0.28)",
  },

  geofenceDefault: {
    strokeColor: "#999",
    fillColor: "rgba(0,0,0,0.10)",
  },

  // =========================
  // MODAL
  // =========================
  modalContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 150,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    zIndex: 1000,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",

    marginBottom: 12,

    color: "#111",
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 18,
  },
  modalButtonRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginLeft: 6,
  },

  modalCancelButton: {
    flex: 1,
    backgroundColor: "#999",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  refreshButton: {
    position: "absolute",
    top: 100,
    right: 16,

    zIndex: 999,
    elevation: 999,

    justifyContent: "center",
    alignItems: "center",
  },

  refreshButtonText: {
    color: "#111",
    fontSize: 36,
    fontWeight: "800",

    textShadowColor: "rgba(255,255,255,0.65)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 2,
  },
  circleSliderContainer: {
    position: "absolute",
    bottom: 220,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
  },
  geofenceButtonContainer: {
    position: "absolute",
    top: 55,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
    elevation: 20,
  },
  viewGeoButton: {
  marginLeft: 10,
},

geofenceListModal: {
  position: "absolute",
  top: 100,
  left: 20,
  right: 20,
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 16,
  maxHeight: 350,
  zIndex: 1000,
},

geofenceListTitle: {
  fontSize: 18,
  fontWeight: "600",
  marginBottom: 10,
},

geofenceListItem: {
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},

geofenceListCloseText: {
  textAlign: "center",
  marginTop: 10,
  color: "#007AFF",
},
});