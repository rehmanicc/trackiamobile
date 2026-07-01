import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  map: {
    flex: 1,
  },

  /* ================= TOP TABS ================= */

  tabWrapper: {
    position: "absolute",
    top: 32,
    left: 16,
    right: 16,
    zIndex: 1000,
    elevation: 1000,
    flexDirection: "row",
    backgroundColor: "#0B0B0B",
    borderRadius: 26,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  tabBtn: {
    flex: 1,

    height: 42,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#3b82f6",
  },

  tabText: {
    color: "#fff",

    fontSize: 14,
    fontWeight: "700",
  },

  /* ================= TOP CONTROLS ================= */

  topControls: {
    position: "absolute",

    top: 90,
    left: 16,
    right: 16,

    zIndex: 999,
    elevation: 999,
  },

  tripControls: {
    position: "absolute",

    top: 90,
    left: 16,
    right: 16,

    zIndex: 999,
    elevation: 999,

    flexDirection: "row",
    alignItems: "center",
  },

  modeRow: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 18,
    padding: 4,
  },

  modeBtn: {
    width: 85,
    height: 30,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(73, 177, 247, 0.92)",
    marginRight: 8,
  },

  activeMode: {
    backgroundColor: "#5894f3",
  },

  modeText: {
    color: "#100cda",

    fontSize: 14,
    fontWeight: "700",
  },
  dateRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 8,
  },

  dateBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.82)",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 8,
  },

  dateText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },

  searchBtn: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#3b82f6",

    justifyContent: "center",
    alignItems: "center",
  },

  searchText: {
    color: "#fff",
    fontWeight: "700",
  },

  /* ================= VEHICLES ================= */

  carouselWrapper: {
    position: "absolute",
    bottom: 88,
    width: "100%",
    zIndex: 50,
  },

  carouselContent: {
    paddingHorizontal: 10,
  },

  /* ================= PLAYBACK ================= */

  sliderWrapper: {
    position: "absolute",

    left: 16,
    right: 16,
    bottom: 100,

    backgroundColor: "rgba(0,0,0,0.85)",

    borderRadius: 18,

    paddingHorizontal: 12,
    paddingVertical: 8,

    zIndex: 100,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  timeText: {
    color: "#ccc",
    fontSize: 12,
  },

  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  inlineControlBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#222",

    justifyContent: "center",
    alignItems: "center",

    marginHorizontal: 5,
  },

  controlText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  speedRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },

  speedBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#222",
    marginHorizontal: 5,
  },

  activeSpeed: {
    backgroundColor: "#3b82f6",
  },

  /* ================= ANALYTICS ================= */

  analyticsWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",

    backgroundColor: "#C7CDD6",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 92,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: -3,
    },

    elevation: 10,
  },

  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },

  card: {
    width: "48%",

    backgroundColor: "#E5E7EB",

    borderRadius: 22,

    paddingVertical: 16,
    paddingHorizontal: 16,

    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  cardTitle: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "600",
  },

  cardValue: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8,
  },

  /* ================= STATES ================= */

  loadingHistoryText: {
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
    color: "#aaa",
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  loadingTripBox: {
    position: "absolute",
    top: 150,
    alignSelf: "center",

    backgroundColor: "#111",
    borderRadius: 12,
    padding: 10,
  },

  loadingTripText: {
    color: "#fff",
  },

  /* ================= MARKER ================= */

  carMarkerWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  carMarker: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
  floatingSpeed: {
    position: "absolute",
    top: 140,
    right: 18,
    backgroundColor: "rgba(0,0,0,0.82)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    zIndex: 999,
    elevation: 8,
  },

  floatingSpeedText: {
    color: "#fff",

    fontSize: 16,
    fontWeight: "700",
  },
  analyticsCloseBtn: {
    position: "absolute",
    top: 12,
    right: 12,

    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: "#EF4444",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,

    zIndex: 99,
  },

  analyticsCloseText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});