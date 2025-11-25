import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio } from 'expo-av';
import { Song } from '../types/storage';
import { storageService } from '../services/storageService';

interface AudioPlayerContextData {
  currentTrack: Song | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentPosition: number;
  duration: number;
  play: (song: Song) => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  loadTrack: (song: Song) => Promise<void>;
  playFromLocalFile: (filePath: string) => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextData | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setCurrentPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      setIsLoading(false);
    }
  };

  const loadTrack = async (song: Song) => {
    if (sound) {
      await sound.unloadAsync();
    }
    setIsLoading(true);
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: song.filePath },
      { shouldPlay: false },
      onPlaybackStatusUpdate
    );
    setSound(newSound);
    setCurrentTrack(song);
    await storageService.addRecentlyPlayed(song);
  };

  const play = async (song: Song) => {
    if (currentTrack?.id !== song.id) {
      await loadTrack(song);
    }
    if (sound) {
      await sound.playAsync();
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  const seekTo = async (position: number) => {
    if (sound) {
      await sound.setPositionAsync(position);
    }
  };

  const playFromLocalFile = async (filePath: string) => {
    const song: Song = {
      id: filePath,
      title: 'Local File',
      artist: 'Unknown',
      duration: 0,
      filePath,
      source: 'local',
      dateAdded: Date.now(),
      coverArt: require('../assets/default-album.png'), // Add a placeholder for cover art
    };
    await play(song);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        currentPosition,
        duration,
        play,
        pause,
        seekTo,
        loadTrack,
        playFromLocalFile,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
