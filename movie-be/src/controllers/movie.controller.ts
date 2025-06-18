import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '@/utils/catchAsync';
import { movieService } from '@/services/movie.service';
import { pick } from '@/utils/pick';
import { movieDetailService } from '@/services/movie-detail.service';

const createMovie = catchAsync(async (req: Request, res: Response) => {
  const movie = await movieService.createMovie(req.body);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Movie created successfully.',
    data: movie,
  });
});

const getMovieBySlug = catchAsync(async (req: Request, res: Response) => {
  const movie = await movieDetailService.getMovieBySlug(req.params.slug);
  res.status(httpStatus.OK).send({ success: true, message: 'Movie fetched successfully', data: movie });
});

const getMovies = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await movieService.queryMovies(filter, options);
  res.send({
    success: true,
    data: result,
  });
});

const getMovie = catchAsync(async (req: Request, res: Response) => {
  const movie = await movieService.getMovieById(req.params.movieId);
  res.send({
    success: true,
    data: movie,
  });
});

const updateMovie = catchAsync(async (req: Request, res: Response) => {
  const movie = await movieService.updateMovieById(req.params.movieId, req.body);
  res.send({
    success: true,
    message: 'Movie updated successfully.',
    data: movie,
  });
});

const deleteMovie = catchAsync(async (req: Request, res: Response) => {
  await movieService.deleteMovieById(req.params.movieId);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Movie deleted successfully.',
  });
});

export const movieController = {
  createMovie,
  getMovies,
  getMovie,
  getMovieBySlug,
  updateMovie,
  deleteMovie,
}; 