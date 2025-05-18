import { Role } from '../models/role.model';
import { AppException } from '../exceptions/AppException';
import { IRole } from '../interfaces/role.interface';

export class RoleService {
    async findAll() {
        return Role.find().populate('permissions');
    }

    async findById(id: string) {
        const role = await Role.findById(id).populate('permissions');

        if (!role) {
            throw new AppException('Role not found', 404, 'ROLE_NOT_FOUND');
        }

        return role;
    }

    async create(roleData: Partial<IRole>) {
        const { name } = roleData;

        // Check if role already exists
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            throw new AppException('Role already exists', 400, 'ROLE_EXISTS');
        }

        const role = await Role.create(roleData);
        return this.findById(role._id);
    }

    async update(id: string, roleData: Partial<IRole>) {
        const role = await Role.findById(id);
        if (!role) {
            throw new AppException('Role not found', 404, 'ROLE_NOT_FOUND');
        }

        // Check if new name conflicts with existing role
        if (roleData.name && roleData.name !== role.name) {
            const existingRole = await Role.findOne({ name: roleData.name });
            if (existingRole) {
                throw new AppException('Role name already exists', 400, 'ROLE_EXISTS');
            }
        }

        // Update role fields
        if (roleData.name) role.name = roleData.name;
        if (roleData.description) role.description = roleData.description;
        if (roleData.permissions) role.permissions = roleData.permissions;

        await role.save();

        return this.findById(id);
    }

    async delete(id: string) {
        const role = await Role.findById(id);
        
        if (!role) {
            throw new AppException('Role not found', 404, 'ROLE_NOT_FOUND');
        }

        await role.deleteOne();
        return true;
    }
} 