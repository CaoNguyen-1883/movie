import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import mongoose from 'mongoose';

const permissions = [
    {
        name: 'View Movies',
        description: 'Can view movies',
        code: 'VIEW_MOVIES'
    },
    {
        name: 'Create Movies',
        description: 'Can create new movies',
        code: 'CREATE_MOVIES'
    },
    {
        name: 'Edit Movies',
        description: 'Can edit existing movies',
        code: 'EDIT_MOVIES'
    },
    {
        name: 'Delete Movies',
        description: 'Can delete movies',
        code: 'DELETE_MOVIES'
    },
    {
        name: 'Manage Users',
        description: 'Can manage user accounts',
        code: 'MANAGE_USERS'
    },
    {
        name: 'Manage Roles',
        description: 'Can manage roles and permissions',
        code: 'MANAGE_ROLES'
    }
];

// Define role permissions mapping
const rolePermissions = {
    ADMIN: [
        'VIEW_MOVIES',
        'CREATE_MOVIES',
        'EDIT_MOVIES',
        'DELETE_MOVIES',
        'MANAGE_USERS',
        'MANAGE_ROLES'
    ],
    MODERATOR: [
        'VIEW_MOVIES',
        'CREATE_MOVIES',
        'EDIT_MOVIES',
        'MANAGE_USERS'
    ],
    USER: [
        'VIEW_MOVIES'
    ]
};

const roles = [
    {
        name: 'Admin',
        description: 'Full system access',
        permissions: [] // Will be populated with all permissions
    },
    {
        name: 'Moderator',
        description: 'Can manage movies and basic user operations',
        permissions: [] // Will be populated with specific permissions
    },
    {
        name: 'User',
        description: 'Basic user access',
        permissions: [] // Will be populated with basic permissions
    }
];

const adminUser = {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    fullName: 'System Administrator',
    isActive: true,
    roles: [] // Will be populated with admin role
};

export const seedInitialData = async () => {
    try {
        // Create permissions
        const createdPermissions = await Permission.insertMany(permissions);
        console.log('Permissions created successfully');

        // Create roles with permissions
        const adminRole = {
            ...roles[0],
            permissions: createdPermissions
                .filter(p => rolePermissions.ADMIN.includes(p.code))
                .map(p => p._id)
        };

        const moderatorRole = {
            ...roles[1],
            permissions: createdPermissions
                .filter(p => rolePermissions.MODERATOR.includes(p.code))
                .map(p => p._id)
        };

        const userRole = {
            ...roles[2],
            permissions: createdPermissions
                .filter(p => rolePermissions.USER.includes(p.code))
                .map(p => p._id)
        };

        const createdRoles = await Role.insertMany([adminRole, moderatorRole, userRole]);
        console.log('Roles created successfully');

        // Create admin user
        const adminRoleId = createdRoles.find(r => r.name === 'Admin')?._id;
        if (adminRoleId) {
            await User.create({
                ...adminUser,
                roles: [adminRoleId]
            });
            console.log('Admin user created successfully');
        }

        console.log('Initial data seeding completed');
    } catch (error) {
        console.error('Error seeding initial data:', error);
        throw error;
    }
}; 