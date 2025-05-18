import { Permission } from '../models/permission.model';
import { AppException } from '../exceptions/AppException';
import { IPermission } from '../interfaces/permission.interface';

export class PermissionService {
    async findAll() {
        return Permission.find();
    }

    async findById(id: string) {
        const permission = await Permission.findById(id);

        if (!permission) {
            throw new AppException('Permission not found', 404, 'PERMISSION_NOT_FOUND');
        }

        return permission;
    }

    async create(permissionData: Partial<IPermission>) {
        const { name, code } = permissionData;

        // Check if permission already exists
        const existingPermission = await Permission.findOne({
            $or: [{ name }, { code }]
        });

        if (existingPermission) {
            throw new AppException('Permission already exists', 400, 'PERMISSION_EXISTS');
        }

        const permission = await Permission.create({
            ...permissionData,
            code: code?.toUpperCase()
        });

        return this.findById(permission._id);
    }

    async update(id: string, permissionData: Partial<IPermission>) {
        const permission = await Permission.findById(id);
        if (!permission) {
            throw new AppException('Permission not found', 404, 'PERMISSION_NOT_FOUND');
        }

        // Check if new name or code conflicts with existing permission
        if ((permissionData.name && permissionData.name !== permission.name) || 
            (permissionData.code && permissionData.code !== permission.code)) {
            const existingPermission = await Permission.findOne({
                $or: [
                    { name: permissionData.name || permission.name },
                    { code: permissionData.code ? permissionData.code.toUpperCase() : permission.code }
                ],
                _id: { $ne: id }
            });

            if (existingPermission) {
                throw new AppException('Permission name or code already exists', 400, 'PERMISSION_EXISTS');
            }
        }

        // Update permission fields
        if (permissionData.name) permission.name = permissionData.name;
        if (permissionData.description) permission.description = permissionData.description;
        if (permissionData.code) permission.code = permissionData.code.toUpperCase();

        await permission.save();

        return this.findById(id);
    }

    async delete(id: string) {
        const permission = await Permission.findById(id);
        
        if (!permission) {
            throw new AppException('Permission not found', 404, 'PERMISSION_NOT_FOUND');
        }

        await permission.deleteOne();
        return true;
    }
} 