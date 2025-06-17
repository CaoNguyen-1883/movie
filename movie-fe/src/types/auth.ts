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
  user: User;
  tokens: Tokens;
} 