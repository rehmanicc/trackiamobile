import React from "react";
import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import dashboardStyles from "../../styles/dashboardStyles";

const screenWidth = Dimensions.get("window").width;

const VehiclePieChart = ({ moving, stopped, expired }) => {
  const data = [
    { name: "Moving", population: moving, color: "#1DB954", legendFontColor: "#111827", legendFontSize: 13 },
    { name: "Stopped", population: stopped, color: "#FF9800", legendFontColor: "#111827", legendFontSize: 13 },
    { name: "Expired", population: expired, color: "#F44336", legendFontColor: "#111827", legendFontSize: 13 },
  ];

  return (
    <View style={dashboardStyles.chartContainer}>
      <Text style={dashboardStyles.analyticsTitle}>Vehicle Distribution</Text>
      <PieChart
        data={data}
        width={screenWidth - 70}
        height={170}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"12"}
        chartConfig={{ color: () => `#111827` }}
        absolute
      />
    </View>
  );
};

export default VehiclePieChart;