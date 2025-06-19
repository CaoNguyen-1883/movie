import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import  AuthPage  from './pages/AuthPage';
import  HomePage  from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { GoogleCallbackPage } from './pages/GoogleCallbackPage';
import { AdminRoute, ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import UserManagementPage from './pages/admin/UserManagementPage';
import RoleManagementPage from './pages/admin/RoleManagementPage';
import GenreManagementPage from './pages/admin/GenreManagementPage';
import PersonManagementPage from './pages/admin/PersonManagementPage';
import MovieManagementPage from './pages/admin/MovieManagementPage';
import MovieDetailPage from './pages/MovieDetailPage';
import ProfilePage from './pages/ProfilePage';
import MoviesPage from './pages/MoviesPage';

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
          <Route path="/movie/:slug" element={<MovieDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          
          {/* Admin-only routes are also nested inside the MainLayout */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/roles" element={<RoleManagementPage />} />
            <Route path="/admin/genres" element={<GenreManagementPage />} />
            <Route path="/admin/people" element={<PersonManagementPage />} />
            <Route path="/admin/movies" element={<MovieManagementPage />} />
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
