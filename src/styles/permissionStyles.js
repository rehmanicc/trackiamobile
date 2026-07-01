import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // 🧱 Screen container
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7", // light silver
  },

  // 📦 Inner wrapper
  content: {
    padding: 12,
    paddingTop: 20,
    paddingBottom: 30,
  },

  // 🧾 Section card
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,

    // subtle shadow (iOS + Android)
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // 🏷️ Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },

  // 🧩 Row wrapper (2-column container)
  rowWrap: {
    flexDirection: "column",
  },

 permissionItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
},

  // ✅ Selected item background
  permissionItemSelected: {
    backgroundColor: "#e6f0ff",
  },

  // 🔤 Permission text
  permissionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },

  // 🔘 Save button
  button: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});