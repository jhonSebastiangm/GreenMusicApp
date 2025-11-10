import api from './api';
import { Redemption } from '../types';

export const redemptionsService = {
  async create(productId: string): Promise<Redemption> {
    const response = await api.post('/redemptions', { productId });
    return response.data;
  },

  async getMyRedemptions(): Promise<Redemption[]> {
    const response = await api.get('/redemptions/my-redemptions');
    return response.data;
  },
};

