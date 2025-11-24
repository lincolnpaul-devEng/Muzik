import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppSettings = {
  theme: 'dark' | 'light';
  audioQuality: 'low' | 'medium' | 'high';
  autoDownload: boolean;
  downloadLocation: string; // e.g., FileSystem.documentDirectory
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  audioQuality: 'medium',
  autoDownload: false,
  downloadLocation: '', // Will be set to FileSystem.documentDirectory later
};

const SETTINGS_STORAGE_KEY = 'appSettings';

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (e) {
      console.error("Failed to load app settings from AsyncStorage", e);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save app settings to AsyncStorage", e);
    }
  };

  return {
    settings,
    updateSettings,
    theme: settings.theme,
    audioQuality: settings.audioQuality,
    autoDownload: settings.autoDownload,
    downloadLocation: settings.downloadLocation,
  };
};
