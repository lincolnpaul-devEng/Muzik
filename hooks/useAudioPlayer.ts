import React, { useState, useEffect, useContext } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioPlayerContext } from '../contexts/AudioPlayerContext'; // Assuming this context exists

export const useAudioPlayer = () => {
  const { currentTrack, isPlaying, isLoading, position, duration, play, pause, loadTrack, seekTo, sound } = useContext(AudioPlayerContext);

  // You would typically manage the sound object and its state here within the context
  // This hook now primarily consumes from the context

  return {
    currentTrack,
    isPlaying,
    isLoading,
    position,
    duration,
    play,
    pause,
    loadTrack,
    seekTo,
  };
};
