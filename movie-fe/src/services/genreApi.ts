import type { Genre } from '@/types/genre';
import type { PaginatedResponse } from '@/types/api';
import api from '@/lib/axios';

export const queryGenres = async (params?: any): Promise<PaginatedResponse<Genre>> => {
  const response = await api.get('/genres', { params });
  return response.data.data;
};

export const getAllGenres = async (): Promise<Genre[]> => {
  const response = await api.get('/genres', { params: { limit: 0 } });
  return response.data.data.results;
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