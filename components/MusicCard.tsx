import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ImageSourcePropType 
} from 'react-native';
import { theme } from '../constants/theme'; // Import theme

interface MusicCardProps {
  title: string;
  subtitle: string;
  imageUrl: string | ImageSourcePropType;
  onPress?: () => void;
  isDownloaded?: boolean;
  size?: number;
}

export const MusicCard: React.FC<MusicCardProps> = ({
  title,
  subtitle,
  imageUrl,
  onPress,
  isDownloaded = false,
  size = 160
}) => {
  const isLocalImage = typeof imageUrl !== 'string';

  return (
    <TouchableOpacity 
      style={[styles.container, { width: size, height: size }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {isLocalImage ? (
          <Image 
            source={imageUrl as ImageSourcePropType} 
            style={[styles.image, { width: size - theme.Spacing.large, height: size - theme.Spacing.large }]}
            resizeMode="cover"
          />
        ) : (
          <Image 
            source={{ uri: imageUrl as string }} 
            style={[styles.image, { width: size - theme.Spacing.large, height: size - theme.Spacing.large }]}
            resizeMode="cover"
          />
        )}
        
        {isDownloaded && (
          <View style={styles.downloadBadge}>
            <Text style={styles.downloadBadgeText}>✓</Text>
          </View>
        )}
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: theme.Spacing.small,
    borderRadius: theme.Spacing.small,
    backgroundColor: theme.Colors.card,
    padding: theme.Spacing.medium,
    alignItems: 'center',
    shadowColor: theme.Colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: theme.Spacing.small,
  },
  image: {
    borderRadius: theme.Spacing.small,
    backgroundColor: theme.Colors.divider,
  },
  downloadBadge: {
    position: 'absolute',
    top: -theme.Spacing.xSmall,
    right: -theme.Spacing.xSmall,
    backgroundColor: theme.Colors.success,
    borderRadius: theme.Spacing.medium,
    width: theme.Spacing.large,
    height: theme.Spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.Colors.card,
  },
  downloadBadgeText: {
    color: theme.Colors.textPrimary,
    fontSize: theme.Typography.size.xSmall,
    fontWeight: theme.Typography.weight.bold,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: theme.Typography.size.small,
    fontWeight: theme.Typography.weight.bold,
    color: theme.Colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.Spacing.xSmall,
  },
  subtitle: {
    fontSize: theme.Typography.size.xSmall,
    color: theme.Colors.textSecondary,
    textAlign: 'center',
  },
});