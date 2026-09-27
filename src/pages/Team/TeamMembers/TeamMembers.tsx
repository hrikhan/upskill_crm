import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Pencil,
  Trash2,
  Users,
  LayoutGrid,
  List,
  CheckCircle2,
  X,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/common/Avatar";
import {
  StaffMember,
  EditStaffPermissionsModal,
} from "./_components/EditStaffPermissionsModal";
import { CreateStaffModal } from "./_components/CreateStaffModal";
import { EditStaffDetailsModal } from "./_components/EditStaffDetailsModal";
import { DeleteStaffConfirmModal } from "./_components/DeleteStaffConfirmModal";
import {
  STAFF_SALES_PERMISSIONS,
  STAFF_BILLING_PERMISSIONS,
  STAFF_HR_PERMISSIONS,
  UserPermissions,
} from "@/types/auth";

const initialStaffList: StaffMember[] = [
  {
    id: "staff-1",
    name: "Sarah Jenkins",
    email: "sarah.sales@upskillcrm.com",
    phone: "01722222222",
    department: "Sales & Inquiries",
    designation: "Senior Sales Executive",
    role: "staff",
    status: "active",
    permissions: STAFF_SALES_PERMISSIONS,
  },
  {
    id: "staff-2",
    name: "Rashid Ahmed",
    email: "rashid.accounts@upskillcrm.com",
    phone: "01733333333",
    department: "Billing & Accounts",
    designation: "Billing Officer",
    role: "staff",
    status: "active",
    permissions: STAFF_BILLING_PERMISSIONS,
  },
  {
    id: "staff-3",
    name: "Farhana Yasmin",
    email: "hr@upskillcrm.com",
    phone: "01744444444",
    department: "Human Resources",
    designation: "Human Resources Officer",
    role: "staff",
    status: "active",
    permissions: STAFF_HR_PERMISSIONS,
  },
  {
    id: "staff-4",
    name: "Tariqul Islam",
    email: "tariqul.ops@upskillcrm.com",
    phone: "01755555555",
    department: "Operations & Fleet",
    designation: "Operations Supervisor",
    role: "staff",
    status: "active",
    permissions: {
      ...STAFF_SALES_PERMISSIONS,
      tasks: true,
      projects: true,
    },
  },
];

const TeamMembers: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaffList);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStaffForPermissions, setSelectedStaffForPermissions] =
    useState<StaffMember | null>(null);
  const [selectedStaffForEdit, setSelectedStaffForEdit] =
    useState<StaffMember | null>(null);
  const [selectedStaffForDelete, setSelectedStaffForDelete] =
    useState<StaffMember | null>(null);

  // Departments for tabs
  const departments = ["All", "Sales", "Billing", "HR", "Operations"];

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q);

      const matchesDept =
        selectedDept === "All" ||
        s.department.toLowerCase().includes(selectedDept.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || s.status === selectedStatus.toLowerCase();

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staffList, searchQuery, selectedDept, selectedStatus]);

  // Handle Save Permissions
  const handleSavePermissions = (
    staffId: string,
    updatedPermissions: UserPermissions,
    updatedDesignation?: string,
    updatedDepartment?: string
  ) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              permissions: updatedPermissions,
              designation: updatedDesignation || s.designation,
              department: updatedDepartment || s.department,
            }
          : s
      )
    );
    toast.success("Permissions updated successfully");
  };

  // Handle Save Details
  const handleSaveDetails = (updatedStaff: StaffMember) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    );
    toast.success("Member profile updated successfully");
  };

  // Handle Toggle Active Status
  const handleToggleStatus = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const newStatus = s.status === "active" ? "inactive" : "active";
          toast.info(`${s.name} is now ${newStatus}`);
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  // Handle Create Staff
  const handleCreateStaff = (newStaffData: Omit<StaffMember, "id">) => {
    const newStaff: StaffMember = {
      ...newStaffData,
      id: `staff-${Date.now().toString().slice(-4)}`,
    };
    setStaffList((prev) => [newStaff, ...prev]);
    toast.success(`Added ${newStaff.name} to the team`);
  };

  // Handle Delete Staff
  const handleDeleteStaff = (staffId: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    toast.success("Team member removed");
  };

  return (
    <AnimatedContainer>
      <div className="space-y-6">
        {/* Simple & Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary-text">
              Team Members
            </h1>
            <p className="text-xs text-secondary-text mt-0.5">
              Manage employees, custom designations, and access permissions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* Clean Metrics Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Total Team</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {staffList.length}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Sales Team</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {staffList.filter((s) => s.department.includes("Sales")).length}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Billing & Accounts</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {staffList.filter((s) => s.department.includes("Billing")).length}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">HR & Operations</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {staffList.filter((s) => s.department.includes("HR") || s.department.includes("Human") || s.department.includes("Operations")).length}
              </h3>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-card surface border border-border rounded-xl">
          {/* Department Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedDept === dept
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-secondary-text hover:text-primary-text hover:bg-light-background"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search, Status & View Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member..."
                className="w-40 sm:w-52 pl-8 pr-7 py-1.5 text-xs rounded-lg border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-light-background">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md cursor-pointer transition ${
                  viewMode === "table"
                    ? "bg-card text-blue-600 shadow-xs"
                    : "text-secondary-text hover:text-primary-text"
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md cursor-pointer transition ${
                  viewMode === "grid"
                    ? "bg-card text-blue-600 shadow-xs"
                    : "text-secondary-text hover:text-primary-text"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Clean Table View */}
        {viewMode === "table" ? (
          <div className="bg-card surface border border-border rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-light-background/60 text-secondary-text font-semibold border-b border-border">
                  <tr>
                    <th className="px-5 py-3.5">Member</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Contact</th>
                    <th className="px-5 py-3.5">Permissions</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStaff.map((staff) => {
                    const authorizedCount = Object.values(
                      staff.permissions
                    ).filter(Boolean).length;

                    return (
                      <tr
                        key={staff.id}
                        className="hover:bg-light-background/40 transition-colors"
                      >
                        {/* Member Details */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={staff.name} size="md" />
                            <div>
                              <span className="block font-bold text-primary-text">
                                {staff.name}
                              </span>
                              <span className="text-[11px] font-medium text-secondary-text">
                                {staff.designation}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-5 py-3.5">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium bg-light-background text-secondary-text border border-border">
                            {staff.department}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-3.5 text-secondary-text space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-secondary-text shrink-0" />
                            <span className="text-primary-text">{staff.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-secondary-text shrink-0" />
                            <span>{staff.phone}</span>
                          </div>
                        </td>

                        {/* Permissions Summary Badges */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center flex-wrap gap-1 max-w-xs">
                            {staff.permissions.leads && (
                              <span className="px-2 py-0.5 text-[10px] rounded bg-rose-50 text-rose-600 dark:bg-rose-950/40 font-medium">
                                Leads
                              </span>
                            )}
                            {staff.permissions.customers && (
                              <span className="px-2 py-0.5 text-[10px] rounded bg-teal-50 text-teal-600 dark:bg-teal-950/40 font-medium">
                                Clients
                              </span>
                            )}
                            {staff.permissions.sales && (
                              <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 font-medium">
                                Invoices
                              </span>
                            )}
                            {staff.permissions.proposals && (
                              <span className="px-2 py-0.5 text-[10px] rounded bg-lime-50 text-lime-700 dark:bg-lime-950/40 font-medium">
                                Proposals
                              </span>
                            )}
                            {staff.permissions.tasks && (
                              <span className="px-2 py-0.5 text-[10px] rounded bg-purple-50 text-purple-600 dark:bg-purple-950/40 font-medium">
                                Tasks
                              </span>
                            )}
                            {staff.permissions.reports && (
                              <span className="px-2 py-0.5 text-[10px] rounded bg-sky-50 text-sky-600 dark:bg-sky-950/40 font-medium">
                                Reports
                              </span>
                            )}
                            <span className="text-[10px] text-secondary-text font-medium ml-0.5">
                              ({authorizedCount} modules)
                            </span>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="px-5 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(staff.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                              staff.status === "active"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                            }`}
                          >
                            {staff.status === "active" ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                                Active
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5 text-slate-400" />
                                Inactive
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => setSelectedStaffForPermissions(staff)}
                              className="px-2.5 py-1.5 rounded-lg border border-border bg-light-background hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:border-blue-300 transition text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                              title="Edit module permissions"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Permissions
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedStaffForEdit(staff)}
                              className="p-1.5 rounded-lg border border-border text-secondary-text hover:text-primary-text hover:bg-light-background transition cursor-pointer"
                              title="Edit profile"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedStaffForDelete(staff)}
                              className="p-1.5 rounded-lg border border-border text-secondary-text hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                              title="Remove member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredStaff.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-secondary-text">
                        No team members found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* View Mode 2: Clean Cards / Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((staff) => {
              const authorizedCount = Object.values(staff.permissions).filter(
                Boolean
              ).length;

              return (
                <div
                  key={staff.id}
                  className="bg-card surface border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-800 transition"
                >
                  <div>
                    {/* Card Top: Avatar, Name & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={staff.name} size="lg" />
                        <div>
                          <h4 className="text-sm font-bold text-primary-text">
                            {staff.name}
                          </h4>
                          <p className="text-xs text-secondary-text">
                            {staff.designation}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(staff.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                          staff.status === "active"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                        }`}
                      >
                        {staff.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </div>

                    {/* Department Tag */}
                    <div className="mt-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium bg-light-background text-secondary-text border border-border">
                        {staff.department}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 space-y-1.5 text-xs text-secondary-text border-t border-border pt-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-primary-text truncate">{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{staff.phone}</span>
                      </div>
                    </div>

                    {/* Authorized Modules */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between text-[11px] text-secondary-text mb-2">
                        <span className="font-medium">Permissions:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {authorizedCount} Modules
                        </span>
                      </div>
                      <div className="flex items-center flex-wrap gap-1">
                        {staff.permissions.leads && (
                          <span className="px-2 py-0.5 text-[10px] rounded bg-rose-50 text-rose-600 dark:bg-rose-950/40 font-medium">
                            Leads
                          </span>
                        )}
                        {staff.permissions.customers && (
                          <span className="px-2 py-0.5 text-[10px] rounded bg-teal-50 text-teal-600 dark:bg-teal-950/40 font-medium">
                            Clients
                          </span>
                        )}
                        {staff.permissions.sales && (
                          <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 font-medium">
                            Invoices
                          </span>
                        )}
                        {staff.permissions.proposals && (
                          <span className="px-2 py-0.5 text-[10px] rounded bg-lime-50 text-lime-700 dark:bg-lime-950/40 font-medium">
                            Proposals
                          </span>
                        )}
                        {staff.permissions.tasks && (
                          <span className="px-2 py-0.5 text-[10px] rounded bg-purple-50 text-purple-600 dark:bg-purple-950/40 font-medium">
                            Tasks
                          </span>
                        )}
                        {staff.permissions.reports && (
                          <span className="px-2 py-0.5 text-[10px] rounded bg-sky-50 text-sky-600 dark:bg-sky-950/40 font-medium">
                            Reports
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStaffForPermissions(staff)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-light-background hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:border-blue-300 transition text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Permissions
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedStaffForEdit(staff)}
                        className="p-1.5 rounded-lg border border-border text-secondary-text hover:text-primary-text hover:bg-light-background transition cursor-pointer"
                        title="Edit profile"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedStaffForDelete(staff)}
                        className="p-1.5 rounded-lg border border-border text-secondary-text hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredStaff.length === 0 && (
              <div className="col-span-full py-12 text-center text-secondary-text">
                No team members found matching your search.
              </div>
            )}
          </div>
        )}

        {/* Modal 1: Edit Permissions & Custom Designation */}
        <EditStaffPermissionsModal
          staff={selectedStaffForPermissions}
          isOpen={!!selectedStaffForPermissions}
          onClose={() => setSelectedStaffForPermissions(null)}
          onSave={handleSavePermissions}
        />

        {/* Modal 2: Edit Member Profile */}
        <EditStaffDetailsModal
          staff={selectedStaffForEdit}
          isOpen={!!selectedStaffForEdit}
          onClose={() => setSelectedStaffForEdit(null)}
          onSave={handleSaveDetails}
        />

        {/* Modal 3: Delete Member Confirmation */}
        <DeleteStaffConfirmModal
          staff={selectedStaffForDelete}
          isOpen={!!selectedStaffForDelete}
          onClose={() => setSelectedStaffForDelete(null)}
          onConfirm={handleDeleteStaff}
        />

        {/* Modal 4: Add New Member */}
        <CreateStaffModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateStaff}
        />
      </div>
    </AnimatedContainer>
  );
};

export default TeamMembers;