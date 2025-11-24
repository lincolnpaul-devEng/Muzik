import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types/storage'; // Assuming a Song type exists

export type Playlist = {
  id: string;
  name: string;
  songs: Song[];
};

const PLAYLISTS_STORAGE_KEY = 'userPlaylists';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const storedPlaylists = await AsyncStorage.getItem(PLAYLISTS_STORAGE_KEY);
      if (storedPlaylists) {
        setPlaylists(JSON.parse(storedPlaylists));
      }
    } catch (e) {
      console.error("Failed to load playlists from AsyncStorage", e);
    }
  };

  const savePlaylists = async (updatedPlaylists: Playlist[]) => {
    try {
      await AsyncStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(updatedPlaylists));
      setPlaylists(updatedPlaylists);
    } catch (e) {
      console.error("Failed to save playlists to AsyncStorage", e);
    }
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(), // Simple unique ID
      name,
      songs: [],
    };
    const updatedPlaylists = [...playlists, newPlaylist];
    savePlaylists(updatedPlaylists);
  };

  const addToPlaylist = (playlistId: string, song: Song) => {
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        // Prevent duplicate songs in a playlist
        if (!playlist.songs.some((s) => s.id === song.id)) {
          return { ...playlist, songs: [...playlist.songs, song] };
        }
      }
      return playlist;
    });
    savePlaylists(updatedPlaylists);
  };

  const removeFromPlaylist = (playlistId: string, songId: string) => {
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        return { ...playlist, songs: playlist.songs.filter((song) => song.id !== songId) };
      }
      return playlist;
    });
    savePlaylists(updatedPlaylists);
  };

  const deletePlaylist = (playlistId: string) => {
    const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);
    savePlaylists(updatedPlaylists);
  };

  return {
    playlists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist,
  };
};
