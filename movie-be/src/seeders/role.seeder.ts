import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '@/config/database';
import { Role } from '@/models/role.model';
import { RoleType } from '@/models/role.model';
import { Permission } from '@/models/permission.model';
import { PermissionType } from '@/models/permission.model';

dotenv.config();

const seedRoles = async () => {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Database connected.');

  try {
    console.log('Seeding roles...');

    // Ensure permissions are seeded first
    const allPermissions = await Permission.find({});
    if (allPermissions.length === 0) {
      console.error('Permissions are not seeded. Please run "npm run seed:permissions" first.');
      process.exit(1);
    }
    // Get all permission names from the enum to ensure completeness
    const allPermissionNames = Object.values(PermissionType);

    // 1. Create/Update USER role
    const userPermissions = [PermissionType.READ_CONTENT]; // Example basic permission
    await Role.findOneAndUpdate(
      { name: RoleType.USER },
      { name: RoleType.USER, description: 'Default role for all new users', permissions: userPermissions },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`- Upserted role: ${RoleType.USER}`);

    // 2. Create/Update ADMIN role
    await Role.findOneAndUpdate(
      { name: RoleType.ADMIN },
      { name: RoleType.ADMIN, description: 'Has all permissions', permissions: allPermissionNames },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`- Upserted role: ${RoleType.ADMIN}`);

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