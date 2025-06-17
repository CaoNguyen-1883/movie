import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  fullName?: string;
  avatarUrl?: string;
  roles: Types.ObjectId[]; // Ref to Role
  isActive: boolean;
  isEmailVerified: boolean;
  googleId?: string;
  authProvider?: 'local' | 'google';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
} 