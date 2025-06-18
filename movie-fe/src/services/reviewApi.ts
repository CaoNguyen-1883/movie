import type { Review } from '@/types/review';
import api from '@/lib/axios';

export const getReviewsByMovie = async (movieId: string, params?: any): Promise<{ results: Review[], totalResults: number }> => {
  const response = await api.get(`/reviews/movie/${movieId}`, { params });
  return response.data.data;
};

export const createReview = async (reviewData: Partial<Review>): Promise<Review> => {
  const response = await api.post('/reviews', reviewData);
  return response.data.data;
};

export const updateReview = async (reviewId: string, updateData: Partial<Review>): Promise<Review> => {
  const response = await api.patch(`/reviews/${reviewId}`, updateData);
  return response.data.data;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
}; 