import type { User } from './user';

export interface Tokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: Tokens;
  }
}

export interface RefreshAuthResponse {
  success: boolean;
  message: string;
  data: Tokens;
} 