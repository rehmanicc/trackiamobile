import { StyleSheet } from "react-native";

const COLORS = {
  background: "#f3f4f6",
  primary: "#2563eb",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,   // reduce if large
    paddingHorizontal: 10,
  },

  scroll: {
    padding: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f2933",
    marginBottom: 5,
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,

    borderWidth: 1,
    borderColor: "#eef2f7",
  },

  label: {
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#111",
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",

    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },

  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
  },

  // 🔥 ADMIN SELECTOR
  adminCard: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  adminCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  adminName: {
    color: "#111",
    fontWeight: "600",
  },

  adminNameActive: {
    color: "#fff",
  },

  adminPhone: {
    color: "#6b7280",
    fontSize: 12,
  },

  adminPhoneActive: {
    color: "#e0e7ff",
  },
  alertCard: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#e5e7eb",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  alertTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },

  time: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 6,
  },
  // 🔔 ALERTS SCREEN
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  listContent: {
    padding: 15,
  },

  unreadCard: {
    backgroundColor: "#ffecec",
    borderColor: "#fca5a5", // subtle red border for unread
  },

  highPriority: {
    color: "red",
  },

  mediumPriority: {
    color: "#e67e22",
  },

  lowPriority: {
    color: "#374151",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reg: {
    fontSize: 16,           // SAME SIZE
    color: "#2531d4",       // light gray
    textAlign: "center",
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#971053",
  },
  hint: {
    marginTop: 4,
    fontSize: 13,
    color: "#888",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#3b82f6",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "#3b82f6",
    borderRadius: 3,
  },
  headerTitle: {
    fontSize: 20,        // reduced
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  roleRow: {
  flexDirection: "row",
  marginBottom: 14,
},

roleBtn: {
  padding: 10,
  marginRight: 10,
  borderRadius: 6,
  backgroundColor: "#333",
},

roleBtnActive: {
  backgroundColor: "#00D4FF",
},

roleBtnText: {
  color: "#fff",
},

dropdownSelector: {
  backgroundColor: "#1E293B",
  borderRadius: 10,
  padding: 14,
  marginBottom: 12,
},

dropdownText: {
  color: "#fff",
},

dropdownContainer: {
  backgroundColor: "#111827",
  borderRadius: 12,
  padding: 10,
  marginBottom: 14,
  maxHeight: 220,
},

dropdownSearch: {
  backgroundColor: "#1E293B",
  color: "#fff",
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 10,
  marginBottom: 10,
},

dropdownItem: {
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#222",
},

dropdownItemText: {
  color: "#fff",
},
});