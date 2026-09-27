import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Clock,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Filter,
  X,
  User,
  Check,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/common/Avatar";

interface TimeSheetEntry {
  id: string;
  staffName: string;
  designation: string;
  date: string;
  project: string;
  taskDescription: string;
  hours: number;
  status: "approved" | "pending";
}

const initialEntries: TimeSheetEntry[] = [
  {
    id: "ts-1",
    staffName: "Farhana Yasmin",
    designation: "Human Resources Officer",
    date: "2026-06-25",
    project: "HR & Recruitment",
    taskDescription: "Employee orientation, leave balance audit, and compliance filings.",
    hours: 4.5,
    status: "approved",
  },
  {
    id: "ts-2",
    staffName: "Sarah Jenkins",
    designation: "Senior Sales Executive",
    date: "2026-06-25",
    project: "Prime Textiles Ltd",
    taskDescription: "On-site fleet GPS tracking software demo and proposal discussion.",
    hours: 3.5,
    status: "approved",
  },
  {
    id: "ts-3",
    staffName: "Rashid Ahmed",
    designation: "Billing Officer",
    date: "2026-06-24",
    project: "Subscription Billing",
    taskDescription: "Quarterly recurring tracking renewals and partial installment reconciliation.",
    hours: 4.0,
    status: "approved",
  },
  {
    id: "ts-4",
    staffName: "Tariqul Islam",
    designation: "Operations Supervisor",
    date: "2026-06-25",
    project: "Green Agro Foods",
    taskDescription: "Field inspection and GPS signal diagnostic report.",
    hours: 3.5,
    status: "pending",
  },
  {
    id: "ts-5",
    staffName: "Rashid Ahmed",
    designation: "Billing Officer",
    date: "2026-06-24",
    project: "Subscription Billing",
    taskDescription: "Quarterly recurring tracking renewals and partial installment reconciliation.",
    hours: 4.0,
    status: "approved",
  },
];

const TimeSheets: React.FC = () => {
  const [entries, setEntries] = useState<TimeSheetEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [staffName, setStaffName] = useState("Farhana Yasmin");
  const [designation, setDesignation] = useState("Human Resources Officer");
  const [date, setDate] = useState("2026-06-26");
  const [project, setProject] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [hours, setHours] = useState(2.0);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.staffName.toLowerCase().includes(q) ||
        item.project.toLowerCase().includes(q) ||
        item.taskDescription.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [entries, searchQuery, statusFilter]);

  const totalLoggedHours = useMemo(() => {
    return entries.reduce((acc, curr) => acc + curr.hours, 0);
  }, [entries]);

  const pendingApprovals = useMemo(() => {
    return entries.filter((e) => e.status === "pending").length;
  }, [entries]);

  const handleApprove = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "approved" } : e))
    );
    toast.success("Timesheet entry approved");
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.trim() || !taskDescription.trim()) return;

    const newEntry: TimeSheetEntry = {
      id: `ts-${Date.now().toString().slice(-4)}`,
      staffName,
      designation,
      date,
      project,
      taskDescription,
      hours: Number(hours) || 1,
      status: "pending",
    };

    setEntries([newEntry, ...entries]);
    setProject("");
    setTaskDescription("");
    setHours(2.0);
    setIsModalOpen(false);
    toast.success("Timesheet logged successfully");
  };

  return (
    <AnimatedContainer>
      <div className="space-y-6">
        {/* Simple & Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary-text">
              Time Sheets
            </h1>
            <p className="text-xs text-secondary-text mt-0.5">
              Employee working hours, daily timesheets, and activity logs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Log Hours
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Logged Hours</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {totalLoggedHours} hrs
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Approved Tasks</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {entries.filter((e) => e.status === "approved").length} Logs
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Active Staff</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                4 Members
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Pending Review</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {pendingApprovals} Logs
              </h3>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-card surface border border-border rounded-xl">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity or staff..."
              className="w-full sm:w-64 pl-8 pr-7 py-1.5 text-xs rounded-lg border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">All Logs</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Timesheets Table */}
        <div className="bg-card surface border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-light-background/60 text-secondary-text font-semibold border-b border-border">
                <tr>
                  <th className="px-5 py-3.5">Staff Member</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Client / Project</th>
                  <th className="px-5 py-3.5">Task Description</th>
                  <th className="px-5 py-3.5 text-center">Duration</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEntries.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-light-background/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={item.staffName} size="sm" />
                        <div>
                          <span className="block font-semibold text-primary-text">
                            {item.staffName}
                          </span>
                          <span className="text-[10px] text-secondary-text">
                            {item.designation}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-secondary-text font-medium whitespace-nowrap">
                      {item.date}
                    </td>

                    <td className="px-5 py-3.5 font-semibold text-primary-text">
                      {item.project}
                    </td>

                    <td className="px-5 py-3.5 text-secondary-text max-w-xs">
                      {item.taskDescription}
                    </td>

                    <td className="px-5 py-3.5 text-center font-bold text-primary-text">
                      {item.hours} hrs
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          item.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {item.status === "pending" ? (
                        <button
                          type="button"
                          onClick={() => handleApprove(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      ) : (
                        <span className="text-secondary-text text-[11px]">Approved</span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-secondary-text">
                      No timesheet entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Log Work Hours */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-card surface rounded-2xl w-full max-w-lg border border-border shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-primary-text">
                      Log Work Hours
                    </h2>
                    <p className="text-xs text-secondary-text">
                      Record installation or service task hours.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddLog} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-primary-text mb-1">
                      Staff Member
                    </label>
                    <select
                      value={staffName}
                      onChange={(e) => {
                        setStaffName(e.target.value);
                        if (e.target.value === "Farhana Yasmin") {
                          setDesignation("Human Resources Officer");
                        } else if (e.target.value === "Sarah Jenkins") {
                          setDesignation("Senior Sales Executive");
                        } else {
                          setDesignation("Operations Supervisor");
                        }
                      }}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Farhana Yasmin">Farhana Yasmin (HR)</option>
                      <option value="Sarah Jenkins">Sarah Jenkins (Sales)</option>
                      <option value="Tariqul Islam">Tariqul Islam (Ops)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary-text mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-primary-text mb-1">
                      Client / Project *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Logistics GPS Setup"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary-text mb-1">
                      Duration (hrs) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="12"
                      required
                      value={hours}
                      onChange={(e) => setHours(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary-text mb-1">
                    Task / Activity Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Details about GPS installation, device troubleshooting, or demo..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md cursor-pointer"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default TimeSheets;