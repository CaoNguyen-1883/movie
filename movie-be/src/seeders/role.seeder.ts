import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '@/config/database';
import Role from '@/models/role.model';
import Permission from '@/models/permission.model';
import { PermissionType } from '@/interfaces/permission.interface';

dotenv.config();

const seedRoles = async () => {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Database connected.');

  try {
    console.log('Fetching all permissions...');
    const allPermissions = await Permission.find({});
    if (allPermissions.length === 0) {
      console.error('Permissions are not seeded. Please run the permission seeder first.');
      process.exit(1);
    }
    const permissionMap = new Map(allPermissions.map((p) => [p.name, p._id]));

    // 1. Define and upsert USER role
    const userPermissionNames = [
      PermissionType.READ_MOVIES,
      PermissionType.READ_GENRES,
      PermissionType.READ_PEOPLE,
      PermissionType.READ_REVIEWS,
      PermissionType.CREATE_OWN_REVIEW,
      PermissionType.READ_OWN_HISTORY,
      PermissionType.UPDATE_OWN_HISTORY,
      PermissionType.DELETE_OWN_HISTORY,
    ];
    const userPermissionIds = userPermissionNames.map((name) => permissionMap.get(name as PermissionType)).filter(Boolean);

    await Role.findOneAndUpdate(
      { name: 'USER' },
      {
        name: 'USER',
        description: 'Default role for application users, with basic viewing and review creation permissions.',
        permissions: userPermissionIds,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log('- Upserted role: USER');

    // 2. Define and upsert ADMIN role (with ALL permissions)
    const allPermissionIds = allPermissions.map((p) => p._id);
    await Role.findOneAndUpdate(
      { name: 'ADMIN' },
      {
        name: 'ADMIN',
        description: 'System administrator with all permissions.',
        permissions: allPermissionIds,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log('- Upserted role: ADMIN');

    console.log('✅ Roles seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seedRoles(); 