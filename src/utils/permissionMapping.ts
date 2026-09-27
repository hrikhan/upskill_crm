import {
  ModulePermissionKey,
  AuthUser,
  SUPER_ADMIN_PERMISSIONS,
  ADMIN_PERMISSIONS,
  STAFF_SALES_PERMISSIONS,
} from "@/types/auth";

export const getModuleKeyFromPathOrLabel = (
  pathOrLabel: string
): ModulePermissionKey | null => {
  let clean = pathOrLabel.toLowerCase().trim();
  // Strip leading base prefixes
  clean = clean.replace(/^\/admin\/?/, "").replace(/^\/user\/?/, "");

  if (!clean || clean === "dashboard" || clean.startsWith("dashboard")) return "dashboard";
  if (clean.startsWith("lead")) return "leads";
  if (clean.startsWith("customer") || clean.startsWith("client")) return "customers";
  if (clean.startsWith("project")) return "projects";
  if (clean.startsWith("task")) return "tasks";
  if (
    clean.startsWith("sale") ||
    clean.startsWith("invoice") ||
    clean.startsWith("payment") ||
    clean.startsWith("estimate") ||
    clean.startsWith("subscription") ||
    clean.startsWith("product") ||
    clean.startsWith("expense")
  ) {
    return "sales";
  }
  if (clean.startsWith("proposal")) return "proposals";
  if (clean.startsWith("contract")) return "contracts";
  if (
    clean.startsWith("support") ||
    clean.startsWith("ticket") ||
    clean.startsWith("canned") ||
    clean.startsWith("knowledgebase") ||
    clean.startsWith("message")
  ) {
    return "support";
  }
  if (clean === "admins" || clean.startsWith("admins/")) return "admins";
  if (
    clean.startsWith("team") ||
    clean.startsWith("member") ||
    clean.startsWith("timesheet") ||
    clean.startsWith("leave") ||
    clean.startsWith("hr") ||
    clean.startsWith("role")
  ) {
    return "team";
  }
  if (clean.startsWith("report")) return "reports";
  if (clean.startsWith("setting")) return "settings";

  return null;
};

export const canUserAccessMenuItem = (
  user: AuthUser | null,
  pathOrLabel: string
): boolean => {
  // If not logged in at all, allow navigation so ProtectedRoute can redirect to login
  if (!user) return true;

  // Super Admin has unrestricted access to everything
  if (user.role === "super_admin") return true;

  const moduleKey = getModuleKeyFromPathOrLabel(pathOrLabel);
  if (!moduleKey) return true; // General utility items

  // Admins module is strictly reserved for Super Admin
  if (moduleKey === "admins") {
    return false;
  }

  // Team & HR module: accessible to Admin and Staff with team permission (HR Staff)
  if (moduleKey === "team") {
    return user.role === "admin" || !!user.permissions?.team;
  }

  // Admin has access to all operational CRM modules
  if (user.role === "admin") {
    return true;
  }

  // Staff: check individual module permission (with fallback to default sales permissions)
  const permissions = user.permissions || STAFF_SALES_PERMISSIONS;

  return !!permissions[moduleKey];
};
