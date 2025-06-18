import type { Genre } from '@/types/genre';
import api from '@/lib/axios';

export const getGenres = async (params?: any): Promise<{ results: Genre[], totalResults: number }> => {
  const response = await api.get('/genres', { params });
  return response.data.data;
};

export const getGenre = async (genreId: string): Promise<Genre> => {
  const response = await api.get(`/genres/${genreId}`);
  return response.data.data;
};

export const createGenre = async (genreData: Partial<Genre>): Promise<Genre> => {
  const response = await api.post('/genres', genreData);
  return response.data.data;
};

export const updateGenre = async (genreId: string, updateData: Partial<Genre>): Promise<Genre> => {
  const response = await api.patch(`/genres/${genreId}`, updateData);
  return response.data.data;
};

export const deleteGenre = async (genreId: string): Promise<void> => {
  await api.delete(`/genres/${genreId}`);
}; 