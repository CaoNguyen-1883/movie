import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '@/utils/catchAsync';
import { genreService } from '@/services/genre.service';

const createGenre = catchAsync(async (req: Request, res: Response) => {
  const genre = await genreService.createGenre(req.body);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Genre created successfully.',
    data: genre,
  });
});

const getGenres = catchAsync(async (req: Request, res: Response) => {
  const result = await genreService.getGenres();
  res.send({
    success: true,
    data: result,
  });
});

const getGenre = catchAsync(async (req: Request, res: Response) => {
  const genre = await genreService.getGenreById(req.params.genreId);
  res.send({
    success: true,
    data: genre,
  });
});

const updateGenre = catchAsync(async (req: Request, res: Response) => {
  const genre = await genreService.updateGenreById(req.params.genreId, req.body);
  res.send({
    success: true,
    message: 'Genre updated successfully.',
    data: genre,
  });
});

const deleteGenre = catchAsync(async (req: Request, res: Response) => {
  await genreService.deleteGenreById(req.params.genreId);
  res.status(httpStatus.OK).send({
    success: true,
    message: 'Genre deleted successfully.',
  });
});

export const genreController = {
  createGenre,
  getGenres,
  getGenre,
  updateGenre,
  deleteGenre,
}; 