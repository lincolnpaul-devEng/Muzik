import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types/storage'; // Assuming a Song type exists

const RECENTLY_PLAYED_STORAGE_KEY = 'recentlyPlayedSongs';
const MAX_RECENTLY_PLAYED = 10;

export const useRecentlyPlayed = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);

  useEffect(() => {
    loadRecentlyPlayed();
  }, []);

  const loadRecentlyPlayed = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENTLY_PLAYED_STORAGE_KEY);
      if (stored) {
        setRecentlyPlayed(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recently played songs from AsyncStorage", e);
    }
  };

  const saveRecentlyPlayed = async (songs: Song[]) => {
    try {
      await AsyncStorage.setItem(RECENTLY_PLAYED_STORAGE_KEY, JSON.stringify(songs));
    } catch (e) {
      console.error("Failed to save recently played songs to AsyncStorage", e);
    }
  };

  const addToRecentlyPlayed = (song: Song) => {
    setRecentlyPlayed((prev) => {
      // Remove if already exists to move to top
      const filtered = prev.filter((item) => item.id !== song.id);
      const newRecentlyPlayed = [song, ...filtered].slice(0, MAX_RECENTLY_PLAYED);
      saveRecentlyPlayed(newRecentlyPlayed);
      return newRecentlyPlayed;
    });
  };

  const clearRecentlyPlayed = () => {
    setRecentlyPlayed([]);
    AsyncStorage.removeItem(RECENTLY_PLAYED_STORAGE_KEY);
  };

  return {
    recentlyPlayed,
    addToRecentlyPlayed,
    clearRecentlyPlayed,
  };
};
