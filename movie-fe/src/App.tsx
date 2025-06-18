import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { GoogleCallbackPage } from './pages/GoogleCallbackPage';
import { AdminRoute, ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes that should not be accessible when logged in */}
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/" replace /> : <AuthPage />} 
      />

      {/* 
        This is the main protected area of the app.
        All routes inside will first check for an authenticated user.
        Then, they will be rendered inside the MainLayout.
      */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          
          {/* Admin-only routes are also nested inside the MainLayout */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          
          {/* We'll add other pages like /profile or /settings here later */}
        </Route>
      </Route>

      {/* Fallback route: redirects to home if logged in, or auth if not */}
      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
    </Routes>
  );
}

export default App;
