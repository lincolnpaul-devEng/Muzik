import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Song,
  Playlist,
  AppSettings,
  StorageData,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
} from '@/types/storage';

class StorageService {
  // Initialize storage with default values
  async initializeStorage(): Promise<void> {
    try {
      const keys = [
        STORAGE_KEYS.APP_SETTINGS,
        STORAGE_KEYS.RECENTLY_PLAYED,
        STORAGE_KEYS.DOWNLOADED_SONGS,
        STORAGE_KEYS.PLAYLISTS,
        STORAGE_KEYS.SONGS, // Added SONGS key
      ];
      const stores = await AsyncStorage.multiGet(keys);

      const operations: [string, string][] = [];

      if (!stores[0][1]) {
        operations.push([STORAGE_KEYS.APP_SETTINGS, JSON.stringify(DEFAULT_SETTINGS)]);
      }
      if (!stores[1][1]) {
        operations.push([STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify([])]);
      }
      if (!stores[2][1]) {
        operations.push([STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify([])]);
      }
      if (!stores[3][1]) {
        operations.push([STORAGE_KEYS.PLAYLISTS, JSON.stringify([])]);
      }
      if (!stores[4][1]) {
        operations.push([STORAGE_KEYS.SONGS, JSON.stringify([])]);
      }

      if (operations.length > 0) {
        await AsyncStorage.multiSet(operations);
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  // Master Song List
  async getSongs(): Promise<Song[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SONGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get songs:', error);
      return [];
    }
  }

  async saveSong(song: Song): Promise<void> {
    try {
      const songs = await this.getSongs();
      const existingIndex = songs.findIndex(s => s.id === song.id);
      if (existingIndex >= 0) {
        songs[existingIndex] = song; // Update existing
      } else {
        songs.push(song); // Add new
      }
      await AsyncStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
    } catch (error) {
      console.error('Failed to save song:', error);
      throw error;
    }
  }

  async isDuplicate(filePath: string): Promise<boolean> {
    try {
      const songs = await this.getSongs();
      return songs.some(song => song.filePath === filePath);
    } catch (error) {
      console.error('Failed to check for duplicate song:', error);
      return false;
    }
  }


  // Recently Played Songs
  async getRecentlyPlayed(): Promise<Song[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get recently played:', error);
      return [];
    }
  }

  async addToRecentlyPlayed(song: Song): Promise<void> {
    try {
      let recentlyPlayed = await this.getRecentlyPlayed();
      recentlyPlayed = recentlyPlayed.filter(s => s.id !== song.id);
      const updated = [song, ...recentlyPlayed].slice(0, 50);
      await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to add to recently played:', error);
      throw error;
    }
  }

  // Downloaded Songs
  async getDownloadedSongs(): Promise<Song[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOADED_SONGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get downloaded songs:', error);
      return [];
    }
  }

  async addDownloadedSong(song: Song): Promise<void> {
    try {
      const downloadedSongs = await this.getDownloadedSongs();
      if (downloadedSongs.some(s => s.id === song.id)) {
        throw new Error('Song already exists in downloads');
      }
      const updated = [...downloadedSongs, song];
      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify(updated));
      await this.saveSong(song); // Also save to master list
    } catch (error) {
      console.error('Failed to add downloaded song:', error);
      throw error;
    }
  }
  
  async removeDownloadedSong(songId: string): Promise<void> {
    try {
      const downloadedSongs = await this.getDownloadedSongs();
      const updated = downloadedSongs.filter(song => song.id !== songId);
      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify(updated));
      
      // Also remove from the master list if it's a downloaded song
      const songs = await this.getSongs();
      const updatedSongs = songs.filter(s => s.id !== songId);
      await AsyncStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(updatedSongs));

    } catch (error) {
      console.error('Failed to remove downloaded song:', error);
      throw error;
    }
  }

  // Playlists
  async getPlaylists(): Promise<Playlist[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get playlists:', error);
      return [];
    }
  }

  async createPlaylist(playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<Playlist> {
    try {
      const playlists = await this.getPlaylists();
      const timestamp = Date.now();
      const newPlaylist: Playlist = {
        ...playlist,
        id: `playlist_${timestamp}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const updated = [...playlists, newPlaylist];
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updated));
      return newPlaylist;
    } catch (error) {
      console.error('Failed to create playlist:', error);
      throw error;
    }
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    try {
      const playlists = await this.getPlaylists();
      const updated = playlists.filter(p => p.id !== playlistId);
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      throw error;
    }
  }

  async addSongToPlaylist(playlistId: string, songId: string): Promise<void> {
    try {
        let playlists = await this.getPlaylists();
        const playlistIndex = playlists.findIndex(p => p.id === playlistId);
        if (playlistIndex === -1) {
            throw new Error('Playlist not found');
        }
        if (playlists[playlistIndex].songs.includes(songId)) {
            return; // Song already in playlist
        }
        playlists[playlistIndex].songs.push(songId);
        playlists[playlistIndex].updatedAt = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (error) {
        console.error('Failed to add song to playlist:', error);
        throw error;
    }
}

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    try {
      let playlists = await this.getPlaylists();
      const playlistIndex = playlists.findIndex(p => p.id === playlistId);
       if (playlistIndex === -1) {
            throw new Error('Playlist not found');
      }
      playlists[playlistIndex].songs = playlists[playlistIndex].songs.filter(id => id !== songId);
      playlists[playlistIndex].updatedAt = Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (error) {
        console.error('Failed to remove song from playlist:', error);
        throw error;
    }
  }

  // App Settings
  async getAppSettings(): Promise<AppSettings | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get app settings:', error);
      return null;
    }
  }

  async setAppSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to set app settings:', error);
      throw error;
    }
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    try {
      const allKeys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(allKeys);
      await this.initializeStorage();
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
