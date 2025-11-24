import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { youtubeDownloaderService } from '../services/youtubeDownloader';
import { Song } from '../types/storage';
import { songStorageService } from '../services/songStorageService';
import { theme } from '../constants/theme'; // Import theme

const DownloadScreen = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedSongs, setDownloadedSongs] = useState<Song[]>([]);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadDownloadedSongs();
  }, []);

  const loadDownloadedSongs = async () => {
    const songs = await songStorageService.getDownloadedSongs();
    setDownloadedSongs(songs);
  };

  const handleDownload = async () => {
    if (!youtubeDownloaderService.validateYouTubeUrl(youtubeUrl)) {
      Alert.alert('Invalid URL', 'Please enter a valid YouTube URL.');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const newSong = await youtubeDownloaderService.downloadAudio(
        youtubeUrl,
        quality,
        (progress) => {
          setDownloadProgress(progress);
        }
      );
      if (newSong) {
        Alert.alert('Success', `Downloaded: ${newSong.title}`);
        setDownloadedSongs((prevSongs) => [...prevSongs, newSong]);
        setYoutubeUrl('');
      }
    } catch (error: any) {
      Alert.alert('Download Failed', error.message || 'An unknown error occurred during download.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Download from YouTube</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Paste YouTube URL here"
        value={youtubeUrl}
        onChangeText={setYoutubeUrl}
        editable={!isDownloading}
        placeholderTextColor={theme.Components.Input.placeholder}
      />

      <View style={styles.qualitySelector}>
        <Button title="Low" onPress={() => setQuality('low')} color={quality === 'low' ? theme.Colors.primary : theme.Colors.textMuted} disabled={isDownloading} />
        <Button title="Medium" onPress={() => setQuality('medium')} color={quality === 'medium' ? theme.Colors.primary : theme.Colors.textMuted} disabled={isDownloading} />
        <Button title="High" onPress={() => setQuality('high')} color={quality === 'high' ? theme.Colors.primary : theme.Colors.textMuted} disabled={isDownloading} />
      </View>

      <Button title={isDownloading ? "Downloading..." : "Download"} onPress={handleDownload} disabled={isDownloading} />

      {isDownloading && downloadProgress > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Downloading: {Math.round(downloadProgress * 100)}%</Text>
          <View style={styles.progressBar}>
            <View style={{...styles.progress, width: `${downloadProgress * 100}%`}} />
          </View>
          <ActivityIndicator size="small" color={theme.Colors.primary} />
        </View>
      )}

      <Text style={styles.listHeader}>Downloaded Videos</Text>
      <FlatList
        data={downloadedSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.videoItem}>
            <Text style={styles.videoItemTitle}>{item.title}</Text>
            <Text style={styles.videoItemSubtitle}>Artist: {item.artist} | Quality: {item.source} | Size: N/A</Text> 
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.Spacing.medium,
    backgroundColor: theme.Colors.background,
  },
  title: {
    fontSize: theme.Typography.size.h2,
    fontWeight: theme.Typography.weight.bold,
    marginBottom: theme.Spacing.large,
    textAlign: 'center',
    color: theme.Colors.textPrimary,
  },
  input: {
    ...theme.Components.Input.default,
    height: 50,
    marginBottom: theme.Spacing.medium,
    fontSize: theme.Typography.size.medium,
  },
  qualitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.Spacing.medium,
  },
  progressContainer: {
    marginVertical: theme.Spacing.medium,
    alignItems: 'center',
  },
  progressText: {
    color: theme.Colors.textPrimary,
    marginBottom: theme.Spacing.small,
  },
  progressBar: {
    height: 10,
    width: '100%',
    backgroundColor: theme.Colors.divider,
    borderRadius: 5,
    marginTop: theme.Spacing.small,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: theme.Colors.success,
    borderRadius: 5,
  },
  listHeader: {
    fontSize: theme.Typography.size.h3,
    fontWeight: theme.Typography.weight.bold,
    marginTop: theme.Spacing.xLarge,
    marginBottom: theme.Spacing.medium,
    color: theme.Colors.textPrimary,
  },
  videoItem: {
    backgroundColor: theme.Colors.card,
    padding: theme.Spacing.medium,
    borderRadius: theme.Spacing.small,
    marginBottom: theme.Spacing.small,
    shadowColor: theme.Colors.background,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  videoItemTitle: {
    fontSize: theme.Typography.size.medium,
    fontWeight: theme.Typography.weight.semibold,
    color: theme.Colors.textPrimary,
  },
  videoItemSubtitle: {
    fontSize: theme.Typography.size.small,
    color: theme.Colors.textSecondary,
    marginTop: theme.Spacing.xSmall,
  },
});

export default DownloadScreen;
