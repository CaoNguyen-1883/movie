import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { checkPermission } from '../middlewares/checkPermission';

const router = Router();

// Get all users
router.get('/', checkPermission('MANAGE_USERS'), userController.getAllUsers);

// Get user by ID
router.get('/:id', checkPermission('MANAGE_USERS'), userController.getUserById);

// Create new user
router.post('/', checkPermission('MANAGE_USERS'), userController.createUser);

// Update user
router.put('/:id', checkPermission('MANAGE_USERS'), userController.updateUser);

// Delete user
router.delete('/:id', checkPermission('MANAGE_USERS'), userController.deleteUser);

export default router; 