import { Document } from 'mongoose';

export enum PermissionType {
  // User Management
  CREATE_USERS = 'CREATE_USERS',
  READ_USERS = 'READ_USERS',
  UPDATE_USERS = 'UPDATE_USERS',
  DELETE_USERS = 'DELETE_USERS',

  // Role Management
  CREATE_ROLES = 'CREATE_ROLES',
  READ_ROLES = 'READ_ROLES',
  UPDATE_ROLES = 'UPDATE_ROLES',
  DELETE_ROLES = 'DELETE_ROLES',

  // Permission Management
  READ_PERMISSIONS = 'READ_PERMISSIONS',

  // Movie Management
  CREATE_MOVIES = 'CREATE_MOVIES',
  READ_MOVIES = 'READ_MOVIES',
  UPDATE_MOVIES = 'UPDATE_MOVIES',
  DELETE_MOVIES = 'DELETE_MOVIES',

  // Genre Management
  CREATE_GENRES = 'CREATE_GENRES',
  READ_GENRES = 'READ_GENRES',
  UPDATE_GENRES = 'UPDATE_GENRES',
  DELETE_GENRES = 'DELETE_GENRES',

  // Person (Actor/Director) Management
  CREATE_PEOPLE = 'CREATE_PEOPLE',
  READ_PEOPLE = 'READ_PEOPLE',
  UPDATE_PEOPLE = 'UPDATE_PEOPLE',
  DELETE_PEOPLE = 'DELETE_PEOPLE',

  // Review Management
  DELETE_ANY_REVIEW = 'DELETE_ANY_REVIEW', // For admin/moderator to delete any review
  CREATE_OWN_REVIEW = 'CREATE_OWN_REVIEW', // For users to create their own review
  READ_REVIEWS = 'READ_REVIEWS',
  DELETE_REVIEWS = 'DELETE_REVIEWS',

  // Dashboard
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',

  // History Permissions
  READ_OWN_HISTORY = 'READ_OWN_HISTORY',
  UPDATE_OWN_HISTORY = 'UPDATE_OWN_HISTORY', // Create or update progress
  DELETE_OWN_HISTORY = 'DELETE_OWN_HISTORY', // Clear history for a movie
}

export interface IPermission extends Document {
  name: PermissionType;
  description: string;
  isActive: boolean;
} 