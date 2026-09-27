export type UserRole = "super_admin" | "admin" | "staff";

export type ModulePermissionKey =
  | "dashboard"
  | "leads"
  | "customers"
  | "projects"
  | "tasks"
  | "sales"
  | "proposals"
  | "contracts"
  | "support"
  | "team"
  | "admins"
  | "reports"
  | "settings";

export type UserPermissions = Record<ModulePermissionKey, boolean>;

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  designation?: string;
  department?: string;
  permissions: UserPermissions;
  accessToken?: string;
  refreshToken?: string;
}

// Preset Permissions for Quick Role Simulation
export const SUPER_ADMIN_PERMISSIONS: UserPermissions = {
  dashboard: true,
  leads: true,
  customers: true,
  projects: true,
  tasks: true,
  sales: true,
  proposals: true,
  contracts: true,
  support: true,
  team: true,
  admins: true,
  reports: true,
  settings: true,
};

export const ADMIN_PERMISSIONS: UserPermissions = {
  dashboard: true,
  leads: true,
  customers: true,
  projects: true,
  tasks: true,
  sales: true,
  proposals: true,
  contracts: true,
  support: true,
  team: true, // Can manage staff & assign permissions
  admins: false, // Cannot manage other Admins (Super Admin only)
  reports: true,
  settings: true,
};

export const STAFF_SALES_PERMISSIONS: UserPermissions = {
  dashboard: true,
  leads: true,
  customers: true,
  projects: false,
  tasks: true,
  sales: false, // Invoices hidden from sales
  proposals: true,
  contracts: false,
  support: false,
  team: false,
  admins: false,
  reports: false,
  settings: false,
};

export const STAFF_BILLING_PERMISSIONS: UserPermissions = {
  dashboard: true,
  leads: false, // Leads hidden from accounts
  customers: true,
  projects: false,
  tasks: false,
  sales: true, // Invoices & payments enabled
  proposals: false,
  contracts: false,
  support: false,
  team: false,
  admins: false,
  reports: true,
  settings: false,
};

export const STAFF_HR_PERMISSIONS: UserPermissions = {
  dashboard: true,
  leads: false,
  customers: false,
  projects: false,
  tasks: true, // Internal operational tasks & onboarding
  sales: false,
  proposals: false,
  contracts: false,
  support: false,
  team: true, // Employee records, attendance, leaves, HR management
  admins: false,
  reports: true, // Attendance & performance reports
  settings: false,
};
