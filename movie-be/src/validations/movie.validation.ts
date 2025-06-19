import Joi from 'joi';
import { objectId } from './custom.validation';
import { movieStatus } from '@/constants/movie';

const movieCastSchema = Joi.object({
  actor: Joi.string().custom(objectId).required(),
  characterName: Joi.string().required(),
});

const createMovie = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    releaseDate: Joi.date().required(),
    duration: Joi.number().integer().required(),
    status: Joi.string()
      .required()
      .valid(...movieStatus),
    genres: Joi.array().items(Joi.string().hex().length(24)),
    directors: Joi.array().items(Joi.string().hex().length(24)),
    cast: Joi.array().items(
      Joi.object({
        actor: Joi.string().hex().length(24).required(),
        characterName: Joi.string().required(),
      }),
    ),
    posterUrl: Joi.string().uri().allow(''),
    trailerUrl: Joi.string().uri().allow(''),
    videoUrl: Joi.string().uri(),
    backdropUrls: Joi.array().items(Joi.string().uri()),
  }),
};

const getMovies = {
  query: Joi.object().keys({
    title: Joi.string(),
    status: Joi.string().valid(...movieStatus),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMovie = {
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
};

const getMovieBySlug = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const updateMovie = {
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      releaseDate: Joi.date(),
      duration: Joi.number().integer(),
      status: Joi.string().valid(...movieStatus),
      genres: Joi.array().items(Joi.string().hex().length(24)),
      directors: Joi.array().items(Joi.string().hex().length(24)),
      cast: Joi.array().items(
        Joi.object({
          actor: Joi.string().hex().length(24).required(),
          characterName: Joi.string().required(),
        }),
      ),
      posterUrl: Joi.string().uri().allow(''),
      trailerUrl: Joi.string().uri().allow(''),
      videoUrl: Joi.string().uri().allow(''),
      backdropUrls: Joi.array().items(Joi.string().uri()),
    })
    .min(1),
};

const deleteMovie = {
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
};

export const movieValidation = {
  createMovie,
  getMovies,
  getMovie,
  getMovieBySlug,
  updateMovie,
  deleteMovie,
}; 