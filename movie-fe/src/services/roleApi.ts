import type { IRole as Role } from '@/types/role';
import api from '@/lib/axios';

export const getRoles = async (params?: any): Promise<{ results: Role[], totalResults: number }> => {
  const response = await api.get('/roles', { params });
  return response.data.data;
};

export const getRole = async (roleId: string): Promise<Role> => {
  const response = await api.get(`/roles/${roleId}`);
  return response.data.data;
};

export const createRole = async (roleData: Partial<Role>): Promise<Role> => {
  const response = await api.post('/roles', roleData);
  return response.data.data;
};

export const updateRole = async (roleId: string, updateData: Partial<Role>): Promise<Role> => {
  const response = await api.patch(`/roles/${roleId}`, updateData);
  return response.data.data;
};

export const deleteRole = async (roleId: string): Promise<void> => {
  await api.delete(`/roles/${roleId}`);
}; 