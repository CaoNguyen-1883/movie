import express from 'express';
import { auth } from '@/middleware/auth.middleware';
import { permissionController } from '@/controllers/permission.controller';
import { PermissionType } from '@/interfaces/permission.interface';

const router = express.Router();

router.route('/').get(auth(PermissionType.READ_PERMISSIONS), permissionController.getPermissions);

export default router; 