import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { downloadVideoFromYouTube } from '../services/youtubeDownloader'; // Assuming this service exists
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types/storage'; // Assuming a Song type exists

const DOWNLOADED_SONGS_STORAGE_KEY = 'downloadedSongs';

export const useYouTubeDownloader = () => {
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadedSongs, setDownloadedSongs] = useState<Song[]>([]);

  useEffect(() => {
    loadDownloadedSongs();
  }, []);

  const loadDownloadedSongs = async () => {
    try {
      const storedSongs = await AsyncStorage.getItem(DOWNLOADED_SONGS_STORAGE_KEY);
      if (storedSongs) {
        setDownloadedSongs(JSON.parse(storedSongs));
      }
    } catch (e) {
      console.error("Failed to load downloaded songs from AsyncStorage", e);
      setError("Failed to load stored downloads.");
    }
  };

  const saveDownloadedSong = async (song: Song) => {
    const updatedSongs = [...downloadedSongs, song];
    setDownloadedSongs(updatedSongs);
    try {
      await AsyncStorage.setItem(DOWNLOADED_SONGS_STORAGE_KEY, JSON.stringify(updatedSongs));
    } catch (e) {
      console.error("Failed to save downloaded song to AsyncStorage", e);
      setError("Failed to save downloaded song locally.");
    }
  };

  const downloadVideo = async (url: string) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setError(null);

    try {
      // The actual download logic will be in youtubeDownloader.ts
      // This hook will orchestrate the download and update state
      const { success, filePath, songMetadata } = await downloadVideoFromYouTube(
        url,
        (progress) => setDownloadProgress(progress)
      );

      if (success && filePath && songMetadata) {
        const newSong: Song = {
          id: songMetadata.id,
          title: songMetadata.title,
          artist: songMetadata.artist || 'Unknown Artist',
          album: songMetadata.album || 'Unknown Album',
          uri: filePath, // The local file URI
          duration: songMetadata.duration,
          // Add other fields as necessary from your Song type
        };
        await saveDownloadedSong(newSong);
        // Optionally, trigger a refresh of the local music library here if useLocalMusic is integrated
      } else {
        setError('Failed to download video.');
      }
    } catch (e: any) {
      console.error("Error downloading YouTube video:", e);
      setError(e.message || "An unknown error occurred during download.");
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadProgress,
    isDownloading,
    error,
    downloadVideo,
    downloadedSongs,
  };
};
