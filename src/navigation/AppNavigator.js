import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../utils/permissions";
import { PERMISSIONS } from "../constants/permissions";
import DashboardScreen from "../screens/DashboardScreen";
import MapScreen from "../screens/MapScreen";
import HistoryScreen from "../screens/HistoryScreen";
import AlertsScreen from "../screens/AlertsScreen";
import DeviceStack from "./DeviceStack";
import SettingsScreen from "../screens/SettingsScreen";


import { commonStyles } from "../styles/commonStyles";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { user } = useAuth();
  const canViewDashboard = hasPermission(user, PERMISSIONS.VIEW_DASHBOARD);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: commonStyles.tabBar,
        tabBarActiveTintColor: "#00D4FF",
        tabBarInactiveTintColor: "#777",
      }}
    >
      {canViewDashboard && (
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "grid" : "grid-outline"} size={size} color={color} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "notifications" : "notifications-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Devices"
        component={DeviceStack}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="car-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }}
      />
      
    </Tab.Navigator>
  );
}