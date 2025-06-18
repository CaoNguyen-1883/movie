import type { AuthResponse, RefreshAuthResponse } from '@/types/auth';
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

export const refreshAuth = async (payload: { refreshToken: string }): Promise<RefreshAuthResponse> => {
  const response = await api.post<RefreshAuthResponse>('/auth/refresh-tokens', payload);
  return response.data;
}; 

