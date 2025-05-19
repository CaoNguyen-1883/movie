import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { loginSchema } from '../validations/auth.validation';

const router = Router();

// Login route
router.post('/login', validateRequest(loginSchema), authController.login);

// Refresh token route
router.post('/refresh-token', authController.refreshToken);

// Logout route
router.post('/logout', authController.logout);

export default router; 