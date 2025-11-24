import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme'; // Import theme

interface SectionHeaderProps {
  title: string;
  showActionButton?: boolean;
  onActionPress?: () => void;
  actionText?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showActionButton = false,
  onActionPress,
  actionText = 'See All'
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title.toUpperCase()}
      </Text>
      
      {showActionButton && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onActionPress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>
            {actionText}
          </Text>
          <Ionicons name="chevron-forward" size={theme.Typography.size.medium} color={theme.Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.Spacing.medium,
    paddingVertical: theme.Spacing.small,
    backgroundColor: theme.Colors.background,
  },
  title: {
    fontSize: theme.Typography.size.large,
    fontWeight: theme.Typography.weight.bold,
    color: theme.Colors.textPrimary,
    letterSpacing: 0.5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.Spacing.xSmall,
  },
  actionText: {
    fontSize: theme.Typography.size.small,
    color: theme.Colors.primary,
    marginRight: theme.Spacing.xSmall,
    fontWeight: theme.Typography.weight.medium,
  },
});