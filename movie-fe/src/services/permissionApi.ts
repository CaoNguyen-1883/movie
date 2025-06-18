import type { IPermission as Permission } from '@/types/permission';
import api from '@/lib/axios';

export const getPermissions = async (params?: any): Promise<{ results: Permission[], totalResults: number }> => {
  const response = await api.get('/permissions', { params });
  return response.data.data;
}; 