import api from './api';
import { User } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(token: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { token });
    return response.data;
  },

  async register(token: string): Promise<LoginResponse> {
    const response = await api.post('/auth/register', { token });
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

