
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Import Screens
import HomeScreen from '@/screens/HomeScreen';
import LibraryScreen from '@/screens/LibraryScreen';
import DownloadScreen from '@/screens/DownloadScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import NowPlayingScreen from '@/screens/NowPlayingScreen';
import { NowPlayingBar } from '@/components/NowPlayingBar';

// Import Types
import { RootStackParamList, BottomTabParamList } from '@/types/navigation';
import { theme } from '@/constants/theme';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Download') {
            iconName = focused ? 'cloud-download' : 'cloud-download-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.Colors.primary,
        tabBarInactiveTintColor: theme.Colors.textSecondary,
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Download" component={DownloadScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const RootStack = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
    return (
      <View style={{ flex: 1 }}>
        <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen 
            name="NowPlaying" 
            component={NowPlayingScreen} 
            options={{ presentation: 'modal' }} 
          />
        </Stack.Navigator>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('NowPlaying')}>
            <View>
                <NowPlayingBar />
            </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  export function AppNavigator() {
    return (
      <View style={styles.container}>
        <RootStack />
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  tabBarStyle: {
    backgroundColor: theme.Colors.background,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: 60,
    paddingBottom: 10,
  },
});
