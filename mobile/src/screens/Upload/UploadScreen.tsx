import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { songsService } from '../../services/songs.service';
import { storageService } from '../../services/storage.service';
import { Audio } from 'expo-av';

const UploadScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setAudioUri(result.assets[0].uri);

        // Obtener duración del audio
        const { sound } = await Audio.Sound.createAsync(
          { uri: result.assets[0].uri },
          { shouldPlay: false },
        );
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setAudioDuration(Math.floor((status.durationMillis || 0) / 1000));
        }
        await sound.unloadAsync();
      }
    } catch (error) {
      Alert.alert('Error', 'Error al seleccionar el audio');
    }
  };

  const pickCover = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCoverUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al seleccionar la imagen');
    }
  };

  const handleUpload = async () => {
    if (!title || !audioUri) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      // Subir audio a Firebase Storage
      const audioFileName = `audio_${Date.now()}.mp3`;
      const audioUrl = await storageService.uploadAudio(audioUri, audioFileName);

      // Subir portada si existe
      let coverUrl: string | undefined;
      if (coverUri) {
        const coverFileName = `cover_${Date.now()}.jpg`;
        coverUrl = await storageService.uploadImage(coverUri, coverFileName);
      }

      // Crear canción en el backend
      await songsService.create({
        title,
        description: description || undefined,
        audio_url: audioUrl,
        cover_url: coverUrl,
        duration: audioDuration,
      });

      Alert.alert('Éxito', 'Canción subida correctamente');
      setTitle('');
      setDescription('');
      setAudioUri(null);
      setCoverUri(null);
      setAudioDuration(0);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al subir la canción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Subir Canción</Text>

      <TextInput
        style={styles.input}
        placeholder="Título de la canción *"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={pickAudio}>
        <Text style={styles.buttonText}>
          {audioUri ? 'Audio seleccionado ✓' : 'Seleccionar Audio MP3 *'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickCover}>
        <Text style={styles.buttonText}>
          {coverUri ? 'Portada seleccionada ✓' : 'Seleccionar Portada (opcional)'}
        </Text>
      </TouchableOpacity>

      {coverUri && (
        <Image source={{ uri: coverUri }} style={styles.previewImage} />
      )}

      {audioDuration > 0 && (
        <Text style={styles.duration}>
          Duración: {Math.floor(audioDuration / 60)}:
          {(audioDuration % 60).toString().padStart(2, '0')}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, styles.uploadButton]}
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Subir Canción</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        * La canción estará pendiente de aprobación por un administrador
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadButton: {
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  note: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default UploadScreen;

