import api from './api';
import { Song } from '../types';

export const songsService = {
  async getAll(status?: string): Promise<Song[]> {
    const params = status ? { status } : {};
    const response = await api.get('/songs', { params });
    return response.data;
  },

  async getById(id: string): Promise<Song> {
    const response = await api.get(`/songs/${id}`);
    return response.data;
  },

  async getMySongs(): Promise<Song[]> {
    const response = await api.get('/songs/my-songs');
    return response.data;
  },

  async create(song: {
    title: string;
    description?: string;
    audio_url: string;
    cover_url?: string;
    duration: number;
    points_per_play?: number;
  }): Promise<Song> {
    const response = await api.post('/songs', song);
    return response.data;
  },

  async update(id: string, song: Partial<Song>): Promise<Song> {
    const response = await api.patch(`/songs/${id}`, song);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/songs/${id}`);
  },

  async registerPlayComplete(songId: string): Promise<void> {
    await api.post(`/song-plays/songs/${songId}/play-complete`);
  },
};

