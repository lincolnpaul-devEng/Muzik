import * as FileSystem from 'expo-file-system';
import { songStorageService } from './songStorageService';

// Define the app's document directory structure
const BASE_DOC_DIR = FileSystem.documentDirectory;
const AUDIO_DIR = `${BASE_DOC_DIR}audio/`;
const DOWNLOADS_DIR = `${BASE_DOC_DIR}downloads/`;

class FileManager {
  constructor() {
    this.ensureBaseDirectoriesExist();
  }

  private async ensureBaseDirectoriesExist() {
    await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
    await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, { intermediates: true });
    console.log('Base directories ensured:', AUDIO_DIR, DOWNLOADS_DIR);
  }

  async moveFile(fromPath: string, toPath: string): Promise<void> {
    try {
      await FileSystem.moveAsync({
        from: fromPath,
        to: toPath,
      });
      console.log(`Moved file from ${fromPath} to ${toPath}`);
    } catch (error) {
      console.error(`Error moving file from ${fromPath} to ${toPath}:`, error);
      throw error;
    }
  }

  async copyFile(fromPath: string, toPath: string): Promise<void> {
    try {
      await FileSystem.copyAsync({
        from: fromPath,
        to: toPath,
      });
      console.log(`Copied file from ${fromPath} to ${toPath}`);
    } catch (error) {
      console.error(`Error copying file from ${fromPath} to ${toPath}:`, error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(path, { idempotent: true });
      console.log(`Deleted file: ${path}`);
    } catch (error) {
      console.error(`Error deleting file ${path}:`, error);
      throw error;
    }
  }

  async createDirectory(path: string): Promise<void> {
    try {
      await FileSystem.makeDirectoryAsync(path, { intermediates: true });
      console.log(`Ensured directory exists: ${path}`);
    } catch (error) {
      console.error(`Error creating directory ${path}:`, error);
      throw error;
    }
  }

  async getDirectorySize(path: string): Promise<number> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(path);
      if (dirInfo.exists && dirInfo.isDirectory) {
        let totalSize = 0;
        const files = await FileSystem.readDirectoryAsync(path);
        for (const file of files) {
          const fileUri = `${path}${file}`;
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (fileInfo.exists && fileInfo.isFile) {
            totalSize += fileInfo.size;
          }
        }
        return totalSize;
      }
      return 0;
    } catch (error) {
      console.error(`Error getting directory size for ${path}:`, error);
      throw error;
    }
  }

  async getFreeDiskSpace(): Promise<number> {
    try {
      // expo-file-system doesn't directly expose free disk space
      // This is a placeholder or would require native module for exact info
      console.warn('getFreeDiskSpace is a placeholder. Expo-file-system does not directly provide free disk space.');
      return Promise.resolve(0); // Return 0 or a mocked value
    } catch (error) {
      console.error('Error getting free disk space:', error);
      throw error;
    }
  }

  async cleanupOrphanedFiles(): Promise<void> {
    try {
      console.log('Cleaning up orphaned files...');
      const downloadedSongs = await songStorageService.getDownloadedSongs();
      const knownFilePaths = new Set(downloadedSongs.map(song => song.filePath));

      const filesInDownloadsDir = await FileSystem.readDirectoryAsync(DOWNLOADS_DIR);

      for (const fileName of filesInDownloadsDir) {
        const filePath = `${DOWNLOADS_DIR}${fileName}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);

        if (fileInfo.exists && fileInfo.isFile && !knownFilePaths.has(filePath)) {
          console.log(`Deleting orphaned file: ${filePath}`);
          await this.deleteFile(filePath);
        }
      }
      console.log('Orphaned file cleanup complete.');
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
      throw error;
    }
  }

  // Proper file permissions are generally handled by the OS for app's document directory
  // This function is a placeholder for potential future granular control needs
  async ensureFilePermissions(path: string): Promise<void> {
    console.log(`Ensuring file permissions for: ${path} (OS handles most in app's sandbox)`);
    // No-op for now, as Expo handles default permissions
    return Promise.resolve();
  }
}

export const fileManagerService = new FileManager();
