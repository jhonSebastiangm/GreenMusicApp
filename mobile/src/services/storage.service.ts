import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const storageService = {
  async uploadAudio(fileUri: string, fileName: string): Promise<string> {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `songs/${fileName}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  },

  async uploadImage(fileUri: string, fileName: string): Promise<string> {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `covers/${fileName}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};

