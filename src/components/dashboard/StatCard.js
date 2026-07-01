import React from "react";
import { View, Text } from "react-native";
import dashboardStyles from "../../styles/dashboardStyles";

const StatCard = ({ title, value, icon, color = "#C0C7D1" }) => {
  return (
    <View style={[dashboardStyles.statCard, { borderColor: color }]}>
      <View style={dashboardStyles.statTopRow}>
        <Text style={dashboardStyles.statValue}>{value}</Text>
        <View style={[dashboardStyles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
      </View>
      <Text style={dashboardStyles.statTitle}>{title}</Text>
    </View>
  );
};

export default StatCard;