
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { theme } from '@/constants/theme';

export const NowPlayingBar: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    play, 
    pause, 
  } = useAudioPlayer();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        play(currentTrack);
      }
    }
  };

  if (!currentTrack) {
    return null;
  }

  const isLocalImage = typeof currentTrack.coverArt !== 'string';

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {currentTrack.coverArt && (
          <View style={styles.coverArtShadow}>
            <Image 
              source={isLocalImage ? currentTrack.coverArt as ImageSourcePropType : { uri: currentTrack.coverArt as string }}
              style={styles.coverArtStyle}
              resizeMode="cover"
            />
          </View>
        )}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={theme.Typography.size.h3} 
            color={theme.Colors.background} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={theme.Typography.size.large} color={theme.Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: theme.Spacing.large + 20,
    left: theme.Spacing.medium,
    right: theme.Spacing.medium,
    backgroundColor: theme.Colors.card,
    borderRadius: theme.Spacing.medium,
    padding: theme.Spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverArtShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  coverArtStyle: {
    width: 48,
    height: 48,
    borderRadius: theme.Spacing.xSmall,
    marginRight: theme.Spacing.small,
  },
  songInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    fontSize: theme.Typography.size.medium,
    fontWeight: theme.Typography.weight.bold,
    color: theme.Colors.textPrimary,
  },
  artist: {
    fontSize: theme.Typography.size.small,
    color: theme.Colors.textSecondary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  controlButton: {
    padding: theme.Spacing.small,
  },
  playPauseButton: {
    backgroundColor: theme.Colors.primary,
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.Spacing.medium,
  },
});
