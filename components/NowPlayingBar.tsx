import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { theme } from '../constants/theme'; // Import theme

export const NowPlayingBar: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    currentPosition, 
    duration, 
    play, 
    pause, 
    seekTo 
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

  const handleSeek = (value: number) => {
    seekTo(value);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  const isLocalImage = typeof currentTrack.coverArt !== 'string';

  return (
    <View style={styles.container}>
      {/* Left Section - Album Art and Song Info */}
      <View style={styles.leftSection}>
        {currentTrack.coverArt && (
          isLocalImage ? (
            <Image 
              source={currentTrack.coverArt as ImageSourcePropType} 
              style={styles.coverArtStyle}
              resizeMode="cover"
            />
          ) : (
            <Image 
              source={{ uri: currentTrack.coverArt as string }} 
              style={styles.coverArtStyle}
              resizeMode="cover"
            />
          )
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

      {/* Center Section - Progress Bar */}
      <View style={styles.centerSection}>
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>
            {formatTime(currentPosition)}
          </Text>
          <Slider
            style={styles.progressBar}
            value={currentPosition}
            maximumValue={duration}
            minimumValue={0}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={theme.Colors.primary}
            maximumTrackTintColor={theme.Colors.textMuted}
            thumbTintColor={theme.Colors.primary}
          />
          <Text style={styles.timeText}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Right Section - Controls */}
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={theme.Typography.size.large} color={theme.Colors.textPrimary} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={theme.Typography.size.h3} 
            color={theme.Colors.textPrimary} 
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.Colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.Colors.border,
    padding: theme.Spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
  },
  leftSection: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.Spacing.medium,
  },
  coverArtStyle: {
    width: 48,
    height: 48,
    borderRadius: theme.Spacing.xSmall,
    marginRight: theme.Spacing.small,
    backgroundColor: theme.Colors.divider,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: theme.Typography.size.small,
    fontWeight: theme.Typography.weight.bold,
    color: theme.Colors.textPrimary,
    marginBottom: theme.Spacing.xSmall,
  },
  artist: {
    fontSize: theme.Typography.size.xSmall,
    color: theme.Colors.textSecondary,
  },
  centerSection: {
    flex: 4,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    flex: 1,
    marginHorizontal: theme.Spacing.small,
    height: 4,
  },
  timeText: {
    fontSize: theme.Typography.size.xSmall,
    color: theme.Colors.textMuted,
    minWidth: 35,
  },
  rightSection: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  controlButton: {
    padding: theme.Spacing.small,
  },
  playPauseButton: {
    backgroundColor: theme.Colors.primary,
    borderRadius: 25,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});