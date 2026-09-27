import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Check } from "lucide-react";
import {
  ModulePermissionKey,
  UserPermissions,
  STAFF_SALES_PERMISSIONS,
  STAFF_BILLING_PERMISSIONS,
  STAFF_HR_PERMISSIONS,
} from "@/types/auth";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  role: "admin" | "staff";
  status: "active" | "inactive";
  permissions: UserPermissions;
}

interface EditStaffPermissionsModalProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    staffId: string,
    updatedPermissions: UserPermissions,
    updatedDesignation: string,
    updatedDepartment: string
  ) => void;
}

const AVAILABLE_MODULES: {
  key: ModulePermissionKey;
  label: string;
  description: string;
  category: "Core CRM" | "Sales & Finance" | "Operations & Reporting";
}[] = [
  {
    key: "dashboard",
    label: "Overview Dashboard",
    description: "View top KPI metrics, recent activity feeds, and charts",
    category: "Core CRM",
  },
  {
    key: "leads",
    label: "Leads Pipeline",
    description: "Manage inbound leads, follow-up calls, and conversion",
    category: "Core CRM",
  },
  {
    key: "customers",
    label: "Clients & Customer Users",
    description: "View and manage registered clients and contacts",
    category: "Core CRM",
  },
  {
    key: "proposals",
    label: "Proposals & Estimates",
    description: "Create and dispatch quotations with digital acceptance",
    category: "Sales & Finance",
  },
  {
    key: "sales",
    label: "Invoices & Payments",
    description: "Create invoices, record payments, and track dues",
    category: "Sales & Finance",
  },
  {
    key: "contracts",
    label: "Contracts & Agreements",
    description: "Manage client contracts, terms, and digital agreements",
    category: "Sales & Finance",
  },
  {
    key: "tasks",
    label: "Operations & Tasks",
    description: "Manage task boards, assignments, and onboarding checklists",
    category: "Operations & Reporting",
  },
  {
    key: "projects",
    label: "Projects Delivery",
    description: "Track active project deliverables and milestone checklists",
    category: "Operations & Reporting",
  },
  {
    key: "support",
    label: "Support Tickets",
    description: "View client support tickets and customer messages",
    category: "Operations & Reporting",
  },
  {
    key: "team",
    label: "HR & Employee Management",
    description: "Access employee directory, attendance, and leave management",
    category: "Operations & Reporting",
  },
  {
    key: "reports",
    label: "Reports & Financials",
    description: "View revenue reports, sales analytics, and exports",
    category: "Operations & Reporting",
  },
];

export const EditStaffPermissionsModal: React.FC<EditStaffPermissionsModalProps> = ({
  staff,
  isOpen,
  onClose,
  onSave,
}) => {
  const [permissions, setPermissions] = useState<UserPermissions>(
    staff?.permissions || ({} as UserPermissions)
  );
  const [designation, setDesignation] = useState(staff?.designation || "");
  const [department, setDepartment] = useState(staff?.department || "");

  useEffect(() => {
    if (staff) {
      setPermissions(staff.permissions);
      setDesignation(staff.designation);
      setDepartment(staff.department);
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleToggle = (key: ModulePermissionKey) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectAll = () => {
    const updated = { ...permissions };
    AVAILABLE_MODULES.forEach((m) => {
      updated[m.key] = true;
    });
    setPermissions(updated);
  };

  const handleDeselectAll = () => {
    const updated = { ...permissions };
    AVAILABLE_MODULES.forEach((m) => {
      if (m.key !== "dashboard") {
        updated[m.key] = false;
      }
    });
    setPermissions(updated);
  };

  const handleApplyPreset = (preset: "sales" | "billing" | "hr") => {
    if (preset === "sales") {
      setPermissions({ ...STAFF_SALES_PERMISSIONS });
    } else if (preset === "billing") {
      setPermissions({ ...STAFF_BILLING_PERMISSIONS });
    } else if (preset === "hr") {
      setPermissions({ ...STAFF_HR_PERMISSIONS });
    }
  };

  const handleSave = () => {
    onSave(staff.id, permissions, designation, department);
    onClose();
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card surface rounded-2xl w-full max-w-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary-text">
                Edit Designation & Feature Permissions
              </h2>
              <p className="text-xs text-secondary-text">
                User: <span className="font-semibold text-primary-text">{staff.name}</span> ({staff.email})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Dynamic Role / Designation Edit Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-xl bg-light-background border border-border">
            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Dynamic Role / Designation *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Sales Executive, HR Officer"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-card text-primary-text focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-border bg-card text-primary-text focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="Sales & Inquiries">Sales & Inquiries</option>
                <option value="Billing & Accounts">Billing & Accounts</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Fleet Operations">Fleet Operations</option>
              </select>
            </div>
          </div>

          {/* Quick Select Buttons & Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider">
                Allowed Modules ({enabledCount} of {AVAILABLE_MODULES.length} enabled):
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                >
                  Enable All
                </button>
                <span className="text-border">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-xs text-secondary-text hover:text-primary-text cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Role Preset Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-secondary-text font-medium mr-1">
                Quick Preset:
              </span>
              <button
                type="button"
                onClick={() => handleApplyPreset("hr")}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 hover:opacity-90 cursor-pointer"
                title="HR Module, Employee Directory & Timesheets"
              >
                HR Preset (Team & Leaves)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("sales")}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:opacity-90 cursor-pointer"
              >
                Sales Preset
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("billing")}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 hover:opacity-90 cursor-pointer"
              >
                Billing Preset
              </button>
            </div>
          </div>

          {/* Categorized Permissions Grid */}
          {(["Core CRM", "Sales & Finance", "Operations & Reporting"] as const).map(
            (category) => {
              const categoryModules = AVAILABLE_MODULES.filter(
                (m) => m.category === category
              );

              return (
                <div key={category} className="space-y-2">
                  <h3 className="text-[11px] font-bold text-secondary-text uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categoryModules.map((module) => {
                      const isChecked = !!permissions[module.key];

                      return (
                        <div
                          key={module.key}
                          onClick={() => handleToggle(module.key)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                            isChecked
                              ? "bg-sky-50/60 dark:bg-sky-950/30 border-sky-400 dark:border-sky-700"
                              : "bg-light-background border-border hover:border-slate-300 dark:hover:border-slate-700 opacity-60"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-xs font-bold text-primary-text block leading-tight">
                              {module.label}
                            </span>
                            <span className="text-[10px] text-secondary-text leading-snug line-clamp-1 mt-0.5">
                              {module.description}
                            </span>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? "bg-sky-600 border-sky-600 text-white"
                                : "border-border bg-card"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-light-background">
          <span className="text-xs text-secondary-text">
            Changes apply instantly to staff navigation.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-secondary-text hover:text-primary-text hover:bg-card cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md cursor-pointer"
            >
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
