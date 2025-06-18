import type { IRole } from '@/types/role';
import api from '@/lib/axios';
import type { PaginatedResponse } from '@/types/api';

// This is for fetching all roles, e.g., for a dropdown in a form.
// The backend endpoint for GET /roles currently does not support pagination.
export const getAllRoles = async (): Promise<IRole[]> => {
  const response = await api.get('/roles');
  console.log('Raw API response for roles:', response); // Let's see the exact structure
  // Ensure we always return an array, even if response.data.data is null or undefined.
  return response.data.data || [];
};

// This is for fetching roles with pagination for a data table
export const getRoles = async (params?: any): Promise<PaginatedResponse<IRole>> => {
  const response = await api.get('/roles', { params });
  return response.data.data;
};

export const getRole = async (roleId: string): Promise<IRole> => {
  const response = await api.get(`/roles/${roleId}`);
  return response.data.data;
};

export const createRole = async (roleData: Partial<IRole>): Promise<IRole> => {
  const response = await api.post('/roles', roleData);
  return response.data.data;
};

export const updateRole = async (roleId: string, updateData: Partial<IRole>): Promise<IRole> => {
  const response = await api.patch(`/roles/${roleId}`, updateData);
  return response.data.data;
};

export const deleteRole = async (roleId: string): Promise<void> => {
  await api.delete(`/roles/${roleId}`);
}; 