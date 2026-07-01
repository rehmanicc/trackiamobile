import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({

    // ======================
    // SCREEN
    // ======================

    container: {
        flex: 1,
        backgroundColor: "#C7CDD6",
    },

    contentContainer: {
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 120,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#C7CDD6",
    },

    // ======================
    // HEADER
    // ======================

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
        marginTop: 6,
    },

    greeting: {
        color: "#111827",
        fontSize: 30,
        fontWeight: "800",
        letterSpacing: 0.3,
    },

    subGreeting: {
        color: "#4B5563",
        fontSize: 15,
        marginTop: 4,
        fontWeight: "500",
    },

    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#E5E7EB",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 3,
        },

        elevation: 3,
    },

    // ======================
    // STATS GRID
    // ======================

    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    statCard: {
        width: (width - 40) / 2,
        backgroundColor: "#E5E7EB",
        borderRadius: 22,

        paddingVertical: 11,
        paddingHorizontal: 14,

        marginBottom: 12,

        borderWidth: 1.4,

        minHeight: 90,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },

    // 🔥 TOP ROW
    statTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    statValue: {
        color: "#111827",
        fontSize: 32,
        fontWeight: "800",
    },

    statTitle: {
        color: "#4B5563",
        fontSize: 14,
        fontWeight: "600",
    },

    // ======================
    // ANALYTICS
    // ======================

    chartContainer: {
        backgroundColor: "#E5E7EB",
        borderRadius: 24,

        paddingTop: 6,
        paddingBottom: 0,

        marginTop: 4,

        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },

    analyticsTitle: {
        color: "#000000",
        fontSize: 17,
        fontWeight: "700",

        marginBottom: -8,
        marginTop: 0,

        textAlign: "center",
    },

    analyticsPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },

    analyticsText: {
        color: "#4B5563",
        marginTop: 10,
        fontSize: 14,
    },

    // ======================
    // QUICK ACTIONS
    // ======================

    quickActionsCard: {
        backgroundColor: "#E5E7EB",
        borderRadius: 22,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginTop: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },

    quickActionsTitle: {
        color: "#111827",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
    },

    quickActionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    quickButton: {
        width: "60",
        backgroundColor: "#D1D5DB",

        borderRadius: 16,

        paddingVertical: 12,

        justifyContent: "center",
        alignItems: "center",
    },

    quickButtonText: {
        color: "#111827",

        marginTop: 6,

        fontSize: 13,
        fontWeight: "600",
    },

    alertsCard: {
        backgroundColor: "#E5E7EB",
        borderLeftWidth: 5,
        borderLeftColor: "#EF4444",
        borderRadius: 22,

        paddingVertical: 14,
        paddingHorizontal: 16,

        marginTop: 14,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },

    alertsTitle: {
        color: "#111827",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },

    emptyAlerts: {
        paddingVertical: 20,
        alignItems: "center",
    },

    emptyAlertsText: {
        color: "#6B7280",
        fontSize: 14,
    },

    alertItem: {
        flexDirection: "row",
        alignItems: "center",

        paddingVertical: 10,

        borderBottomWidth: 1,
        borderBottomColor: "#D1D5DB",
    },

    alertIconContainer: {
        width: 38,
        height: 38,

        borderRadius: 12,

        justifyContent: "center",
        alignItems: "center",

        marginRight: 12,
    },

    alertDevice: {
        color: "#111827",
        fontSize: 14,
        fontWeight: "700",
    },

    alertType: {
        color: "#4B5563",
        fontSize: 13,
        marginTop: 2,
    },

    alertTime: {
        color: "#6B7280",
        fontSize: 12,
        marginLeft: 8,
    },
    quickActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
},
});