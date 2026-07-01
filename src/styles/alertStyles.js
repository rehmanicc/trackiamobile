import { StyleSheet } from "react-native";
import { COLORS, SHADOW } from "./commonStyles";

export default StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#DCE7F2",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
  },

  heading: {
    color: "#0F172A",
    fontSize: 28,
    fontWeight: "800",
  },

  subHeading: {
    color: "#475569",
    marginTop: 4,
    fontSize: 13,
  },

  headerBtns: {
    flexDirection: "row",
  },

  actionBtn: {
    backgroundColor: COLORS.primary,

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 14,

    marginRight: 8,

    ...SHADOW,
  },

  clearBtn: {
    backgroundColor: "#DC2626",

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 14,

    ...SHADOW,
  },

  actionText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 13,
},
  filterList: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    alignItems: "center",
    height: 60,
  },

  filterChip: {
  backgroundColor: "#1d95b9",

  height: 42,

  paddingHorizontal: 18,

  borderRadius: 14,

  marginRight: 8,

  justifyContent: "center",
  alignItems: "center",

  borderWidth: 1,
  borderColor: "#06B6D4",

  ...SHADOW,
},

  activeChip: {
  backgroundColor: "#22C55E",
  borderColor: "#22C55E",
},

  filterText: {
  color: "#334155",
  fontWeight: "700",
  fontSize: 13,
},

  activeFilterText: {
  color: "#fff",
},

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 100,
  },

  alertCard: {
    backgroundColor: "rgba(255,255,255,0.88)",

    borderRadius: 18,

    padding: 15,

    marginBottom: 14,

    borderWidth: 1,

    ...SHADOW,
  },

  unreadCard: {
    borderColor: "#3B82F6",
  },
  selectedCard: {
  borderWidth: 2,
  borderColor: "#22C55E",
},

  highCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#DC2626",
  },

  mediumCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#F59E0B",
  },

  lowCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#64748B",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  leftRow: {
    flexDirection: "row",
    flex: 1,
  },

  icon: {
    fontSize: 24,
    marginRight: 12,
  },

  alertType: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  alertMessage: {
    color: "#475569",
    marginTop: 4,
    lineHeight: 20,
    paddingRight: 14,
    fontSize: 13,
  },

  unreadDot: {
    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor: "#2563EB",

    marginLeft: 10,
    marginTop: 6,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 14,
  },

  priorityText: {
    color: "#64748B",
    textTransform: "uppercase",
    fontSize: 11,
    fontWeight: "700",
  },

  timeText: {
    color: "#64748B",
    fontSize: 11,
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
  },

  emptyText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "600",
  },
});