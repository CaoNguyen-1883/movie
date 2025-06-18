import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSIONS } from "@/constants/permissions";

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export const ProtectedRoute = ({ requiredPermission }: ProtectedRouteProps) => {
  const { user, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" />; // Or a dedicated "Unauthorized" page
  }

  return <Outlet />;
};

// Example usage for an admin-only route
export const AdminRoute = () => {
    return <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS} />
} 