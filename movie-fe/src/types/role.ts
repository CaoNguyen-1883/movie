import type { IPermission } from './permission';

export type IRole = {
  id: string;
  _id: string;
  name: string;
  description: string;
  permissions: IPermission[];
}; 