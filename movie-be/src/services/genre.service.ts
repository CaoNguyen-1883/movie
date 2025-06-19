import httpStatus from 'http-status';
import Genre from '@/models/genre.model';
import { IGenre } from '@/interfaces/genre.interface';
import { AppError } from '@/utils/AppError';

/**
 * Create a genre
 * @param {IGenre} genreBody
 * @returns {Promise<IGenre>}
 */
const createGenre = async (genreBody: Partial<IGenre>): Promise<IGenre> => {
  if (await Genre.findOne({ name: genreBody.name })) {
    throw new AppError('Genre already exists', httpStatus.CONFLICT);
  }
  return Genre.create(genreBody);
};

/**
 * Query for genres with pagination and search.
 * @param {object} filter - Mongo filter (currently unused, for future extension).
 * @param {object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: "field:desc"
 * @param {number} [options.limit] - Maximum number of results per page.
 * @param {number} [options.page] - Current page.
 * @param {string} [options.name] - Search term for genre name.
 * @returns {Promise<object>} - Object containing results and pagination info.
 */
const queryGenres = async (filter: any, options: any) => {
  const { limit = 10, page = 1, sortBy, name } = options;
  const skip = (page - 1) * limit;

  const query: any = { ...filter };

  if (name) {
    query.name = { $regex: new RegExp(name, 'i') };
  }
  
  const [field, order] = sortBy ? sortBy.split(':') : ['createdAt', 'desc'];
  const sort: { [key: string]: 1 | -1 } = { [field]: order === 'desc' ? -1 : 1 };

  const genresPromise = Genre.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
    
  const totalPromise = Genre.countDocuments(query);

  const [results, totalResults] = await Promise.all([genresPromise, totalPromise]);

  return {
    results,
    page,
    limit,
    totalPages: Math.ceil(totalResults / limit),
    totalResults,
  };
};

/**
 * Get genre by id
 * @param {string} id
 * @returns {Promise<IGenre>}
 */
const getGenreById = async (id: string): Promise<IGenre> => {
  const genre = await Genre.findById(id);
  if (!genre) {
    throw new AppError('Genre not found', httpStatus.NOT_FOUND);
  }
  return genre;
};

/**
 * Update genre by id
 * @param {string} genreId
 * @param {Partial<IGenre>} updateBody
 * @returns {Promise<IGenre>}
 */
const updateGenreById = async (genreId: string, updateBody: Partial<IGenre>): Promise<IGenre> => {
  const genre = await getGenreById(genreId);
  if (updateBody.name && (await Genre.findOne({ name: updateBody.name, _id: { $ne: genreId } }))) {
    throw new AppError('Genre with that name already exists', httpStatus.CONFLICT);
  }
  Object.assign(genre, updateBody);
  await genre.save();
  return genre;
};

/**
 * Delete genre by id
 * @param {string} genreId
 * @returns {Promise<IGenre>}
 */
const deleteGenreById = async (genreId: string): Promise<IGenre> => {
  const genre = await getGenreById(genreId);
  await genre.deleteOne();
  return genre;
};

export const genreService = {
  createGenre,
  queryGenres,
  getGenreById,
  updateGenreById,
  deleteGenreById,
}; 