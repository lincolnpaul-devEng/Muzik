import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Song,
  Playlist,
  AppSettings,
  StorageData,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
} from '../types/storage';

class StorageService {
  // Initialize storage with default values
  async initializeStorage(): Promise<void> {
    try {
      // Check if settings exist, if not set defaults
      const settings = await this.getAppSettings();
      if (!settings) {
        await this.setAppSettings(DEFAULT_SETTINGS);
      }

      // Initialize other storage with empty arrays if they don't exist
      const recentlyPlayed = await this.getRecentlyPlayed();
      if (!recentlyPlayed) {
        await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify([]));
      }

      const downloadedSongs = await this.getDownloadedSongs();
      if (!downloadedSongs) {
        await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify([]));
      }

      const playlists = await this.getPlaylists();
      if (!playlists) {
        await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
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
      const recentlyPlayed = await this.getRecentlyPlayed();
      
      // Remove if already exists to avoid duplicates
      const filtered = recentlyPlayed.filter(s => s.id !== song.id);
      
      // Add to beginning and limit to 50 songs
      const updated = [song, ...filtered].slice(0, 50);
      
      await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to add to recently played:', error);
      throw error;
    }
  }

  async clearRecentlyPlayed(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify([]));
    } catch (error) {
      console.error('Failed to clear recently played:', error);
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
      
      // Check if song already exists
      const exists = downloadedSongs.some(s => s.id === song.id);
      if (exists) {
        throw new Error('Song already exists in downloads');
      }
      
      const updated = [...downloadedSongs, song];
      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify(updated));
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
    } catch (error) {
      console.error('Failed to remove downloaded song:', error);
      throw error;
    }
  }

  async getDownloadedSongById(songId: string): Promise<Song | undefined> {
    try {
      const downloadedSongs = await this.getDownloadedSongs();
      return downloadedSongs.find(song => song.id === songId);
    } catch (error) {
      console.error('Failed to get downloaded song:', error);
      return undefined;
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

  async updatePlaylist(playlistId: string, updates: Partial<Playlist>): Promise<Playlist> {
    try {
      const playlists = await this.getPlaylists();
      const index = playlists.findIndex(p => p.id === playlistId);
      
      if (index === -1) {
        throw new Error('Playlist not found');
      }
      
      const updatedPlaylist: Playlist = {
        ...playlists[index],
        ...updates,
        updatedAt: Date.now(),
      };
      
      const updated = [...playlists];
      updated[index] = updatedPlaylist;
      
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updated));
      
      return updatedPlaylist;
    } catch (error) {
      console.error('Failed to update playlist:', error);
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

  async addSongToPlaylist(playlistId: string, songId: string): Promise<Playlist> {
    try {
      const playlists = await this.getPlaylists();
      const playlist = playlists.find(p => p.id === playlistId);
      
      if (!playlist) {
        throw new Error('Playlist not found');
      }
      
      if (playlist.songs.includes(songId)) {
        throw new Error('Song already in playlist');
      }
      
      return await this.updatePlaylist(playlistId, {
        songs: [...playlist.songs, songId],
      });
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
      throw error;
    }
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<Playlist> {
    try {
      const playlists = await this.getPlaylists();
      const playlist = playlists.find(p => p.id === playlistId);
      
      if (!playlist) {
        throw new Error('Playlist not found');
      }
      
      return await this.updatePlaylist(playlistId, {
        songs: playlist.songs.filter(id => id !== songId),
      });
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

  async updateAppSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const currentSettings = await this.getAppSettings();
      if (!currentSettings) {
        throw new Error('No app settings found');
      }
      
      const updatedSettings: AppSettings = {
        ...currentSettings,
        ...updates,
      };
      
      await this.setAppSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('Failed to update app settings:', error);
      throw error;
    }
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.RECENTLY_PLAYED,
        STORAGE_KEYS.DOWNLOADED_SONGS,
        STORAGE_KEYS.PLAYLISTS,
        STORAGE_KEYS.APP_SETTINGS,
      ]);
      await this.initializeStorage();
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  async exportData(): Promise<StorageData> {
    try {
      const [recentlyPlayed, downloadedSongs, playlists, appSettings] = await Promise.all([
        this.getRecentlyPlayed(),
        this.getDownloadedSongs(),
        this.getPlaylists(),
        this.getAppSettings(),
      ]);

      if (!appSettings) {
        throw new Error('App settings not found');
      }

      return {
        recentlyPlayed,
        downloadedSongs,
        playlists,
        appSettings,
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  async importData(data: StorageData): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(data.recentlyPlayed)),
        AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADED_SONGS, JSON.stringify(data.downloadedSongs)),
        AsyncStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(data.playlists)),
        AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(data.appSettings)),
      ]);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();