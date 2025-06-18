import httpStatus from 'http-status';
import Review from '@/models/review.model';
import { IReview } from '@/interfaces/review.interface';
import { AppError } from '@/utils/AppError';
import Movie from '@/models/movie.model';
import { IUser } from '@/interfaces/user.interface';
import { Types } from 'mongoose';

/**
 * Create a review
 * @param {object} reviewBody
 * @param {IUser} user
 * @returns {Promise<IReview>}
 */
const createReview = async (
  reviewBody: { movieId: string; rating: number; comment?: string },
  user: IUser,
): Promise<IReview> => {
  const { movieId, rating, comment } = reviewBody;
 
  // 1. Check if the provided ID is a valid ObjectId
  if (!Types.ObjectId.isValid(movieId)) {
    throw new AppError(`Invalid movie ID format: ${movieId}`, httpStatus.BAD_REQUEST);
  }

  // 2. Check if movie exists
  const movieExists = await Movie.findById(movieId);
  if (!movieExists) {
    throw new AppError('Movie not found', httpStatus.NOT_FOUND);
  }

  // 3. Check if user has already reviewed this movie
  const existingReview = await Review.findOne({ movie: new Types.ObjectId(movieId), user: user._id });
  if (existingReview) {
    throw new AppError('You have already reviewed this movie', httpStatus.CONFLICT);
  }

  // 4. Create review
  const reviewData = { movie: movieId, user: user._id, rating, comment };
  return Review.create(reviewData);
};

/**
 * Get reviews for a specific movie
 * @param {string} movieId
 * @returns {Promise<IReview[]>}
 */
const getReviewsByMovie = async (movieId: string): Promise<IReview[]> => {
  return Review.find({ movie: movieId }).populate('user', '_id fullName username avatarUrl');
};

/**
 * Update a review by ID
 * @param {string} reviewId
 * @param {Partial<IReview>} updateBody
 * @param {IUser} user - The user performing the update
 * @returns {Promise<IReview>}
 */
const updateReviewById = async (reviewId: string, updateBody: Partial<IReview>, user: IUser): Promise<IReview> => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError('Review not found', httpStatus.NOT_FOUND);
  }

  // Check if the user is the owner of the review
  if (review.user.toString() !== user._id.toString()) {
    throw new AppError('You are not authorized to update this review', httpStatus.FORBIDDEN);
  }

  Object.assign(review, updateBody);
  await review.save();
  return review;
};


/**
 * Delete a review by ID
 * @param {string} reviewId
 * @param {IUser} user - The user performing the deletion
 * @returns {Promise<void>}
 */
const deleteReviewById = async (reviewId: string, user: IUser): Promise<void> => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError('Review not found', httpStatus.NOT_FOUND);
  }

  // user.roles should be populated with role details from the auth middleware
  const userIsAdmin = user.roles.some(
    (role) => typeof role !== 'string' && (role as any).name === 'ADMIN',
  );

  if (review.user.toString() !== user._id.toString() && !userIsAdmin) {
    throw new AppError('You are not authorized to delete this review', httpStatus.FORBIDDEN);
  }

  await review.deleteOne();
};


export const reviewService = {
  createReview,
  getReviewsByMovie,
  updateReviewById,
  deleteReviewById,
}; 