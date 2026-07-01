import { StyleSheet } from "react-native";

export default StyleSheet.create({
    background: {
        flex: 1,
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)", // adjust if needed
        justifyContent: "center",
        padding: 20,
        marginTop: 40,
    },

    container: {
        backgroundColor: "rgba(255,255,255,0.1)", // glass effect
        padding: 20,
        borderRadius: 15,
    },

    title: {
        color: "#1e73be",
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        letterSpacing: 2,
    },

    input: {
        backgroundColor: "rgba(255,255,255,0.9)",
        paddingVertical: 10,   // ⬅️ reduced height
        paddingHorizontal: 14,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 16,          // ⬅️ bigger text
        color: "#111",
    },

    button: {
        backgroundColor: "#1e73be",
        paddingVertical: 10,   // ⬅️ smaller button
        borderRadius: 10,
        alignItems: "center",
        marginTop: 5,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        letterSpacing: 1,
        fontSize: 14, 
    },
});