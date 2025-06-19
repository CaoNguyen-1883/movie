import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { userValidation } from '@/validations/user.validation';
import { userController } from '@/controllers/user.controller';
import { PermissionType } from '@/interfaces/permission.interface';

const router = express.Router();

router
  .route('/me')
  .get(auth(), userController.getMe)
  .patch(auth(PermissionType.UPDATE_OWN_PROFILE), validate(userValidation.updateMyProfile), userController.updateMe);

// These routes are for admin management of users
router
  .route('/')
  .post(auth(PermissionType.CREATE_USERS), validate(userValidation.createUser), userController.createUser)
  .get(auth(PermissionType.READ_USERS), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth(PermissionType.READ_USERS), validate(userValidation.getUser), userController.getUser)
  .patch(auth(PermissionType.UPDATE_USERS), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(PermissionType.DELETE_USERS), validate(userValidation.deleteUser), userController.deleteUser);

export default router; 