import type { ReactNode } from 'react';
import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import type { User } from '@/types/user';
import type { Tokens, AuthResponse } from '@/types/auth';
import { logout as logoutApi } from '@/services/authApi';
import { PERMISSIONS } from '@/constants/permissions';

// Type for the data passed to the login function
type AuthData = AuthResponse['data'];

// Type for the context value
interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthData) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  permissions: Set<string>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const permissions = useMemo(() => {
    if (!user || !user.roles) return new Set<string>();
    
    const userPermissions = new Set(
      user.roles.flatMap(role => 
        (role.permissions || []).map(permission => permission.name)
      )
    );
    return userPermissions;
  }, [user]);

  const hasPermission = useCallback((requiredPermission: string): boolean => {
    return permissions.has(requiredPermission);
  }, [permissions]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedTokens = localStorage.getItem('tokens');

      if (storedUser && storedTokens) {
        setUser(JSON.parse(storedUser));
        setTokens(JSON.parse(storedTokens));
      }
    } catch (error) {
      console.error('Failed to parse auth data from localStorage', error);
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((data: AuthData) => {
    setUser(data.user);
    console.log(data.user);
    setTokens(data.tokens);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('tokens', JSON.stringify(data.tokens));
  }, []);

  const handleLogout = useCallback(async () => {
    if (tokens?.refresh.token) {
        try {
            await logoutApi({ refreshToken: tokens.refresh.token });
        } catch (error) {
            console.error("Backend logout failed, proceeding with client-side logout.", error);
        }
    }
    setUser(null);
    setTokens(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
  }, [tokens]);

  const value = useMemo(() => ({
    user,
    tokens,
    isAuthenticated: !!tokens,
    isLoading,
    login,
    logout: handleLogout,
    permissions,
    hasPermission
  }), [user, tokens, isLoading, handleLogout, permissions, hasPermission]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 