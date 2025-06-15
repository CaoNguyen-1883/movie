import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '@/config/database';
import { Permission } from '@/models/permission.model';
import { PermissionType } from '@/models/permission.model';

dotenv.config();

const permissions = Object.values(PermissionType).map(permission => ({
  name: permission,
  description: `${permission.toLowerCase().replace(/_/g, ' ')} permission`, // e.g., 'create user permission'
}));

const seedPermissions = async () => {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Database connected.');

  try {
    console.log('Seeding permissions...');
    
    for (const p of permissions) {
      const permissionExists = await Permission.findOne({ name: p.name });
      if (!permissionExists) {
        await Permission.create(p);
        console.log(`- Created permission: ${p.name}`);
      } else {
        console.log(`- Permission already exists: ${p.name}`);
      }
    }
    
    console.log('✅ Permissions seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding permissions:', error);
    process.exit(1);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seedPermissions(); 