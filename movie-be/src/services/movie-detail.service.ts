import httpStatus from 'http-status';
import { IMovie } from '@/interfaces/movie.interface';
import Movie from '@/models/movie.model';
import { AppError } from '@/utils/AppError';

/**
 * Get movie by slug and populate related fields
 * @param {string} slug
 * @returns {Promise<IMovie>}
 */
const getMovieBySlug = async (slug: string): Promise<IMovie> => {
  const movie = await Movie.findOne({ slug })
    .populate('genres', 'name slug')
    .populate('directors', 'name slug profilePicture')
    .populate('cast.actor', 'name slug profilePicture');

  if (!movie) {
    throw new AppError( 'Movie not found', httpStatus.NOT_FOUND);
  }
  return movie;
};

export const movieDetailService = {
  getMovieBySlug,
}; 