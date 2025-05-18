import { IPermission } from './permission.interface';

export interface IRole {
    id: string;
    name: string;
    description: string;
    permissions: IPermission[];
    createdAt: Date;
    updatedAt: Date;
} 