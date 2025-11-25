
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { theme } from '@/constants/theme';

const NowPlayingScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    currentTrack,
    isPlaying,
    currentPosition,
    duration,
    play,
    pause,
    seekTo,
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={28} color={theme.Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NOW PLAYING</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.coverArtContainer}>
            <Image
              source={typeof currentTrack.coverArt === 'string' ? { uri: currentTrack.coverArt } : currentTrack.coverArt as ImageSourcePropType}
              style={styles.coverArt}
            />
        </View>

        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{currentTrack.title}</Text>
          <Text style={styles.artist}>{currentTrack.artist}</Text>
        </View>

        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            value={currentPosition}
            maximumValue={duration}
            minimumValue={0}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={theme.Colors.primary}
            maximumTrackTintColor={theme.Colors.textSecondary}
            thumbTintColor={theme.Colors.primary}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="shuffle" size={28} color={theme.Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-skip-back" size={32} color={theme.Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color={theme.Colors.background} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-skip-forward" size={32} color={theme.Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="repeat" size={28} color={theme.Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.Colors.background,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.Spacing.medium,
        paddingTop: theme.Spacing.large,
      },
      headerTitle: {
        color: theme.Colors.textPrimary,
        fontSize: theme.Typography.size.medium,
        fontWeight: theme.Typography.weight.bold,
      },
      content: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: theme.Spacing.large,
        paddingBottom: theme.Spacing.large,
      },
      coverArtContainer: {
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
      },
      coverArt: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: theme.Spacing.medium,
      },
      songDetails: {
        alignItems: 'center',
      },
      songTitle: {
        fontSize: theme.Typography.size.h2,
        fontWeight: theme.Typography.weight.bold,
        color: theme.Colors.textPrimary,
        textAlign: 'center',
        marginBottom: theme.Spacing.small,
      },
      artist: {
        fontSize: theme.Typography.size.large,
        color: theme.Colors.textSecondary,
        textAlign: 'center',
      },
      progressContainer: {
        width: '100%',
      },
      slider: {
        width: '100%',
        height: 40,
      },
      timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: -theme.Spacing.small,
      },
      timeText: {
        color: theme.Colors.textSecondary,
        fontSize: theme.Typography.size.small,
      },
      controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      },
      controlButton: {
        padding: theme.Spacing.medium,
      },
      playPauseButton: {
        backgroundColor: theme.Colors.primary,
        borderRadius: 50,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export default NowPlayingScreen;
