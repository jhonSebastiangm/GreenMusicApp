/**
 * Versión simplificada de Firebase para React Native/Expo
 * Esta versión inicializa Auth de forma más directa y compatible con Expo Go
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { logger } from '../utils/logger';

// Obtener configuración
const getFirebaseConfig = () => {
  const configFromConstants = Constants.expoConfig?.extra?.firebase;
  const configFromEnv = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  };
  return configFromConstants || configFromEnv;
};

const firebaseConfig = getFirebaseConfig();

// Inicializar Firebase App
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    logger.info('Firebase: App inicializada');
  } else {
    app = getApps()[0];
  }

  // Inicializar Auth INMEDIATAMENTE después de App (no lazy)
  // Esto es crítico para Expo Go
  if (app) {
    try {
      // Verificar si ya existe una instancia
      const existingApps = getApps();
      if (existingApps.length > 0) {
        // Intentar inicializar Auth directamente
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage)
        });
        logger.info('Firebase Auth: Inicializado correctamente');
      }
    } catch (authError: any) {
      // Si falla, puede ser que ya esté inicializado
      if (authError.message?.includes('already') || authError.code === 'auth/already-initialized') {
        logger.warn('Firebase Auth: Ya estaba inicializado');
        // Intentar obtener la instancia existente
        const { getAuth } = require('firebase/auth');
        auth = getAuth(app);
      } else {
        logger.error('Firebase Auth: Error al inicializar', authError);
        throw authError;
      }
    }

    // Inicializar Storage
    try {
      storage = getStorage(app);
      logger.info('Firebase Storage: Inicializado');
    } catch (storageError: any) {
      logger.error('Firebase Storage: Error', storageError);
    }
  }
} catch (error: any) {
  logger.error('Firebase: Error crítico', error);
}

// Función helper para obtener auth (si no se inicializó antes)
export const getAuthInstance = async (): Promise<Auth> => {
  if (auth) {
    return auth;
  }

  if (!app) {
    throw new Error('Firebase App no está inicializado');
  }

  // Intentar inicializar ahora
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    logger.info('Firebase Auth: Inicializado en getAuthInstance');
    return auth;
  } catch (error: any) {
    if (error.message?.includes('already') || error.code === 'auth/already-initialized') {
      const { getAuth } = require('firebase/auth');
      auth = getAuth(app);
      return auth;
    }
    throw error;
  }
};

// Exportar instancias
export { auth, storage, app as default };

