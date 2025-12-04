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
      
      // Para la demo, siempre empezar desde login (no cargar sesión guardada)
      // Comentar estas líneas si quieres que siempre empiece desde login:
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      const demoMode = await AsyncStorage.getItem('demoMode');

      // Si está en modo demo, limpiar datos para empezar desde cero
      if (demoMode === 'true') {
        logger.info('AuthContext: Demo mode detected, clearing stored auth for fresh start');
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('demoMode');
        setLoading(false);
        return;
      }

      // Modo demo: crear usuario de prueba automáticamente solo si no hay datos
      if (!storedToken && !storedUser) {
        logger.info('AuthContext: No stored auth, will show login screen');
        // No crear demo automáticamente, dejar que el usuario elija
        setLoading(false);
        return;
      }

      if (storedToken && storedUser) {
        logger.info('AuthContext: Found stored auth, restoring session', {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
        });
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        logger.info('AuthContext: Session restored successfully');
      } else {
        logger.info('AuthContext: No stored auth found');
      }
    } catch (error) {
      logger.error('AuthContext: Error loading stored auth', error);
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

