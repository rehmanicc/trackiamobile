import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DeviceScreen from "../screens/DeviceScreen";
import DeviceFormScreen from "../screens/DeviceFormScreen";
import DeviceAccessScreen from "../screens/DeviceAccessScreen";

const Stack = createNativeStackNavigator();

export default function DeviceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DevicesMain" component={DeviceScreen} />
      <Stack.Screen name="Device" component={DeviceFormScreen} />
      <Stack.Screen name="DeviceAccess" component={DeviceAccessScreen} />
    </Stack.Navigator>
  );
}