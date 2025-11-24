import * as FileSystem from 'expo-file-system';
import { Song } from '../types/storage';
import { songStorageService } from './songStorageService';

type DownloadProgressCallback = (progress: number) => void;

class YouTubeDownloader {
  private youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  validateYouTubeUrl(url: string): boolean {
    return this.youtubeRegex.test(url);
  }

  async downloadAudio(
    youtubeUrl: string,
    quality: 'low' | 'medium' | 'high',
    progressCallback?: DownloadProgressCallback
  ): Promise<Song | null> {
    if (!this.validateYouTubeUrl(youtubeUrl)) {
      throw new Error('Invalid YouTube URL provided.');
    }

    console.log(`Simulating download for: ${youtubeUrl} at ${quality} quality`);

    // Simulate metadata extraction
    const simulatedTitle = `Simulated Song from YouTube ${Date.now()}`;
    const simulatedArtist = 'Simulated Artist';
    const simulatedDuration = Math.floor(Math.random() * (300 - 180 + 1)) + 180; // 3-5 minutes

    // Simulate download progress
    const totalSteps = 10;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      if (progressCallback) {
        progressCallback(i / totalSteps);
      }
    }

    // Simulate file saving to app's document directory
    const fileName = `${simulatedTitle.replace(/[^a-z0-9]/gi, '_')}.mp3`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    // In a real scenario, a backend would provide the actual audio file
    // For simulation, we'll just pretend it exists.
    // We could create an empty file or a dummy audio file here if needed for testing file system ops.
    // For now, just a mock path is sufficient.

    const newSong: Song = {
      id: `yt-${Date.now()}`,
      title: simulatedTitle,
      artist: simulatedArtist,
      duration: simulatedDuration,
      filePath: filePath,
      source: 'youtube',
      youtubeUrl: youtubeUrl,
      dateAdded: Date.now(),
      coverArt: `https://img.youtube.com/vi/${this.getYouTubeVideoId(youtubeUrl)}/hqdefault.jpg`,
    };

    await songStorageService.addSong(newSong);
    return newSong;
  }

  private getYouTubeVideoId(url: string): string | null {
    let videoId = null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    if (match && match[1]) {
      videoId = match[1];
    }
    return videoId;
  }
}

export const youtubeDownloaderService = new YouTubeDownloader();
