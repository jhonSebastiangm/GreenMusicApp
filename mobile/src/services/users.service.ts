import api from './api';
import { User, SongPlay, Redemption } from '../types';

export const usersService = {
  async getMe(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async getMyPoints(): Promise<{ points_balance: number }> {
    const response = await api.get('/users/me/points');
    return response.data;
  },

  async getMyHistory(): Promise<{
    songPlays: SongPlay[];
    redemptions: Redemption[];
  }> {
    const response = await api.get('/users/me/history');
    return response.data;
  },
};

