import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react'; // Import ReactNode as a type

// Define the shape of the auth context state
interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with your User type/interface
  login: (email?: string, password?: string, userData?: any) => Promise<void>; // Added userData for register
  logout: () => Promise<void>;
  register: (username?: string, email?: string, password?: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

// Create the AuthContext with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Replace 'any' with your User type
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Placeholder login function
  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting login with:', { email, password });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace with actual API call to your backend /api/auth/login
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!response.ok) throw new Error('Login failed');
      // const data = await response.json();
      // setUser(data.user); // Assuming the API returns user info
      // Store tokens (localStorage, cookies, etc.)
      setUser({ email }); // Placeholder user
      setIsAuthenticated(true);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred during login.'));
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder register function
  const register = async (username?: string, email?: string, password?: string) => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting registration for:', { username, email });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace with actual API call to your backend /api/users/register or a dedicated register endpoint
      // const response = await fetch('/api/auth/register', { // Or whatever your registration endpoint is
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, email, password }),
      // });
      // if (!response.ok) throw new Error('Registration failed');
      // const data = await response.json();
      // setUser(data.user); // Assuming the API returns user info and possibly logs them in
      // setIsAuthenticated(true); // Or redirect to login
      console.log('Registration successful (simulated)');
      // For simplicity, we're not auto-logging in here. User can proceed to login.
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred during registration.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder logout function
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Logging out...');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace with actual API call to your backend /api/auth/logout
      // await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAuthenticated(false);
      // Clear tokens
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred during logout.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 