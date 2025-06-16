import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { genreController } from '@/controllers/genre.controller';
import { PermissionType } from '@/interfaces/permission.interface';
// import { validate } from '@/middleware/validate.middleware';
// import { genreValidation } from '@/validations/genre.validation';

const router = express.Router();

router
  .route('/')
  .post(auth(PermissionType.CREATE_GENRES), genreController.createGenre)
  .get(auth(PermissionType.READ_GENRES), genreController.getGenres);

router
  .route('/:genreId')
  .get(auth(PermissionType.READ_GENRES), genreController.getGenre)
  .patch(auth(PermissionType.UPDATE_GENRES), genreController.updateGenre)
  .delete(auth(PermissionType.DELETE_GENRES), genreController.deleteGenre);

export default router; 