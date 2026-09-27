import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Crown,
  Plus,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building,
  Key,
  Search,
  Filter,
  Users,
  Activity,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/common/Avatar";

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  status: "active" | "inactive";
  createdDate: string;
  lastLogin: string;
  department: string;
}

const initialAdmins: AdminRecord[] = [
  {
    id: "admin-1",
    name: "Hridoy Khan",
    email: "admin@upskillcrm.com",
    phone: "01711111111",
    title: "Operations Director & General Manager",
    department: "Executive Operations",
    status: "active",
    createdDate: "01-10-2026",
    lastLogin: "Today, 10:15 AM",
  },
  {
    id: "admin-2",
    name: "Tanvir Ahmed",
    email: "tanvir.ops@upskillcrm.com",
    phone: "01822222222",
    title: "Regional Sales & Fleet Director",
    department: "Fleet Deployments",
    status: "active",
    createdDate: "02-15-2026",
    lastLogin: "Yesterday, 04:30 PM",
  },
  {
    id: "admin-3",
    name: "Mahmud Hasan",
    email: "mahmud.tech@upskillcrm.com",
    phone: "01933333333",
    title: "Technical Infrastructure Admin",
    department: "GPS Telematics & Server",
    status: "inactive",
    createdDate: "03-01-2026",
    lastLogin: "3 days ago",
  },
];

const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<AdminRecord[]>(initialAdmins);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdminForView, setSelectedAdminForView] = useState<AdminRecord | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("Operations Director");
  const [department, setDepartment] = useState("Management");
  const [initialPassword, setInitialPassword] = useState("admin123");

  // Filtered Admins
  const filteredAdmins = useMemo(() => {
    return admins.filter((adm) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        adm.name.toLowerCase().includes(q) ||
        adm.email.toLowerCase().includes(q) ||
        adm.title.toLowerCase().includes(q) ||
        adm.phone.includes(q);

      const matchesStatus =
        statusFilter === "all" ? true : adm.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [admins, searchQuery, statusFilter]);

  const activeCount = admins.filter((a) => a.status === "active").length;

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide both name and work email");
      return;
    }

    const newAdmin: AdminRecord = {
      id: `admin-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone: phone || "01700000000",
      title,
      department,
      status: "active",
      createdDate: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      lastLogin: "Never",
    };

    setAdmins((prev) => [newAdmin, ...prev]);
    toast.success(`Admin account successfully created for "${name}"! Initial password: ${initialPassword}`);
    setName("");
    setEmail("");
    setPhone("");
    setTitle("Operations Director");
    setDepartment("Management");
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setAdmins((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newStatus = a.status === "active" ? "inactive" : "active";
          toast.info(`Admin ${a.name} is now ${newStatus}.`);
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
  };

  const handleDeleteAdmin = (id: string, adminName: string) => {
    if (confirm(`Are you sure you want to revoke Admin access for "${adminName}"?`)) {
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      toast.success(`Admin "${adminName}" access revoked.`);
    }
  };

  const handleResetPassword = (adminEmail: string) => {
    toast.success(`Temporary login password sent to ${adminEmail}`);
  };

  return (
    <AnimatedContainer>
      <div className="space-y-6">
        {/* Banner: Super Admin Exclusive Authority */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-950 dark:text-amber-100">
                  Super Admin Exclusive: Admin Provisioning
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  Root Level Only
                </span>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                Sole authority to provision, monitor, and revoke Operations Admins. Staff cannot access or see this section.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Provision New Admin
          </button>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-secondary-text mb-1">
              <span className="text-xs font-semibold">Total Admins</span>
              <Users className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-primary-text">{admins.length}</div>
            <span className="text-[11px] text-emerald-600 font-medium">All registered managers</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-secondary-text mb-1">
              <span className="text-xs font-semibold">Active Admins</span>
              <UserCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-primary-text">{activeCount}</div>
            <span className="text-[11px] text-secondary-text font-medium">Authorized for daily ops</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-secondary-text mb-1">
              <span className="text-xs font-semibold">Root Governance</span>
              <ShieldCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-base font-bold text-primary-text mt-1">Super Admin Isolated</div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Admins cannot delete Root</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-secondary-text mb-1">
              <span className="text-xs font-semibold">Security Protocol</span>
              <Activity className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-base font-bold text-primary-text mt-1">Role + Matrix RBAC</div>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Auto-synced to Redux</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admin by name, email, or title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-primary-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-secondary-text shrink-0" />
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-white dark:bg-slate-700 text-primary-text shadow-xs"
                    : "text-secondary-text hover:text-primary-text"
                }`}
              >
                All ({admins.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === "active"
                    ? "bg-white dark:bg-slate-700 text-emerald-600 font-bold shadow-xs"
                    : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("inactive")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === "inactive"
                    ? "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold shadow-xs"
                    : "text-secondary-text hover:text-primary-text"
                }`}
              >
                Inactive ({admins.length - activeCount})
              </button>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Admin Manager</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5">Last Login</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                      No admin records match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((adm) => (
                    <tr
                      key={adm.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={adm.name} size="md" />
                          <div>
                            <span className="block font-bold text-slate-900 dark:text-slate-100">
                              {adm.name}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                              {adm.title}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{adm.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{adm.phone}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                          {adm.department}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-slate-500">{adm.createdDate}</td>

                      <td className="px-5 py-3.5 text-slate-500">{adm.lastLogin}</td>

                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(adm.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                            adm.status === "active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 border border-slate-700/20"
                          }`}
                        >
                          {adm.status === "active" ? (
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

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedAdminForView(adm)}
                            title="View Admin Details"
                            className="p-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetPassword(adm.email)}
                            title="Send Password Reset"
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 transition-colors inline-flex items-center gap-1"
                          >
                            <Key className="w-3.5 h-3.5" />
                            Reset
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                            title="Revoke Admin Access"
                            className="p-1.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Admin Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Crown className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Provision New Operations Admin
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Creates an Admin account with full operations oversight and authority to manage Staff accounts & permissions.
              </p>

              <form onSubmit={handleCreateAdmin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Admin Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@upskillcrm.com"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01711111111"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Role / Position Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Operations Director"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Executive Operations"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>

                {/* Default Password Preview */}
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-amber-900 dark:text-amber-200 block">
                        Initial Access Password
                      </span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-400">
                        Admin will be prompted to reset upon first login.
                      </span>
                    </div>
                    <code className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 font-mono font-bold text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
                      {initialPassword}
                    </code>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-md shadow-amber-600/20 cursor-pointer"
                  >
                    Confirm & Provision Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Admin Details Modal */}
        {selectedAdminForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={selectedAdminForView.name} size="lg" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {selectedAdminForView.name}
                  </h3>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    {selectedAdminForView.title}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-800 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedAdminForView.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedAdminForView.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedAdminForView.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created Date:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedAdminForView.createdDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Login:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedAdminForView.lastLogin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className={`font-semibold capitalize ${selectedAdminForView.status === "active" ? "text-emerald-500" : "text-slate-400"}`}>
                    {selectedAdminForView.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedAdminForView(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default Admins;
