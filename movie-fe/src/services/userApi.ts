import type { User } from '@/types/user';
import api from '@/lib/axios';
import type { PaginatedResponse } from '@/types/api';

// We might need a more detailed User type for creation/updates
// For now, we'll use a generic approach.

export const getUsers = async (params?: any): Promise<PaginatedResponse<User>> => {
  const response = await api.get('/users', { params });
  return response.data.data;
};

export const getUser = async (userId: string): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  return response.data.data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const response = await api.post('/users', userData);
  return response.data.data;
};

export const updateUser = async (userId: string, updateData: Partial<User>): Promise<User> => {
  const response = await api.patch(`/users/${userId}`, updateData);
  return response.data.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};

export const updateMyProfile = async (payload: Partial<User>): Promise<User> => {
  const { data } = await api.patch('/users/me', payload);
  return data.data;
}

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return data.data;
} 