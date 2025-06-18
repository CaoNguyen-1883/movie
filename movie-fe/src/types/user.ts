import type { IRole } from './role';


export type User = {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  roles: IRole[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  authProvider?: 'local' | 'google';
}; 