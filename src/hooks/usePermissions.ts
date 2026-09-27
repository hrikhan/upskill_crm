import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ModulePermissionKey } from "@/types/auth";

export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const hasPermission = (module: ModulePermissionKey): boolean => {
    if (!user) return false;

    // Super Admin has unrestricted access to everything
    if (user.role === "super_admin") {
      return true;
    }

    // Admins module is strictly reserved for Super Admin
    if (module === "admins") {
      return false;
    }

    // Team & HR module is accessible to Super Admin, Admin, or Staff with team permission
    if (module === "team") {
      return user.role === "admin" || !!user.permissions?.team;
    }

    // If Admin, full CRM access except Admins module
    if (user.role === "admin") {
      return true;
    }

    // Staff: check explicit module permission
    return !!user.permissions?.[module];
  };

  return {
    user,
    role: user?.role || "staff",
    permissions: user?.permissions,
    hasPermission,
    isSuperAdmin: user?.role === "super_admin",
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
  };
};
