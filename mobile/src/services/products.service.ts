import api from './api';
import { Product } from '../types';

export const productsService = {
  async getAll(status?: string): Promise<Product[]> {
    const params = status ? { status } : {};
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

