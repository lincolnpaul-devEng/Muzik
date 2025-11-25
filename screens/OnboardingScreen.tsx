
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@/constants/theme';

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('@/assets/home_screen.webp')}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Find Your</Text>
        <Text style={[styles.title, styles.titleMusic]}>Favourite Music</Text>
        <Text style={styles.subtitle}>Find Your Latest Favourite Music From Our collection</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    padding: theme.Spacing.large,
    paddingBottom: theme.Spacing.xLarge * 2,
  },
  title: {
    fontSize: theme.Typography.size.h1,
    fontWeight: theme.Typography.weight.bold,
    color: theme.Colors.textPrimary,
    textAlign: 'left',
  },
  titleMusic: {
    color: theme.Colors.primary,
  },
  subtitle: {
    fontSize: theme.Typography.size.medium,
    color: theme.Colors.textSecondary,
    textAlign: 'left',
    marginTop: theme.Spacing.medium,
    marginBottom: theme.Spacing.large,
  },
  button: {
    backgroundColor: theme.Colors.primary,
    paddingVertical: theme.Spacing.medium,
    paddingHorizontal: theme.Spacing.large,
    borderRadius: theme.Spacing.large,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: theme.Typography.size.medium,
    fontWeight: theme.Typography.weight.bold,
    color: theme.Colors.textPrimary,
  },
});

export default OnboardingScreen;
