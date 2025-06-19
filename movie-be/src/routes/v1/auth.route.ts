import express from 'express';
import passport from '@/config/passport'; // Import passport config
import { authController } from '@/controllers/auth.controller';
import { validate } from '@/middleware/validate.middleware';
import { authValidation } from '@/validations/auth.validation';
import { userController } from '@/controllers/user.controller';
import { userValidation } from '@/validations/user.validation';
import { auth } from '@/middleware/auth.middleware';
// import { authValidation } from '@/validations/auth.validation'; // To be created

const router = express.Router();

router.use(passport.initialize()); // Initialize passport

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

router.post(
  '/change-password',
  auth(),
  validate(authValidation.changePassword),
  authController.changePassword,
);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
  authController.googleCallback
);

// Routes for the authenticated user to manage their own profile
router
  .route('/me')
  .get(auth(), userController.getMe)
  .patch(auth(), validate(userValidation.updateUser), userController.updateMe);

// Add other auth routes here, e.g., /logout, /refresh-token, /forgot-password

export default router; 