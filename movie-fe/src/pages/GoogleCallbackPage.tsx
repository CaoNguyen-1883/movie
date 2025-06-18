import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types/user';
import type { Tokens } from '@/types/auth';

export const GoogleCallbackPage = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const userString = params.get('user');

    if (accessToken && refreshToken && userString) {
      try {
        // Decode the Base64 user string and then parse it as JSON
        const decodedUserString = atob(userString);
        const user: User = JSON.parse(decodedUserString);
        // Note: The backend doesn't send expiry dates in the query params,
        // so we create a partial Tokens object. The AuthContext should handle this gracefully.
        const tokens: Tokens = { 
          access: { token: accessToken, expires: '' }, 
          refresh: { token: refreshToken, expires: '' } 
        };
        
        login({ user, tokens });
        navigate('/', { replace: true });
      } catch (error) {
        console.error("Failed to parse user data from URL", error);
        navigate('/auth', { replace: true });
      }
    } else {
        console.error("Google callback did not receive the required tokens or user data.");
        navigate('/auth', { replace: true });
    }
  }, [location, login, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
    </div>
  );
}; 