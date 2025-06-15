import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '@/config/database';
import { User } from '@/models/user.model';
import { Role } from '@/models/role.model';
import { RoleType } from '@/models/role.model';

dotenv.config();

const seedAdmin = async () => {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Database connected.');

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME;

    if (!adminEmail || !adminPassword || !adminUsername) {
      console.error('ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_USERNAME must be set in .env file');
      process.exit(1);
    }

    const adminRole = await Role.findOne({ name: RoleType.ADMIN });
    if (!adminRole) {
      console.error('ADMIN role not found. Please run "npm run seed:roles" first.');
      process.exit(1);
    }

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log('Creating admin user...');
      await User.create({
        email: adminEmail,
        username: adminUsername,
        password: adminPassword,
        role: adminRole._id,
        isEmailVerified: true,
      });
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seedAdmin(); 