import { Router } from 'express';
import { permissionController } from '../controllers/permission.controller';
import { checkPermission } from '../middlewares/checkPermission';

const router = Router();

// Get all permissions
router.get('/', checkPermission('MANAGE_ROLES'), permissionController.getAllPermissions);

// Get permission by ID
router.get('/:id', checkPermission('MANAGE_ROLES'), permissionController.getPermissionById);

// Create new permission
router.post('/', checkPermission('MANAGE_ROLES'), permissionController.createPermission);

// Update permission
router.put('/:id', checkPermission('MANAGE_ROLES'), permissionController.updatePermission);

// Delete permission
router.delete('/:id', checkPermission('MANAGE_ROLES'), permissionController.deletePermission);

export default router; 