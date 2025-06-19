import type { IRole } from './role';


export type User = {
  id: string;
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