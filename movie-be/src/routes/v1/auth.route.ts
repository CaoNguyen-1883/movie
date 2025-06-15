import express from 'express';
import { authController } from '@/controllers/auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { authValidation } from '@/validations/auth.validation';
import { userController } from '@/controllers/user.controller';
import { userValidation } from '@/validations/user.validation';
import { auth } from '@/middleware/auth.middleware';
// import { authValidation } from '@/validations/auth.validation'; // To be created

const router = express.Router();

router.post(
  '/register', 
  validate(authValidation.register),
  authController.register
);

router.post(
  '/login',
  validate(authValidation.login),
  authController.login
);

router.post(
  '/logout',
  validate(authValidation.logout),
  authController.logout
);

router.post(
  '/refresh-token',
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);

// Routes for the authenticated user to manage their own profile
router
  .route('/me')
  .get(auth(), userController.getMe)
  .patch(auth(), validate(userValidation.updateUser), userController.updateMe);

// Add other auth routes here, e.g., /logout, /refresh-token, /forgot-password

export default router; 