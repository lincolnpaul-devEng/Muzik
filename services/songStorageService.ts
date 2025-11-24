import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types/storage';

// Storage keys
const STORAGE_KEYS = {
  SONGS: 'songs',
  RECENTLY_PLAYED: 'recentlyPlayed',
  DOWNLOADED_SONGS: 'downloadedSongs',
} as const;

class SongStorageService {
  // Initialize storage with default values
  async initialize(): Promise<void> {
    try {
      // Initialize songs storage if it doesn't exist
      const songs = await this.getSongs();
      if (!songs) {
        await AsyncStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify([]));
      }

      // Initialize recently played storage
      const recentlyPlayed = await this.getRecentlyPlayed();
      if (!recentlyPlayed) {
        await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify([]));
      }

      // Initialize downloaded songs storage
      const downloadedSongs = await this.getDownloadedSongs();
      if (!downloadedSongs) {
        await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Failed to initialize song storage:', error);
      throw error;
    }
  }

  // Save a song to the main songs collection
  async saveSong(song: Song): Promise<void> {
    try {
      const songs = await this.getSongs();
      
      // Check if song already exists
      const existingIndex = songs.findIndex(s => s.id === song.id);
      
      if (existingIndex >= 0) {
        // Update existing song
        songs[existingIndex] = song;
      } else {
        // Add new song
        songs.push(song);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
    } catch (error) {
      console.error('Failed to save song:', error);
      throw new Error('Failed to save song');
    }
  }

  // Get all songs from the main collection
  async getSongs(): Promise<Song[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SONGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get songs:', error);
      return [];
    }
  }

  // Get recently played songs
  async getRecentlyPlayed(): Promise<Song[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get recently played songs:', error);
      return [];
    }
  }

  // Update recently played songs (add a song to recently played)
  async updateRecentlyPlayed(song: Song): Promise<void> {
    try {
      const recentlyPlayed = await this.getRecentlyPlayed();
      
      // Remove if already exists to avoid duplicates
      const filtered = recentlyPlayed.filter(s => s.id !== song.id);
      
      // Add to beginning and limit to 20 songs
      const updated = [song, ...filtered].slice(0, 20);
      
      await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update recently played:', error);
      throw new Error('Failed to update recently played');
    }
  }

  // Delete a song from all collections
  async deleteSong(songId: string): Promise<void> {
    try {
      // Remove from main songs collection
      const songs = await this.getSongs();
      const updatedSongs = songs.filter(song => song.id !== songId);
      await AsyncStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(updatedSongs));

      // Remove from recently played
      const recentlyPlayed = await this.getRecentlyPlayed();
      const updatedRecentlyPlayed = recentlyPlayed.filter(song => song.id !== songId);
      await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(updatedRecentlyPlayed));

      // Remove from downloaded songs
      const downloadedSongs = await this.getDownloadedSongs();
      const updatedDownloadedSongs = downloadedSongs.filter(song => song.id !== songId);
      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify(updatedDownloadedSongs));
    } catch (error) {
      console.error('Failed to delete song:', error);
      throw new Error('Failed to delete song');
    }
  }

  // Get downloaded songs
  async getDownloadedSongs(): Promise<Song[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOADED_SONGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get downloaded songs:', error);
      return [];
    }
  }

  // Add a song to downloaded songs
  async addDownloadedSong(song: Song): Promise<void> {
    try {
      const downloadedSongs = await this.getDownloadedSongs();
      
      // Check if song already exists in downloads
      const exists = downloadedSongs.some(s => s.id === song.id);
      if (exists) {
        throw new Error('Song already exists in downloads');
      }
      
      const updated = [...downloadedSongs, song];
      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to add downloaded song:', error);
      throw new Error('Failed to add downloaded song');
    }
  }

  // Remove a song from downloaded songs
  async removeDownloadedSong(songId: string): Promise<void> {
    try {
      const downloadedSongs = await this.getDownloadedSongs();
      const updated = downloadedSongs.filter(song => song.id !== songId);
      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove downloaded song:', error);
      throw new Error('Failed to remove downloaded song');
    }
  }

  // Get song by ID from any collection
  async getSongById(songId: string): Promise<Song | undefined> {
    try {
      const songs = await this.getSongs();
      return songs.find(song => song.id === songId);
    } catch (error) {
      console.error('Failed to get song by ID:', error);
      return undefined;
    }
  }

  // Clear all song data
  async clearAllSongData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SONGS,
        STORAGE_KEYS.RECENTLY_PLAYED,
        STORAGE_KEYS.DOWNLOADED_SONGS,
      ]);
      await this.initialize();
    } catch (error) {
      console.error('Failed to clear all song data:', error);
      throw new Error('Failed to clear all song data');
    }
  }

  // Get songs count
  async getSongsCount(): Promise<number> {
    try {
      const songs = await this.getSongs();
      return songs.length;
    } catch (error) {
      console.error('Failed to get songs count:', error);
      return 0;
    }
  }

  // Get downloaded songs count
  async getDownloadedSongsCount(): Promise<number> {
    try {
      const downloadedSongs = await this.getDownloadedSongs();
      return downloadedSongs.length;
    } catch (error) {
      console.error('Failed to get downloaded songs count:', error);
      return 0;
    }
  }

  // Check if a song with the given file path already exists
  async isDuplicate(filePath: string): Promise<boolean> {
    try {
      const songs = await this.getSongs();
      return songs.some(song => song.filePath === filePath);
    } catch (error) {
      console.error('Failed to check for duplicate song:', error);
      return false; // Assume not duplicate on error
    }
  }
}

// Export a singleton instance
export const songStorageService = new SongStorageService();