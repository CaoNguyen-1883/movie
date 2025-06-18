import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { movieController } from '@/controllers/movie.controller';
import { PermissionType } from '@/interfaces/permission.interface';
import { validate } from '@/middleware/validate.middleware';
import { movieValidation } from '@/validations/movie.validation';

const router = express.Router();

router
  .route('/')
  .post(auth(PermissionType.CREATE_MOVIES), validate(movieValidation.createMovie), movieController.createMovie)
  .get(auth(PermissionType.READ_MOVIES), validate(movieValidation.getMovies), movieController.getMovies);

router
  .route('/:movieId')
  .get(auth(PermissionType.READ_MOVIES), validate(movieValidation.getMovie), movieController.getMovie)
  .patch(auth(PermissionType.UPDATE_MOVIES), validate(movieValidation.updateMovie), movieController.updateMovie)
  .delete(auth(PermissionType.DELETE_MOVIES), validate(movieValidation.deleteMovie), movieController.deleteMovie);

export default router; 