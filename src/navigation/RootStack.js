import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import AppNavigator from "./AppNavigator";
import TrackerModelScreen from "../screens/TrackerModelScreen";
import TrackerModelFormScreen from "../screens/TrackerModelFormScreen";
import UserStack from "./UserStack";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={AppNavigator}
          />

          <Stack.Screen
            name="TrackerModels"
            component={TrackerModelScreen}
          />

          <Stack.Screen
            name="TrackerModelForm"
            component={TrackerModelFormScreen}
          />
          <Stack.Screen
            name="Users"
            component={UserStack}
          />
        </>
      )}
    </Stack.Navigator>
  );
}