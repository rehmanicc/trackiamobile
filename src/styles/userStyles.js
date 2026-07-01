import { StyleSheet } from "react-native";
import { COLORS, SHADOW } from "../styles/commonStyles";
export default StyleSheet.create({

  container: {
    flex: 1,
    padding: 15,
    paddingTop: 50, 
  },

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  tabWrapper: {
    flexDirection: "row",
    marginBottom: 20,
  },

  tabBtn: {
    flex: 1,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.15)", // softer glass
    alignItems: "center",
    borderRadius: 16,
    marginHorizontal: 5,
  },

  activeTab: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,

    ...SHADOW,
  },


  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },

  fabContainer: {
    position: "absolute",
    bottom: 85,
    right: 20,
  },

  fab: {
    backgroundColor: COLORS.primary,

    height: 40,
    width: 100,

    paddingHorizontal: 20,

    borderRadius: 26,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  fabText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  subText: {
    color: COLORS.subtext,
    marginTop: 2,
  },

  status: {
    marginTop: 6,
    fontWeight: "500",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 10,
  },

  editBtn: {
    backgroundColor: "#1e73be",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,

    ...SHADOW,
  },

  deviceInfo: {
    flex: 1,
  },

  actionColumn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  iconLabel: {
    fontSize: 10,
    color: "#fff",
    marginTop: 2,
  },
  iconEdit: {
    backgroundColor: "#2563eb",
  },

  iconDelete: {
    backgroundColor: "#dc2626",
  },

  iconPermission: {
    backgroundColor: "#7c3aed",
  },
  iconAssign: {
    backgroundColor: "#059669",
  },
  logoutButton: {
    backgroundColor: "#E53935",
    marginHorizontal: 20,
    marginBottom: 90,
    marginTop: 10,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.92)",

    marginHorizontal: 16,
    marginBottom: 14,

    borderRadius: 16,

    paddingHorizontal: 14,

    height: 54,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "600",
  },

  deviceActionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
    flexWrap: "wrap",
  },

  engineBtn: {
    backgroundColor: "#111827",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  engineModal: {
    backgroundColor: "rgba(255,255,255,0.96)",

    padding: 20,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    elevation: 12,
  },

  engineModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  engineSingleLineContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  deviceHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    overflow: "hidden",
  },

  deviceDot: {
    marginHorizontal: 6,
    color: "#9CA3AF",
    fontSize: 14,
  },

  expiryInlineText: {
    fontSize: 14,
    fontWeight: "700",
  },

  engineKilledText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
  },
  
  engineModalTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
  },

  engineModalSubTitle: {
    color: "#64748B",
    fontWeight: "600",
  },

  engineModalExpiry: {
    marginBottom: 20,
    fontWeight: "600",
  },

  engineKillBtn: {
    backgroundColor: "#DC2626",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  engineReleaseBtn: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  engineBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
  },

  modalHandle: {
    width: 48,
    height: 5,
    borderRadius: 10,
    backgroundColor: "rgba(15,23,42,0.18)",
    alignSelf: "center",
    marginBottom: 18,
  },

  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(243, 6, 6, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  expiryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  engineInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  engineDot: {
    color: "#6B7280",
    marginHorizontal: 6,
    fontSize: 16,
  },

  expiryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4,
    maxWidth: 140,
  },

  expiryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  expiryText: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  permissionText: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "500",
  },

  settingInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#0F172A",
  },
});