import api from '@/lib/axios';
import type { AuthResponse, ChangePasswordPayload } from '@/types/auth';
import type { LoginCredentials, RegisterCredentials } from '@/types/credentials';

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

export const refreshAuth = async (payload: { refreshToken: string }): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/refresh-tokens', payload);
  return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await api.post('/auth/change-password', payload);
  return data;
}; 

