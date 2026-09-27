import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { ModulePermissionKey, UserRole } from "@/types/auth";
import Unauthorized from "@/common/Unauthorized";

interface ProtectedRouteProps {
  requiredModule?: ModulePermissionKey;
  requiredRole?: UserRole[];
}

export const ProtectedRoute = ({
  requiredModule,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user, hasPermission } = usePermissions();

  // If not logged in, redirect to login page
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles required (e.g. ['super_admin'])
  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Unauthorized />;
  }

  // If specific module permission required
  if (requiredModule && !hasPermission(requiredModule)) {
    return <Unauthorized />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
