import type { AuthResponse } from '@/types/auth';
import type { RegisterCredentials, LoginCredentials } from '@/types/credentials';
import api from '@/lib/axios';

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', credentials);
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const logout = async (payload: { refreshToken: string }): Promise<void> => {
  await api.post('/auth/logout', payload);
}; 

