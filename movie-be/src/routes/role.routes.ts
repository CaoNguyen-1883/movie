import { Router } from 'express';
import { roleController } from '../controllers/role.controller';
import { checkPermission } from '../middlewares/checkPermission';

const router = Router();

// Get all roles
router.get('/', checkPermission('MANAGE_ROLES'), roleController.getAllRoles);

// Get role by ID
router.get('/:id', checkPermission('MANAGE_ROLES'), roleController.getRoleById);

// Create new role
router.post('/', checkPermission('MANAGE_ROLES'), roleController.createRole);

// Update role
router.put('/:id', checkPermission('MANAGE_ROLES'), roleController.updateRole);

// Delete role
router.delete('/:id', checkPermission('MANAGE_ROLES'), roleController.deleteRole);

export default router; 