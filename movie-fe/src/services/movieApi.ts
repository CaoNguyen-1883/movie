import type { Movie } from '@/types/movie';
import type { PaginatedResponse } from '@/types/api';
import api from '@/lib/axios';

// This payload represents what the form gives us and what the API expects for creation.
export type CreateMoviePayload = Omit<
  Movie,
  '_id' | 'slug' | 'genres' | 'directors' | 'cast' | 'averageRating' | 'createdAt' | 'updatedAt'
> & {
  genres: string[];
  directors: string[];
  cast: {
    actor: string;
    characterName: string;
  }[];
};

// The update payload is similar to the create payload.
export type UpdateMoviePayload = Partial<CreateMoviePayload>;

export const getMovies = async (
  params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    title?: string;
    status?: 'NOW_SHOWING' | 'COMING_SOON' | 'RELEASED';
  } = {}
): Promise<PaginatedResponse<Movie>> => {
  const response = await api.get('/movies', { params });
  return response.data.data;
};

export const getMovie = async (movieId: string): Promise<Movie> => {
  const response = await api.get(`/movies/${movieId}`);
  return response.data.data;
};

export const getMovieBySlug = async (slug: string): Promise<Movie> => {
  const response = await api.get(`/movies/slug/${slug}`);
  return response.data.data;
};

export const createMovie = async (movieData: CreateMoviePayload): Promise<Movie> => {
  const response = await api.post('/movies', movieData);
  return response.data.data;
};

export const updateMovie = async (movieId: string, updateData: UpdateMoviePayload): Promise<Movie> => {
  console.log('updateData', updateData);
  const response = await api.patch(`/movies/${movieId}`, updateData);
  return response.data.data;
};

export const deleteMovie = async (movieId: string): Promise<void> => {
  await api.delete(`/movies/${movieId}`);
}; 