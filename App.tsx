import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import { AppNavigator } from '@/navigation/AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

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
