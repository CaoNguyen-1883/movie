import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from '@/config/database';
import Permission from '@/models/permission.model';
import { PermissionType } from '@/interfaces/permission.interface';

const permissionsToSeed: { name: PermissionType; description: string }[] = [
  // Users
  { name: PermissionType.CREATE_USERS, description: 'Allows creating new users.' },
  { name: PermissionType.READ_USERS, description: 'Allows viewing a list of users and their details.' },
  { name: PermissionType.UPDATE_USERS, description: 'Allows updating user information.' },
  { name: PermissionType.DELETE_USERS, description: 'Allows deleting users.' },
  { name: PermissionType.UPDATE_OWN_PROFILE, description: 'Allows a user to update their own profile information.' },
  // Roles
  { name: PermissionType.CREATE_ROLES, description: 'Allows creating new roles.' },
  { name: PermissionType.READ_ROLES, description: 'Allows viewing a list of roles and their permissions.' },
  { name: PermissionType.UPDATE_ROLES, description: 'Allows updating roles and their assigned permissions.' },
  { name: PermissionType.DELETE_ROLES, description: 'Allows deleting roles.' },
  // Permissions
  { name: PermissionType.READ_PERMISSIONS, description: 'Allows viewing the list of all available permissions in the system.' },
  // Movies
  { name: PermissionType.CREATE_MOVIES, description: 'Allows adding new movies.' },
  { name: PermissionType.READ_MOVIES, description: 'Allows viewing the list of movies and their details.' },
  { name: PermissionType.UPDATE_MOVIES, description: 'Allows updating movie information.' },
  { name: PermissionType.DELETE_MOVIES, description: 'Allows deleting movies.' },
  // Genres
  { name: PermissionType.CREATE_GENRES, description: 'Allows adding new genres.' },
  { name: PermissionType.READ_GENRES, description: 'Allows viewing the list of genres.' },
  { name: PermissionType.UPDATE_GENRES, description: 'Allows updating genre names and descriptions.' },
  { name: PermissionType.DELETE_GENRES, description: 'Allows deleting genres.' },
  // People
  { name: PermissionType.CREATE_PEOPLE, description: 'Allows adding new people (actors, directors).' },
  { name: PermissionType.READ_PEOPLE, description: 'Allows viewing the list of people and their details.' },
  { name: PermissionType.UPDATE_PEOPLE, description: 'Allows updating information about people.' },
  { name: PermissionType.DELETE_PEOPLE, description: 'Allows deleting people.' },
  // Reviews
  { name: PermissionType.DELETE_ANY_REVIEW, description: 'Allows an admin or moderator to delete any review.' },
  { name: PermissionType.CREATE_OWN_REVIEW, description: 'Allows a user to post a review for a movie.' },
  { name: PermissionType.READ_OWN_REVIEWS, description: 'Allows a user to read their own reviews.' },
  { name: PermissionType.EDIT_OWN_REVIEW, description: 'Allows a user to edit their own review.' },
  { name: PermissionType.DELETE_OWN_REVIEW, description: 'Allows a user to delete their own review.' },
  { name: PermissionType.READ_REVIEWS, description: 'Allows viewing reviews for a movie.' },
  // Dashboard
  { name: PermissionType.VIEW_DASHBOARD, description: 'Allows access to the admin dashboard for statistics.' },
  {
    name: PermissionType.DELETE_REVIEWS,
    description: 'Delete any review',
  },
  // History
  {
    name: PermissionType.READ_OWN_HISTORY,
    description: "Read user's own viewing history",
  },
  {
    name: PermissionType.UPDATE_OWN_HISTORY,
    description: "Update user's own viewing history (add/update progress)",
  },
  {
    name: PermissionType.DELETE_OWN_HISTORY,
    description: "Delete user's own viewing history for a movie",
  },
];

const seedPermissions = async () => {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Database connected.');

  try {
    console.log('Seeding permissions...');

    for (const p of permissionsToSeed) {
      await Permission.findOneAndUpdate({ name: p.name }, p, { upsert: true, new: true });
      console.log(`- Upserted permission: ${p.name}`);
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