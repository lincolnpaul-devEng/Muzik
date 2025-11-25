import * as MediaLibrary from 'expo-media-library';
import { storageService } from './storageService';
import { Song } from '../types/storage';

type ProgressCallback = (progress: number, total: number) => void;

class LocalMusicSync {
  async requestMediaLibraryPermissions(): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  }

  async scanDeviceForMusic(progressCallback?: ProgressCallback): Promise<void> {
    const hasPermission = await this.requestMediaLibraryPermissions();
    if (!hasPermission) {
      console.log('Media library permission not granted.');
      return;
    }

    const audioExtensions = ['mp3', 'm4a', 'wav', 'flac'];
    let allAudioFiles: MediaLibrary.Asset[] = [];
    let hasNextPage = true;
    let after: string | undefined = undefined;

    while (hasNextPage) {
      const { assets, endCursor, hasNextPage: newHasNextPage } = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 50, // Fetch in smaller batches
        after,
      });

      const filteredAssets = assets.filter(asset => {
        // Filter by extension for relevant audio files
        const fileExtension = asset.filename.split('.').pop()?.toLowerCase();
        return fileExtension && audioExtensions.includes(fileExtension);
      });
      
      allAudioFiles = [...allAudioFiles, ...filteredAssets];
      hasNextPage = newHasNextPage;
      after = endCursor;
    }
    
    const totalFiles = allAudioFiles.length;
    let processedFiles = 0;

    for (const asset of allAudioFiles) {
      const isDuplicate = await storageService.isDuplicate(asset.uri);
      if (!isDuplicate) {
        // Attempt to parse artist from filename
        const filenameWithoutExt = asset.filename.split('.').slice(0, -1).join('.');
        let artist = 'Unknown Artist';
        let title = filenameWithoutExt;

        // Simple heuristic: "Artist - Title" or "Title by Artist"
        if (filenameWithoutExt.includes(' - ')) {
          const parts = filenameWithoutExt.split(' - ');
          artist = parts[0].trim();
          title = parts[1].trim();
        } else if (filenameWithoutExt.includes(' by ')) {
          const parts = filenameWithoutExt.split(' by ');
          title = parts[0].trim();
          artist = parts[1].trim();
        }
        
        const song: Song = {
          id: asset.id,
          title: title,
          artist: artist,
          duration: asset.duration, // Duration is in milliseconds
          filePath: asset.uri,
          source: 'local',
          dateAdded: asset.creationTime,
          coverArt: require('../assets/default-album.png'), // Default cover art
        };
        await storageService.saveSong(song);
      }
      processedFiles++;
      if (progressCallback) {
        progressCallback(processedFiles, totalFiles);
      }
    }
  }
}

export const localMusicSyncService = new LocalMusicSync();
