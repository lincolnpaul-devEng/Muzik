import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ProgressBarAndroid } from 'react-native';
import { localMusicSyncService } from '../services/localMusicSync';
import { theme } from '../constants/theme'; // Import theme

const LibraryScreen = () => {
  const [scanProgress, setScanProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setTotalFiles(0);
    await localMusicSyncService.scanDeviceForMusic((progress, total) => {
      setScanProgress(progress);
      setTotalFiles(total);
    });
    setIsScanning(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Library</Text>
      <Button 
        title="Scan for Music" 
        onPress={handleScan} 
        disabled={isScanning} 
        color={theme.Colors.primary} 
      />
      {isScanning && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Scanning... {scanProgress} / {totalFiles}</Text>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={totalFiles > 0 ? scanProgress / totalFiles : 0}
            color={theme.Colors.primary}
            style={styles.progressBar}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.Colors.background,
  },
  title: {
    fontSize: theme.Typography.size.h2,
    fontWeight: theme.Typography.weight.bold,
    marginBottom: theme.Spacing.large,
    color: theme.Colors.textPrimary,
  },
  progressContainer: {
    marginTop: theme.Spacing.large,
    width: '80%',
  },
  progressText: {
    color: theme.Colors.textPrimary,
    marginBottom: theme.Spacing.small,
  },
  progressBar: {
    height: 10,
  },
});

export default LibraryScreen;
