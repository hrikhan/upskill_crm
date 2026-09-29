import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import {
  AuthUser,
  UserPermissions,
  UserRole,
  SUPER_ADMIN_PERMISSIONS,
  ADMIN_PERMISSIONS,
  STAFF_SALES_PERMISSIONS,
  STAFF_BILLING_PERMISSIONS,
  STAFF_HR_PERMISSIONS,
} from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  activeRole: UserRole;
}

// Default initial state: Super Admin (Root Master)
const initialUser: AuthUser = {
  userId: "user-super-1",
  name: "Upskill CRM",
  email: "superadmin@upskillcrm.com",
  phone: "01700000000",
  role: "super_admin",
  designation: "Platform Master / Owner",
  department: "Executive",
  permissions: SUPER_ADMIN_PERMISSIONS,
  accessToken: "mock-super-admin-token",
};

const initialState: AuthState = {
  user: initialUser,
  activeRole: "super_admin",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload } as AuthUser;
      }
    },
    // Switch simulation preset for fast live testing of permissions
    switchRolePreset: (
      state,
      action: PayloadAction<"super_admin" | "admin" | "staff_sales" | "staff_billing" | "staff_hr">
    ) => {
      switch (action.payload) {
        case "super_admin":
          state.user = {
            userId: "user-super-1",
            name: "Upskill CRM",
            email: "superadmin@upskillcrm.com",
            phone: "01700000000",
            role: "super_admin",
            designation: "Platform Master / Owner",
            department: "Executive",
            permissions: SUPER_ADMIN_PERMISSIONS,
          };
          state.activeRole = "super_admin";
          break;

        case "admin":
          state.user = {
            userId: "user-admin-1",
            name: "Hridoy Khan (Admin)",
            email: "hridoy@upskillcrm.com",
            phone: "01711111111",
            role: "admin",
            designation: "Operations Director",
            department: "Management",
            permissions: ADMIN_PERMISSIONS,
          };
          state.activeRole = "admin";
          break;

        case "staff_sales":
          state.user = {
            userId: "user-staff-sales",
            name: "Sarah Jenkins (Sales Staff)",
            email: "sarah.sales@upskillcrm.com",
            phone: "01722222222",
            role: "staff",
            designation: "Senior Sales Executive",
            department: "Sales & Inquiries",
            permissions: STAFF_SALES_PERMISSIONS,
          };
          state.activeRole = "staff";
          break;

        case "staff_billing":
          state.user = {
            userId: "user-staff-billing",
            name: "Rashid Ahmed (Billing Staff)",
            email: "rashid.accounts@upskillcrm.com",
            phone: "01733333333",
            role: "staff",
            designation: "Billing & Accounts Officer",
            department: "Finance",
            permissions: STAFF_BILLING_PERMISSIONS,
          };
          state.activeRole = "staff";
          break;

        case "staff_hr":
          state.user = {
            userId: "user-staff-hr",
            name: "Farhana Yasmin (HR Staff)",
            email: "hr@upskillcrm.com",
            phone: "01744444444",
            role: "staff",
            designation: "Human Resources Officer",
            department: "Human Resources",
            permissions: STAFF_HR_PERMISSIONS,
          };
          state.activeRole = "staff";
          break;
      }
    },
    // Custom permission updater
    updateUserPermissions: (state, action: PayloadAction<Partial<UserPermissions>>) => {
      if (state.user) {
        state.user.permissions = {
          ...state.user.permissions,
          ...action.payload,
        };
      }
    },
    logOut: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("persist/REHYDRATE" as any, (state, action: any) => {
      if (action.payload?.auth?.user) {
        const persistedUser = action.payload.auth.user;
        if (!persistedUser.permissions || !persistedUser.role) {
          state.user = initialUser;
          state.activeRole = "super_admin";
        }
      }
    });
  },
});

export const { setUser, switchRolePreset, updateUserPermissions, logOut } =
  authSlice.actions;

export const logout = logOut;

export default authSlice.reducer;
