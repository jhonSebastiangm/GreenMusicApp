import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  register: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logger.info('AuthContext: Initializing, loading stored auth');
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      logger.debug('AuthContext: Loading stored authentication');
      
      // SIEMPRE empezar desde login - NO restaurar sesión guardada
      // Esto asegura que la app siempre empiece desde cero
      logger.info('AuthContext: Siempre empezar desde login - limpiando datos guardados');
      
      // Limpiar todos los datos de autenticación guardados
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('demoMode');
      
      // Asegurar que no hay usuario ni token
      setToken(null);
      setUser(null);
      
      logger.info('AuthContext: Datos limpiados - mostrando pantalla de login');
    } catch (error) {
      logger.error('AuthContext: Error loading stored auth', error);
      // En caso de error, asegurar que no hay sesión
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
      logger.debug('AuthContext: Loading completed - siempre desde login');
    }
  };

  const login = async (firebaseToken: string) => {
    try {
      logger.info('AuthContext: Starting login process');
      const response = await authService.login(firebaseToken);
      logger.debug('AuthContext: Login successful, saving to storage', {
        userId: response.user?.id,
        hasToken: !!response.token,
      });
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      logger.info('AuthContext: Login completed successfully');
    } catch (error) {
      logger.error('AuthContext: Login error', error, {
        hasFirebaseToken: !!firebaseToken,
      });
      throw error;
    }
  };

  const loginDemo = async () => {
    try {
      logger.info('AuthContext: Starting demo login process');
      const demoUser: User = {
        id: 'demo-user-id',
        email: 'demo@greenmusic.app',
        name: 'Usuario Demo',
        role: 'user',
        points_balance: 1000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const demoToken = 'demo-token-' + Date.now();
      
      await AsyncStorage.setItem('authToken', demoToken);
      await AsyncStorage.setItem('user', JSON.stringify(demoUser));
      await AsyncStorage.setItem('demoMode', 'true');
      
      setToken(demoToken);
      setUser(demoUser);
      
      logger.info('AuthContext: Demo login completed successfully');
    } catch (error) {
      logger.error('AuthContext: Demo login error', error);
      throw error;
    }
  };

  const register = async (firebaseToken: string) => {
    try {
      logger.info('AuthContext: Starting registration process');
      const response = await authService.register(firebaseToken);
      logger.debug('AuthContext: Registration successful, saving to storage', {
        userId: response.user?.id,
        hasToken: !!response.token,
      });
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      logger.info('AuthContext: Registration completed successfully');
    } catch (error) {
      logger.error('AuthContext: Registration error', error, {
        hasFirebaseToken: !!firebaseToken,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      logger.info('AuthContext: Starting logout process');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      logger.info('AuthContext: Logout completed successfully');
    } catch (error) {
      logger.error('AuthContext: Logout error', error);
    }
  };

  const refreshUser = async () => {
    try {
      logger.debug('AuthContext: Refreshing user data');
      const updatedUser = await authService.getMe();
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      logger.debug('AuthContext: User data refreshed successfully');
    } catch (error) {
      logger.error('AuthContext: Refresh user error', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, loginDemo, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

