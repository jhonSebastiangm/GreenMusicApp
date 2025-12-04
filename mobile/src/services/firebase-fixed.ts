/**
 * Versión FIXED de Firebase para React Native/Expo
 * Solución directa que funciona en Expo Go
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { logger } from '../utils/logger';

// Configuración
const getConfig = () => {
  const fromConstants = Constants.expoConfig?.extra?.firebase;
  const fromEnv = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  };
  return fromConstants || fromEnv;
};

const config = getConfig();

// Variables globales
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

// Inicializar TODO sincrónicamente
try {
  // 1. Inicializar App
  if (getApps().length === 0) {
    app = initializeApp(config);
    logger.info('Firebase App: Inicializado');
  } else {
    app = getApps()[0];
  }

  // 2. Inicializar Auth INMEDIATAMENTE (crítico para Expo Go)
  if (app) {
    try {
      // Intentar initializeAuth primero
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      logger.info('Firebase Auth: Inicializado con initializeAuth');
    } catch (e: any) {
      // Si falla, puede ser que ya exista
      if (e.message?.includes('already') || e.code === 'auth/already-initialized') {
        try {
          auth = getAuth(app);
          logger.info('Firebase Auth: Obtenido con getAuth');
        } catch (e2: any) {
          logger.error('Firebase Auth: Error crítico', e2);
          // Continuar sin auth - se inicializará lazy más tarde
        }
      } else {
        logger.error('Firebase Auth: Error', e);
      }
    }

    // 3. Inicializar Storage
    try {
      storage = getStorage(app);
      logger.info('Firebase Storage: Inicializado');
    } catch (e: any) {
      logger.error('Firebase Storage: Error', e);
    }
  }
} catch (error: any) {
  logger.error('Firebase: Error crítico en inicialización', error);
}

// Función helper para obtener auth (si no se inicializó)
export const getAuthInstance = async (): Promise<Auth> => {
  if (auth) return auth;
  if (!app) throw new Error('Firebase App no inicializado');
  
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    return auth;
  } catch (e: any) {
    if (e.message?.includes('already')) {
      auth = getAuth(app);
      return auth;
    }
    throw e;
  }
};

// Exportar
export { auth, storage, app as default };

