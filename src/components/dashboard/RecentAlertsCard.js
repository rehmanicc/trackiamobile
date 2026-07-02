import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTimeAgo } from "../../utils/date";
import dashboardStyles from "../../styles/dashboardStyles";

const getAlertColor = (type) => {
  switch (type) {
    case "BATTERY_DISCONNECTED":
      return "#F44336";
    case "GEOFENCE_EXIT":
      return "#FF9800";
    case "DEVICE_EXPIRY":
      return "#EF4444";
    case "CALL_REQUIRED":
      return "#FF6B00";
    default:
      return "#EF4444";
  }
};

const RecentAlertsCard = ({ alerts = [], onPressAlert }) => {
  return (
    <View style={dashboardStyles.alertsCard}>
      <Text style={dashboardStyles.alertsTitle}>Critical Alerts</Text>
      {alerts.length === 0 ? (
        <View style={dashboardStyles.emptyAlerts}>
          <Text style={dashboardStyles.emptyAlertsText}>No recent alerts</Text>
        </View>
      ) : (
        alerts.map((alert) => (
          <TouchableOpacity
            key={alert._id}
            style={dashboardStyles.alertItem}
            activeOpacity={0.85}
            onPress={() => onPressAlert?.(alert)}
          >
            <View
              style={[
                dashboardStyles.alertIconContainer,
                { backgroundColor: getAlertColor(alert.type) },
              ]}
            >
              <MaterialCommunityIcons
                name="bell-alert-outline"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={dashboardStyles.alertDevice}
                numberOfLines={1}
              >
                {alert.device?.registrationNumber || alert.device?.name || "Vehicle"}
              </Text>
              <Text
                style={dashboardStyles.alertType}
                numberOfLines={1}
              >
                {alert.message || alert.type}
              </Text>
            </View>
            <Text style={dashboardStyles.alertTime}>
              {getTimeAgo(alert.timestamp || alert.createdAt)}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default RecentAlertsCard;