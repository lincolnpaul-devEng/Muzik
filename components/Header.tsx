import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../constants/theme'; // Import theme

interface HeaderProps {
  onGetStarted?: () => void;
  onDownload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGetStarted, onDownload }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Your Favourite Music</Text>
      <Text style={styles.subtitle}>
        Find Your Latest Favourite Music From Our collection
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={theme.Components.Button.primary} 
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <Text style={theme.Components.Button.text}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[theme.Components.Button.primary, styles.downloadButton]} 
          onPress={onDownload}
          activeOpacity={0.8}
        >
          <Text style={theme.Components.Button.text}>Download Music</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.Spacing.large,
    backgroundColor: theme.Colors.card,
    borderRadius: theme.Spacing.small,
    alignItems: 'center',
    marginHorizontal: theme.Spacing.medium,
    marginTop: theme.Spacing.xxLarge,
    shadowColor: theme.Colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: theme.Typography.size.h1,
    fontWeight: theme.Typography.weight.bold,
    color: theme.Colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.Spacing.small,
    lineHeight: theme.Typography.lineHeight.h1,
  },
  subtitle: {
    fontSize: theme.Typography.size.medium,
    color: theme.Colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.Spacing.large,
    lineHeight: theme.Typography.lineHeight.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  downloadButton: {
    backgroundColor: theme.Colors.secondary,
  },
});
