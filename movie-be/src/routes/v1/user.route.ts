import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { userValidation } from '@/validations/user.validation';
import { userController } from '@/controllers/user.controller';
import { PermissionType } from '@/models/permission.model';

const router = express.Router();

// These routes are for admin management of users
router
  .route('/')
  .post(auth(PermissionType.CREATE_USER), validate(userValidation.createUser), userController.createUser)
  .get(auth(PermissionType.READ_USER), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth(PermissionType.READ_USER), validate(userValidation.getUser), userController.getUser)
  .patch(auth(PermissionType.UPDATE_USER), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(PermissionType.DELETE_USER), validate(userValidation.deleteUser), userController.deleteUser);

export default router; 