import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  FlatList 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../components/Header';
import { MusicCard } from '../components/MusicCard';
import { SectionHeader } from '../components/SectionHeader';
import { songStorageService } from '../services/songStorageService';
import { Song } from '../types/storage';
import { RootStackParamList } from '../types/navigation'; 
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { NowPlayingBar } from '../components/NowPlayingBar';
import { theme } from '../constants/theme'; // Import theme

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen: React.FC = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [recommendedMusic, setRecommendedMusic] = useState<Song[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { play } = useAudioPlayer();

  useEffect(() => {
    // Initialize with mock data for now
    loadMockData();
    
    // TODO: Replace with actual storage service integration
    // initializeFromStorage();
  }, []);

  const loadMockData = () => {
    // Mock data for recently played (local songs)
    const mockRecentlyPlayed: Song[] = [
      {
        id: '1',
        title: 'Summer Vibes',
        artist: 'DJ Sunshine',
        duration: 180,
        filePath: 'file:///music/summer_vibes.mp3',
        source: 'local',
        dateAdded: Date.now(),
        coverArt: require('../assets/default-album.png'), // Added coverArt
      },
      {
        id: '2', 
        title: 'Chill LoFi Mix',
        artist: 'Study Beats',
        duration: 240,
        filePath: 'file:///music/chill_lofi.mp3',
        source: 'local',
        dateAdded: Date.now(),
        coverArt: require('../assets/default-album.png'), // Added coverArt
      },
      {
        id: '3',
        title: 'Morning Motivation',
        artist: 'Energy Boost',
        duration: 210,
        filePath: 'file:///music/morning_motivation.mp3',
        source: 'local',
        dateAdded: Date.now(),
        coverArt: require('../assets/default-album.png'), // Added coverArt
      },
    ];

    // Mock data for recommended music (downloaded YouTube)
    const mockRecommended: Song[] = [
      {
        id: '4',
        title: 'Latest DJ Mix 2022',
        artist: 'Top DJs Worldwide',
        duration: 360,
        filePath: 'file:///downloads/dj_mix_2022.mp3',
        source: 'youtube',
        dateAdded: Date.now(),
        coverArt: require('../assets/default-album.png'), // Added coverArt
      },
      {
        id: '5',
        title: 'Viral TikTok Hits',
        artist: 'Trending Now',
        duration: 280,
        filePath: 'file:///downloads/tiktok_hits.mp3',
        source: 'youtube',
        dateAdded: Date.now(),
        coverArt: require('../assets/default-album.png'), // Added coverArt
      },
      {
        id: '6',
        title: 'Workout Motivation',
        artist: 'Gym Beats',
        duration: 320,
        filePath: 'file:///downloads/workout_mix.mp3',
        source: 'youtube',
        dateAdded: Date.now(),
        coverArt: require('../assets/default-album.png'), // Added coverArt
      },
      {
        id: '7',
        title: 'Relaxing Piano',
        artist: 'Calm Sounds',
        duration: 300,
        filePath: 'file:///downloads/piano_relax.mp3',
        source: 'youtube',
        dateAdded: Date.now(),
        coverArt: require('../assets/default-album.png'), // Added coverArt
      },
    ];

    setRecentlyPlayed(mockRecentlyPlayed);
    setRecommendedMusic(mockRecommended);
  };

  const initializeFromStorage = async () => {
    try {
      await songStorageService.initialize();
      const recentlyPlayedSongs = await songStorageService.getRecentlyPlayed();
      const downloadedSongs = await songStorageService.getDownloadedSongs();
      
      setRecentlyPlayed(recentlyPlayedSongs);
      setRecommendedMusic(downloadedSongs);
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  };

  const handleGetStarted = () => {
    console.log('Get Started pressed');
  };

  const handleDownload = () => {
    // Navigation is handled by the tab navigator now, so this will be
    // navigation.navigate('Download') if we were still in a stack on home.
    // However, since App.tsx is wrapped in AppNavigator, and then AppNavigator
    // has the tab navigator, 'Download' would be a tab, so a direct navigate
    // from this context would be 'navigation.navigate("BottomTabs", { screen: "Download" })'
    // For simplicity, for now, we will leave the console.log.
    // If user clicks the header download button from Home tab, it should navigate to Download tab.
    navigation.navigate('Download'); // This will navigate to the Download tab
  };

  const handleSeeAllRecent = () => {
    console.log('See All Recently Played');
  };

  const handleSeeAllRecommended = () => {
    console.log('See All Recommended Music');
  };

  const handleSongPress = (song: Song) => {
    play(song);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Component */}
        <Header onGetStarted={handleGetStarted} onDownload={handleDownload} />
        
        {/* RECENTLY PLAYED Section */}
        <SectionHeader 
          title="RECENTLY PLAYED" 
          showActionButton={true}
          onActionPress={handleSeeAllRecent}
        />
        
        <FlatList
          data={recentlyPlayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <MusicCard
              title={item.title}
              subtitle={`${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`}
              imageUrl={require('../assets/default-album.png')} // Placeholder image
              onPress={() => handleSongPress(item)}
              isDownloaded={item.source === 'local'}
              size={140}
            />
          )}
        />

        {/* RECOMMENDED MUSIC Section */}
        <SectionHeader 
          title="RECOMMENDED MUSIC" 
          showActionButton={true}
          onActionPress={handleSeeAllRecommended}
        />
        
        <View style={styles.gridContainer}>
          {recommendedMusic.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <MusicCard
                title={item.title}
                subtitle={`${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`}
                imageUrl={require('../assets/default-album.png')} // Placeholder image
                onPress={() => handleSongPress(item)}
                isDownloaded={item.source === 'youtube'}
                size={160}
              />
            </View>
          ))}
        </View>
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
  horizontalList: {
    paddingHorizontal: theme.Spacing.medium,
    paddingBottom: theme.Spacing.medium,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.Spacing.medium,
    paddingBottom: theme.Spacing.large,
  },
  gridItem: {
    width: '48%', // 2-column layout
    marginBottom: theme.Spacing.medium,
  },
});

export default HomeScreen;
