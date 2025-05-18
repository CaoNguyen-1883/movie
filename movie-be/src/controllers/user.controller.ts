import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const userController = {
    // Get all users
    getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await userService.findAll();
            res.json({
                status: 'success',
                data: users
            });
        } catch (error) {
            next(error);
        }
    },

    // Get user by ID
    getUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userService.findById(req.params.id);
            res.json({
                status: 'success',
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    // Create new user
    createUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userService.create(req.body);
            res.status(201).json({
                status: 'success',
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    // Update user
    updateUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userService.update(req.params.id, req.body);
            res.json({
                status: 'success',
                data: user
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete user
    deleteUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userService.delete(req.params.id);
            res.json({
                status: 'success',
                message: 'User deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}; 