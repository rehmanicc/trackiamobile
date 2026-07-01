import { StyleSheet } from "react-native";
import {
  COLORS,
  SHADOW,
} from "./commonStyles";

export default StyleSheet.create({

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.25)",
  },

  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },

  header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
},

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    color: "#D1D5DB",
    marginTop: 4,
    fontSize: 14,
  },

  topButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
        justifyContent: "space-between",
    marginBottom: 22,
  },
  
  logoutPill: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#ef4444",
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 999,
  gap: 6,

  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 6,
  shadowOffset: {
    width: 0,
    height: 3,
  },

  elevation: 4,
},

logoutPillText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "700",
},

  topButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 13,
  marginTop: 6,
},

  card: {
    backgroundColor:
      "rgba(255,255,255,0.92)",

    borderRadius: 18,

    padding: 18,

    ...SHADOW,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 16,
  },

  cardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },

  editText: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  label: {
    color: COLORS.subtext,
    fontSize: 13,
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "600",
  },

  valueBox: {
    backgroundColor:
      "#F8FAFC",

    padding: 14,

    borderRadius: 12,

    borderWidth: 1,

    borderColor:
      COLORS.border,
  },

  valueText: {
    color: COLORS.text,
    fontSize: 15,
  },

  input: {
    backgroundColor:
      "#F8FAFC",

    borderRadius: 12,

    borderWidth: 1,

    borderColor:
      COLORS.border,

    paddingHorizontal: 14,

    paddingVertical: 12,

    color: COLORS.text,
  },

  saveButton: {
    backgroundColor:
      COLORS.primary,

    marginTop: 22,

    borderRadius: 14,

    paddingVertical: 14,

    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  topButton: {
  width: "23%",
  height: 50,
  backgroundColor: "rgb(40, 192, 230)",
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.12)",
  ...SHADOW,
},

topButtonActive: {
  backgroundColor: "#22C55E",
  borderColor: "#22C55E",
},

faqItem: {
  marginTop: 18,
},

faqQuestion: {
  fontWeight: "700",
  fontSize: 15,
  color: "#111827",
},

faqAnswer: {
  marginTop: 6,
  color: "#4B5563",
  lineHeight: 20,
},
});