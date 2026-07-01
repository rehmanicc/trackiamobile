import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { RealtimeProvider } from './src/contexts/RealtimeContext';
import RootStack from './src/navigation/RootStack';

export default function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </RealtimeProvider>
    </AuthProvider>
  );
}