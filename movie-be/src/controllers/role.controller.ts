import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';

const roleService = new RoleService();

export const roleController = {
    // Get all roles
    getAllRoles: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roles = await roleService.findAll();
            res.json({
                status: 'success',
                data: roles
            });
        } catch (error) {
            next(error);
        }
    },

    // Get role by ID
    getRoleById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const role = await roleService.findById(req.params.id);
            res.json({
                status: 'success',
                data: role
            });
        } catch (error) {
            next(error);
        }
    },

    // Create new role
    createRole: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const role = await roleService.create(req.body);
            res.status(201).json({
                status: 'success',
                data: role
            });
        } catch (error) {
            next(error);
        }
    },

    // Update role
    updateRole: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const role = await roleService.update(req.params.id, req.body);
            res.json({
                status: 'success',
                data: role
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete role
    deleteRole: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await roleService.delete(req.params.id);
            res.json({
                status: 'success',
                message: 'Role deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}; 