import api from './api';
import { User } from '../types';
import { logger } from '../utils/logger';

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(token: string): Promise<LoginResponse> {
    try {
      logger.info('AuthService: Attempting login', { hasToken: !!token });
      const response = await api.post('/auth/login', { token });
      logger.info('AuthService: Login successful', {
        userId: response.data?.user?.id,
        hasToken: !!response.data?.token,
      });
      return response.data;
    } catch (error: any) {
      logger.error('AuthService: Login failed', error, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      throw error;
    }
  },

  async register(token: string): Promise<LoginResponse> {
    try {
      logger.info('AuthService: Attempting registration', { hasToken: !!token });
      const response = await api.post('/auth/register', { token });
      logger.info('AuthService: Registration successful', {
        userId: response.data?.user?.id,
        hasToken: !!response.data?.token,
      });
      return response.data;
    } catch (error: any) {
      logger.error('AuthService: Registration failed', error, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      throw error;
    }
  },

  async getMe(): Promise<User> {
    try {
      logger.debug('AuthService: Fetching current user');
      const response = await api.get('/auth/me');
      logger.debug('AuthService: User fetched successfully', {
        userId: response.data?.id,
      });
      return response.data;
    } catch (error: any) {
      logger.error('AuthService: GetMe failed', error, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
      throw error;
    }
  },
};

