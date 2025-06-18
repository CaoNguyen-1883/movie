import type { IPermission } from './permission';

export type IRole = {
  _id: string;
  name: string;
  description: string;
  permissions: IPermission[];
}; 