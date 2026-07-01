import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import UserScreen from "../screens/UserScreen";
import UserFormScreen from "../screens/UserFormScreen";
import UserPermissionsScreen from "../screens/UserPermissionsScreen";
import AssignDevicesScreen from "../screens/AssignDevicesScreen";

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Users" component={UserScreen} />
      <Stack.Screen name="User" component={UserFormScreen} />
      <Stack.Screen name="UserPermissions" component={UserPermissionsScreen} />
      <Stack.Screen name="AssignDevices" component={AssignDevicesScreen} />
    </Stack.Navigator>
  );
}