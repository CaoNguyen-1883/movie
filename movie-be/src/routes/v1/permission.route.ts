import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { permissionController } from '@/controllers/permission.controller';

const router = express.Router();

router
  .route('/')
  .get(auth('MANAGE_ROLES'), permissionController.getPermissions);

export default router; 