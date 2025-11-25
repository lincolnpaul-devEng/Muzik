
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MusicCard } from '@/components/MusicCard';
import { SectionHeader } from '@/components/SectionHeader';
import { songStorageService } from '@/services/songStorageService';
import { Song } from '@/types/storage';
import { RootStackParamList } from '@/types/navigation';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Main'
>;

const HomeScreen: React.FC = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [recommendedMusic, setRecommendedMusic] = useState<Song[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { play } = useAudioPlayer();

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockRecentlyPlayed: Song[] = [
      {
        id: '1',
        title: 'Baby',
        artist: 'Justin Bieber',
        duration: 180,
        filePath: 'file:///music/summer_vibes.mp3',
        source: 'local',
        dateAdded: Date.now(),
        coverArt: require('../assets/thumbnail.jpg'),
      },
      {
        id: '2',
        title: 'Love Me',
        artist: 'Alex',
        duration: 240,
        filePath: 'file:///music/chill_lofi.mp3',
        source: 'local',
        dateAdded: Date.now(),
        coverArt: require('../assets/thumbnail.jpg'),
      },
      {
        id: '3',
        title: 'Party Mix',
        artist: 'DJ Shake',
        duration: 210,
        filePath: 'file:///music/morning_motivation.mp3',
        source: 'local',
        dateAdded: Date.now(),
        coverArt: require('../assets/thumbnail.jpg'),
      },
    ];

    const mockRecommended: Song[] = [
      {
        id: '4',
        title: 'Latest DJ Mix 2022',
        artist: '20 Songs',
        duration: 360,
        filePath: 'file:///downloads/dj_mix_2022.mp3',
        source: 'youtube',
        dateAdded: Date.now(),
        coverArt: require('../assets/thumbnail.jpg'),
      },
      {
        id: '5',
        title: 'Party Mix',
        artist: '31 Songs',
        duration: 280,
        filePath: 'file:///downloads/tiktok_hits.mp3',
        source: 'youtube',
        dateAdded: Date.now(),
        coverArt: require('../assets/thumbnail.jpg'),
      },
      {
        id: '6',
        title: 'Latest Party Mix',
        artist: '42 Songs',
        duration: 320,
        filePath: 'file:///downloads/workout_mix.mp3',
        source: 'youtube',
        dateAdded: Date.now(),
        coverArt: require('../assets/thumbnail.jpg'),
      },
      {
        id: '7',
        title: 'Justing Biber',
        artist: '30 Songs',
        duration: 300,
        filePath: 'file:///downloads/piano_relax.mp3',
        source: 'youtube',
        dateAdded: Date.now(),
        coverArt: require('../assets/thumbnail.jpg'),
      },
    ];

    setRecentlyPlayed(mockRecentlyPlayed);
    setRecommendedMusic(mockRecommended);
  };

  const handleSongPress = (song: Song) => {
    play(song);
  };

  const renderRecommendedItem = ({ item }: { item: Song }) => (
    <View style={styles.recommendedItemContainer}>
        <MusicCard
          title={item.title}
          subtitle={item.artist}
          imageUrl={item.coverArt}
          onPress={() => handleSongPress(item)}
          size={50} />
      <Ionicons name="heart-outline" size={24} color={theme.Colors.textSecondary} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.Colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search Song"
                    placeholderTextColor={theme.Colors.textSecondary}
                    style={styles.searchInput}
                />
            </View>

            <SectionHeader title="RECENTLY PLAYED" />
            <FlatList
                data={recentlyPlayed}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.horizontalList}
                renderItem={({ item }) => (
                    <MusicCard
                    title={item.title}
                    subtitle={item.artist}
                    imageUrl={item.coverArt}
                    onPress={() => handleSongPress(item)}
                    size={140}
                    />
                )}
            />

            <SectionHeader title="RECOMMENDED MUSIC" />
            <FlatList
                data={recommendedMusic}
                keyExtractor={(item) => item.id}
                renderItem={renderRecommendedItem}
            />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.Colors.elevation,
    borderRadius: theme.Spacing.small,
    paddingHorizontal: theme.Spacing.medium,
    margin: theme.Spacing.medium,
  },
  searchIcon: {
    marginRight: theme.Spacing.small,
  },
  searchInput: {
    flex: 1,
    color: theme.Colors.textPrimary,
    fontSize: theme.Typography.size.medium,
    height: 40,
  },
  horizontalList: {
    paddingHorizontal: theme.Spacing.medium,
    paddingBottom: theme.Spacing.medium,
  },
  recommendedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.Spacing.medium,
    paddingVertical: theme.Spacing.small,
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
