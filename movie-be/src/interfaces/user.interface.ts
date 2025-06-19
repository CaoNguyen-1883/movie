import { Document, Model, Types } from 'mongoose';
import { IRole } from './role.interface';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  fullName?: string;
  avatarUrl?: string;
  roles: (Types.ObjectId | IRole)[];
  isActive: boolean;
  isEmailVerified: boolean;
  googleId?: string;
  authProvider?: 'local' | 'google';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserMethods {
  isPasswordMatch(password: string): Promise<boolean>;
} 