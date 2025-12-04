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
      
      // Cargar sesión guardada si existe
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');

      // Limpiar cualquier dato de demo mode que pueda quedar
      await AsyncStorage.removeItem('demoMode');

      if (storedToken && storedUser) {
        logger.info('AuthContext: Found stored auth, restoring session', {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
        });
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        logger.info('AuthContext: Session restored successfully');
      } else {
        logger.info('AuthContext: No stored auth found, showing login screen');
      }
    } catch (error) {
      logger.error('AuthContext: Error loading stored auth', error);
      // En caso de error, asegurar que no hay sesión
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
      logger.debug('AuthContext: Loading completed');
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
      await AsyncStorage.removeItem('demoMode'); // Limpiar también demo mode si existe
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
      value={{ user, token, loading, login, register, logout, refreshUser }}
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

