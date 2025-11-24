// Storage data structure interfaces

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  filePath: string;
  coverArt?: string;
  source: 'local' | 'youtube';
  youtubeUrl?: string;
  dateAdded: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: string[]; // Array of song IDs
  createdAt: number;
  updatedAt: number;
  coverArt?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  audioQuality: 'low' | 'medium' | 'high';
  autoDownload: boolean;
  maxCacheSize: number;
  language: string;
  notifications: {
    downloadComplete: boolean;
    newMusic: boolean;
    playlistUpdates: boolean;
  };
}

export interface StorageData {
  recentlyPlayed: Song[];
  downloadedSongs: Song[];
  playlists: Playlist[];
  appSettings: AppSettings;
}

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  audioQuality: 'high',
  autoDownload: false,
  maxCacheSize: 1024, // 1GB in MB
  language: 'en',
  notifications: {
    downloadComplete: true,
    newMusic: true,
    playlistUpdates: true,
  },
};

// Storage keys
export const STORAGE_KEYS = {
  RECENTLY_PLAYED: 'recentlyPlayed',
  DOWNLOADED_SONGS: 'downloadedSongs',
  PLAYLISTS: 'playlists',
  APP_SETTINGS: 'appSettings',
} as const;