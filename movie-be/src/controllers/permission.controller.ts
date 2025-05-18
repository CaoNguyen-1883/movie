import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../services/permission.service';

const permissionService = new PermissionService();

export const permissionController = {
    // Get all permissions
    getAllPermissions: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const permissions = await permissionService.findAll();
            res.json({
                status: 'success',
                data: permissions
            });
        } catch (error) {
            next(error);
        }
    },

    // Get permission by ID
    getPermissionById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const permission = await permissionService.findById(req.params.id);
            res.json({
                status: 'success',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    },

    // Create new permission
    createPermission: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const permission = await permissionService.create(req.body);
            res.status(201).json({
                status: 'success',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    },

    // Update permission
    updatePermission: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const permission = await permissionService.update(req.params.id, req.body);
            res.json({
                status: 'success',
                data: permission
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete permission
    deletePermission: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await permissionService.delete(req.params.id);
            res.json({
                status: 'success',
                message: 'Permission deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}; 