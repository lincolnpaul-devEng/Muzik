import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme'; // Import theme

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.text}>Settings content will go here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.Colors.background,
  },
  title: {
    fontSize: theme.Typography.size.h2,
    fontWeight: theme.Typography.weight.bold,
    marginBottom: theme.Spacing.large,
    color: theme.Colors.textPrimary,
  },
  text: {
    color: theme.Colors.textSecondary,
    fontSize: theme.Typography.size.medium,
  },
});

export default SettingsScreen;
