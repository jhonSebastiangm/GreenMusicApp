import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { logger } from './src/utils/logger';
import { getAuthInstance } from './src/services/firebase';

// Inicializar logging
logger.info('App starting...');

export default function App() {
  // Inicializar Firebase Auth después de que el componente esté montado
  // Con más tiempo para asegurar que Firebase esté completamente listo
  useEffect(() => {
    const initAuth = async () => {
      try {
        logger.info('App: Inicializando Firebase Auth (esperando 2 segundos)...');
        // Esperar más tiempo para que Firebase App esté completamente lista
        await new Promise(resolve => setTimeout(resolve, 2000));
        await getAuthInstance();
        logger.info('App: Firebase Auth inicializado correctamente');
      } catch (error: any) {
        logger.error('App: Error al inicializar Firebase Auth', error);
        // No lanzar error fatal, permitir que la app continúe
        // El error se mostrará cuando se intente usar auth
      }
    };
    
    initAuth();
  }, []);

  try {
    logger.info('Rendering App component');
    return (
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AuthProvider>
    );
  } catch (error) {
    logger.error('Error in App component', error);
    throw error;
  }
}

