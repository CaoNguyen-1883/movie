
import api from '@/lib/axios';
import type { Review } from '@/types/review';

/**
 * Payload for creating a new review.
 */
interface CreateReviewPayload {
  movieId: string;
  rating: number;
  comment?: string;
}

/**
 * Payload for updating an existing review.
 */
type UpdateReviewPayload = Partial<Omit<CreateReviewPayload, 'movieId'>>;


/**
 * Fetches all reviews for a specific movie.
 */
export const getReviewsByMovie = async (movieId: string): Promise<Review[]> => {
  const { data } = await api.get(`/reviews/movie/${movieId}`);
  return data.data;
};

/**
 * Creates a new review.
 */
export const createReview = async (payload: CreateReviewPayload): Promise<Review> => {
  const { data } = await api.post('/reviews', payload);
  return data.data;
};

/**
 * Updates an existing review by its ID.
 */
export const updateReview = async (reviewId: string, payload: UpdateReviewPayload): Promise<Review> => {
  const { data } = await api.patch(`/reviews/${reviewId}`, payload);
  return data.data;
};

/**
 * Deletes a review by its ID.
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
}; 