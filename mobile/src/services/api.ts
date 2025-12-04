import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { logger } from '../utils/logger';

// Obtener URL desde app.config.js o variables de entorno
// Para emulador Android, usar 10.0.2.2 en lugar de localhost
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 
                     process.env.EXPO_PUBLIC_API_URL || 
                     'http://10.0.2.2:3000';

logger.info('API Service: Initializing', { baseURL: API_BASE_URL });

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        logger.debug('API: Request with auth token', {
          method: config.method,
          url: config.url,
          hasToken: true,
        });
      } else {
        logger.debug('API: Request without auth token', {
          method: config.method,
          url: config.url,
        });
      }
    } catch (error) {
      logger.error('API: Error getting token from storage', error);
    }
    return config;
  },
  (error) => {
    logger.error('API: Request interceptor error', error);
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    logger.debug('API: Response received', {
      status: response.status,
      url: response.config.url,
      method: response.config.method,
    });
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method;

    logger.error('API: Response error', error, {
      status,
      url,
      method,
      message: error.response?.data?.message || error.message,
    });

    if (status === 401) {
      logger.warn('API: Unauthorized, clearing auth storage');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('demoMode'); // Limpiar también demo mode si existe
    }

    return Promise.reject(error);
  },
);

export default api;

