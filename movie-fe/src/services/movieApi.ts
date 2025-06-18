import type { Movie } from '@/types/movie'; // Assuming this type will be created
import api from '@/lib/axios';

export const getMovies = async (params?: any): Promise<{ results: Movie[], totalResults: number }> => {
  const response = await api.get('/movies', { params });
  return response.data.data;
};

export const getMovie = async (movieId: string): Promise<Movie> => {
  const response = await api.get(`/movies/${movieId}`);
  return response.data.data;
};

export const createMovie = async (movieData: Partial<Movie>): Promise<Movie> => {
  const response = await api.post('/movies', movieData);
  return response.data.data;
};

export const updateMovie = async (movieId: string, updateData: Partial<Movie>): Promise<Movie> => {
  const response = await api.patch(`/movies/${movieId}`, updateData);
  return response.data.data;
};

export const deleteMovie = async (movieId: string): Promise<void> => {
  await api.delete(`/movies/${movieId}`);
}; 