import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { logger } from './src/utils/logger';
import { getAuthInstance } from './src/services/firebase';
import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from '@expo-google-fonts/montserrat';

// Mantener splash screen visible mientras cargan las fuentes
SplashScreen.preventAutoHideAsync();

// Inicializar logging
logger.info('App starting...');

export default function App() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Thin': Montserrat_100Thin,
    'Montserrat-ExtraLight': Montserrat_200ExtraLight,
    'Montserrat-Light': Montserrat_300Light,
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
    'Montserrat-ExtraBold': Montserrat_800ExtraBold,
    'Montserrat-Black': Montserrat_900Black,
  });

  // Inicializar Firebase Auth después de que el componente esté montado
  useEffect(() => {
    const initApp = async () => {
      try {
        // Esperar a que las fuentes carguen
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
          logger.info('App: Fuentes Montserrat cargadas');
        }

        logger.info('App: Inicializando Firebase Auth (esperando 2 segundos)...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        await getAuthInstance();
        logger.info('App: Firebase Auth inicializado correctamente');
      } catch (error: any) {
        logger.error('App: Error al inicializar Firebase Auth', error);
      }
    };
    
    initApp();
  }, [fontsLoaded]);

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

