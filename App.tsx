import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AudioPlayerProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AudioPlayerProvider>
    </SafeAreaProvider>
  );
}