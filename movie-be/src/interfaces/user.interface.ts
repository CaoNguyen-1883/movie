import { IRole } from './role.interface';

export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    fullName: string;
    avatar?: string;
    isActive: boolean;
    roles: IRole[];
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
} 