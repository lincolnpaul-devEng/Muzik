import React, { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types/storage'; // Assuming a Song type exists

const LOCAL_SONGS_STORAGE_KEY = 'localSongs';

export const useLocalMusic = () => {
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<number>(0);

  useEffect(() => {
    loadStoredSongs();
  }, []);

  const loadStoredSongs = async () => {
    try {
      const storedSongs = await AsyncStorage.getItem(LOCAL_SONGS_STORAGE_KEY);
      if (storedSongs) {
        setLocalSongs(JSON.parse(storedSongs));
      }
    } catch (e) {
      console.error("Failed to load local songs from AsyncStorage", e);
      setError("Failed to load stored songs.");
    }
  };

  const saveSongsToStorage = async (songs: Song[]) => {
    try {
      await AsyncStorage.setItem(LOCAL_SONGS_STORAGE_KEY, JSON.stringify(songs));
    } catch (e) {
      console.error("Failed to save local songs to AsyncStorage", e);
      setError("Failed to save songs locally.");
    }
  };

  const refreshLibrary = async () => {
    setIsLoading(true);
    setError(null);
    setScanProgress(0);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access media library is required!');
        setIsLoading(false);
        return;
      }

      let fetchedSongs: Song[] = [];
      let hasNextPage = true;
      let afterCursor: string | undefined = undefined;

      while (hasNextPage) {
        const assets = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
          first: 50, // Fetch 50 songs at a time
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          album: 'Download',
          after: afterCursor,
        });

        const newSongs: Song[] = assets.assets.map(asset => ({
          id: asset.id,
          title: asset.filename.replace(/\.[^/.]+$/, "") || 'Unknown Title',
          artist: 'Unknown Artist', // MediaLibrary doesn't directly provide artist/album
          album: 'Unknown Album',
          uri: asset.uri,
          duration: asset.duration,
          // Add other fields as necessary from your Song type
        }));

        fetchedSongs = [...fetchedSongs, ...newSongs];
        setScanProgress((prev) => prev + newSongs.length); // Update progress based on number of songs fetched

        hasNextPage = assets.hasNextPage;
        afterCursor = assets.endCursor;
      }
      
      setLocalSongs(fetchedSongs);
      saveSongsToStorage(fetchedSongs);
    } catch (e) {
      console.error("Error refreshing media library:", e);
      setError("Failed to scan local music library.");
    } finally {
      setIsLoading(false);
      setScanProgress(1); // Indicate completion
    }
  };

  return {
    localSongs,
    isLoading,
    error,
    refreshLibrary,
    scanProgress,
  };
};
