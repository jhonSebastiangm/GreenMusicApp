import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Audio } from 'expo-av';
import { songsService } from '../../services/songs.service';
import { Song } from '../../types';
import { useAuth } from '../../context/AuthContext';

const PlayerScreen = ({ route, navigation }: any) => {
  const { song }: { song: Song } = route.params;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useAuth();
  const [playedComplete, setPlayedComplete] = useState(false);

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [song]);

  const loadSound = async () => {
    try {
      setLoading(true);
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.audio_url },
        { shouldPlay: false },
        onPlaybackStatusUpdate,
      );

      setSound(newSound);
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
    } catch (error) {
      console.error('Error loading sound:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPlaybackStatusUpdate = async (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);

      // Verificar si la canción se reprodujo completamente
      if (
        status.didJustFinish &&
        !playedComplete &&
        status.positionMillis >= status.durationMillis - 1000
      ) {
        setPlayedComplete(true);
        await handlePlayComplete();
      }
    }
  };

  const handlePlayComplete = async () => {
    try {
      await songsService.registerPlayComplete(song.id);
      if (user) {
        await refreshUser();
      }
    } catch (error) {
      console.error('Error registering play complete:', error);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      {song.cover_url ? (
        <Image source={{ uri: song.cover_url }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverText}>🎵</Text>
        </View>
      )}

      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>
        {song.artist?.name || 'Artista desconocido'}
      </Text>

      {song.description && (
        <Text style={styles.description}>{song.description}</Text>
      )}

      <View style={styles.progressContainer}>
        <Text style={styles.time}>{formatTime(position)}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(position / duration) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>

      <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
        <Text style={styles.playButtonText}>
          {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.pointsInfo}>
        Ganarás {song.points_per_play} puntos al completar la reproducción
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  coverPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  coverText: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  artist: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
    marginBottom: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginHorizontal: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsInfo: {
    textAlign: 'center',
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PlayerScreen;

