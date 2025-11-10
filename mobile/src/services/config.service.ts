import api from './api';

export const configService = {
  async getPointsPerPlay(): Promise<{ points_per_play: number }> {
    const response = await api.get('/config/points-per-play');
    return response.data;
  },
};

