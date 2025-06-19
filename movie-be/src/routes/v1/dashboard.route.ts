import express from 'express';
import { dashboardController } from '@/controllers/dashboard.controller';
import { auth } from '@/middleware/auth.middleware';

const router = express.Router();

router.get('/', auth('VIEW_DASHBOARD'), dashboardController.getDashboardStats);

export default router; 