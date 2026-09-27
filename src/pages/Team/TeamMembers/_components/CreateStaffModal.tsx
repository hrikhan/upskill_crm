import React, { useState } from "react";
import { X, UserPlus, CheckCircle2, XCircle } from "lucide-react";
import { StaffMember } from "./EditStaffPermissionsModal";
import {
  STAFF_SALES_PERMISSIONS,
  STAFF_BILLING_PERMISSIONS,
  STAFF_HR_PERMISSIONS,
  UserPermissions,
  ModulePermissionKey,
} from "@/types/auth";

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (staff: Omit<StaffMember, "id">) => void;
}

const ALL_MODULES: { key: ModulePermissionKey; label: string; desc: string }[] = [
  { key: "dashboard", label: "Overview Dashboard", desc: "KPI metrics & charts" },
  { key: "leads", label: "Leads & Pipeline", desc: "Sales inquiries & conversion" },
  { key: "customers", label: "Clients & Contacts", desc: "Customer profiles & contacts" },
  { key: "proposals", label: "Proposals", desc: "Quotations & estimates" },
  { key: "sales", label: "Sales & Invoicing", desc: "Invoices, 2,000 BDT installments & subscriptions" },
  { key: "contracts", label: "Contracts & AMC", desc: "Service level agreements" },
  { key: "tasks", label: "Operations Tasks", desc: "Task board & work orders" },
  { key: "projects", label: "Fleet Projects", desc: "Device deployment tracking" },
  { key: "support", label: "Support Tickets", desc: "Customer service & device RMA" },
  { key: "team", label: "HR & Employees", desc: "Staff directory, leaves & timesheets" },
  { key: "reports", label: "Reports", desc: "Revenue & sales analytics" },
];

export const CreateStaffModal: React.FC<CreateStaffModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Sales & Inquiries");
  const [designation, setDesignation] = useState("Sales Representative");
  const [permissions, setPermissions] = useState<UserPermissions>({
    ...STAFF_SALES_PERMISSIONS,
  });

  if (!isOpen) return null;

  const handleApplyPreset = (type: "sales" | "billing" | "hr" | "all") => {
    if (type === "sales") {
      setPermissions({ ...STAFF_SALES_PERMISSIONS });
      setDepartment("Sales & Inquiries");
      setDesignation("Sales Representative");
    } else if (type === "billing") {
      setPermissions({ ...STAFF_BILLING_PERMISSIONS });
      setDepartment("Billing & Accounts");
      setDesignation("Billing Officer");
    } else if (type === "hr") {
      setPermissions({ ...STAFF_HR_PERMISSIONS });
      setDepartment("Human Resources");
      setDesignation("Human Resources Officer");
    } else if (type === "all") {
      const all: Record<string, boolean> = {};
      ALL_MODULES.forEach((m) => (all[m.key] = true));
      setPermissions(all as UserPermissions);
      setDesignation("Operations Specialist");
    }
  };

  const handleTogglePermission = (key: ModulePermissionKey) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name,
      email,
      phone,
      department,
      designation: designation || "Staff Member",
      role: "staff",
      status: "active",
      permissions,
    });

    setName("");
    setEmail("");
    setPhone("");
    setDesignation("Sales Representative");
    onClose();
  };

  const activeCount = Object.values(permissions).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card surface rounded-2xl w-full max-w-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary-text">
                Add New Staff Member
              </h2>
              <p className="text-xs text-secondary-text">
                Create user, assign dynamic designation, and configure allowed modules.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-primary-text mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tanvir Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="staff@upskillcrm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="017XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="Sales & Inquiries">Sales & Inquiries</option>
                <option value="Billing & Accounts">Billing & Accounts</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Fleet Operations">Fleet Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Dynamic Role / Designation *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Sales Executive, HR Officer"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-secondary-text">
                Quick Permission Template:
              </span>
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                {activeCount} of {ALL_MODULES.length} modules enabled
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
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
              <button
                type="button"
                onClick={() => handleApplyPreset("hr")}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 hover:opacity-90 cursor-pointer"
              >
                HR Preset
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("all")}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 hover:opacity-90 cursor-pointer"
              >
                Full Access
              </button>
            </div>
          </div>

          {/* Dynamic Module Checklist */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-primary-text">
              Custom Dynamic Module Permissions:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_MODULES.map((m) => {
                const isChecked = !!permissions[m.key];
                return (
                  <div
                    key={m.key}
                    onClick={() => handleTogglePermission(m.key)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                      isChecked
                        ? "bg-sky-50/60 dark:bg-sky-950/30 border-sky-400 dark:border-sky-700"
                        : "bg-light-background border-border hover:border-slate-300 dark:hover:border-slate-700 opacity-60"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-primary-text block leading-tight">
                        {m.label}
                      </span>
                      <span className="text-[10px] text-secondary-text">
                        {m.desc}
                      </span>
                    </div>
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md cursor-pointer"
            >
              Add Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
