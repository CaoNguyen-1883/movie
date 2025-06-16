import httpStatus from 'http-status';
import Movie from '@/models/movie.model';
import { IMovie } from '@/interfaces/movie.interface';
import { AppError } from '@/utils/AppError';
import Genre from '@/models/genre.model';
import Person from '@/models/person.model';
import mongoose from 'mongoose';

/**
 * Validates that the provided IDs for genres, cast, and directors exist in the database.
 * @param {Partial<IMovie>} movieBody - The movie data.
 * @throws {AppError} If any ID is invalid or not found.
 */
const validateMovieSubDocuments = async (movieBody: Partial<IMovie>) => {
  if (movieBody.genres) {
    const genreCount = await Genre.countDocuments({ _id: { $in: movieBody.genres } });
    if (genreCount !== movieBody.genres.length) {
      throw new AppError('One or more genres are invalid', httpStatus.BAD_REQUEST);
    }
  }
  if (movieBody.directors) {
    const directorCount = await Person.countDocuments({ _id: { $in: movieBody.directors } });
    if (directorCount !== movieBody.directors.length) {
      throw new AppError('One or more directors are invalid', httpStatus.BAD_REQUEST);
    }
  }
  if (movieBody.cast) {
    const actorIds = movieBody.cast.map((c) => c.actor);
    const actorCount = await Person.countDocuments({ _id: { $in: actorIds } });
    if (actorCount !== actorIds.length) {
      throw new AppError('One or more actors are invalid', httpStatus.BAD_REQUEST);
    }
  }
};

/**
 * Create a movie
 * @param {IMovie} movieBody
 * @returns {Promise<IMovie>}
 */
const createMovie = async (movieBody: Partial<IMovie>): Promise<IMovie> => {
  await validateMovieSubDocuments(movieBody);
  return Movie.create(movieBody);
};

/**
 * Query for movies with pagination and sorting
 * @param {any} filter - Mongo filter
 * @param {any} options - Query options for pagination and sorting (e.g., sortBy, limit, page)
 * @returns {Promise<any>} - Object containing results and pagination info
 */
const queryMovies = async (filter: any, options: any): Promise<any> => {
  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  const sort: { [key: string]: 'asc' | 'desc' } = {};
  if (options.sortBy) {
    const [key, order] = options.sortBy.split(':');
    sort[key] = order === 'desc' ? 'desc' : 'asc';
  } else {
    // Default sort by creation date
    sort.createdAt = 'desc';
  }

  const totalResults = await Movie.countDocuments(filter).exec();
  const movies = await Movie.find(filter)
    .populate('genres', 'name')
    .populate('directors', 'name')
    .populate('cast.actor', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec();

  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: movies,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get movie by id
 * @param {string} id
 * @returns {Promise<IMovie>}
 */
const getMovieById = async (id: string): Promise<IMovie> => {
  const movie = await Movie.findById(id)
    .populate('genres', 'name')
    .populate('directors', 'name')
    .populate('cast.actor', 'name photoUrl');
  if (!movie) {
    throw new AppError('Movie not found', httpStatus.NOT_FOUND);
  }
  return movie;
};

/**
 * Update movie by id
 * @param {string} movieId
 * @param {Partial<IMovie>} updateBody
 * @returns {Promise<IMovie>}
 */
const updateMovieById = async (movieId: string, updateBody: Partial<IMovie>): Promise<IMovie> => {
  const movie = await getMovieById(movieId);
  await validateMovieSubDocuments(updateBody);
  Object.assign(movie, updateBody);
  await movie.save();
  return movie;
};

/**
 * Delete movie by id
 * @param {string} movieId
 * @returns {Promise<IMovie>}
 */
const deleteMovieById = async (movieId: string): Promise<IMovie> => {
  const movie = await getMovieById(movieId);
  await movie.deleteOne();
  return movie;
};

export const movieService = {
  createMovie,
  queryMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById,
}; 