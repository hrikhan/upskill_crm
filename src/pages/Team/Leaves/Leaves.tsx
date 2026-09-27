import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  CalendarDays,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/common/Avatar";

interface LeaveRequest {
  id: string;
  employeeName: string;
  designation: string;
  department: string;
  leaveType: "Annual Leave" | "Casual Leave" | "Sick Leave" | "Maternity / Paternity";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  appliedDate: string;
  status: "approved" | "pending" | "rejected";
}

const initialLeaves: LeaveRequest[] = [
  {
    id: "leave-1",
    employeeName: "Sarah Jenkins",
    designation: "Senior Sales Executive",
    department: "Sales & Inquiries",
    leaveType: "Annual Leave",
    startDate: "2026-07-01",
    endDate: "2026-07-05",
    days: 5,
    reason: "Family vacation and travel.",
    appliedDate: "2026-06-20",
    status: "approved",
  },
  {
    id: "leave-2",
    employeeName: "Rashid Ahmed",
    designation: "Billing Officer",
    department: "Billing & Accounts",
    leaveType: "Sick Leave",
    startDate: "2026-06-28",
    endDate: "2026-06-29",
    days: 2,
    reason: "Medical checkup and flu recovery.",
    appliedDate: "2026-06-25",
    status: "pending",
  },
  {
    id: "leave-3",
    employeeName: "Tariqul Islam",
    designation: "Operations Supervisor",
    department: "Operations & Fleet",
    leaveType: "Casual Leave",
    startDate: "2026-07-10",
    endDate: "2026-07-11",
    days: 2,
    reason: "Personal family event in hometown.",
    appliedDate: "2026-06-24",
    status: "pending",
  },
  {
    id: "leave-4",
    employeeName: "Farhana Yasmin",
    designation: "Human Resources Officer",
    department: "Human Resources",
    leaveType: "Annual Leave",
    startDate: "2026-06-15",
    endDate: "2026-06-16",
    days: 2,
    reason: "Personal commitments.",
    appliedDate: "2026-06-10",
    status: "approved",
  },
];

const Leaves: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Form states
  const [employeeName, setEmployeeName] = useState("Sarah Jenkins");
  const [leaveType, setLeaveType] =
    useState<LeaveRequest["leaveType"]>("Annual Leave");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-03");
  const [reason, setReason] = useState("");

  const filteredLeaves = useMemo(() => {
    return leaves.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.employeeName.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchType =
        typeFilter === "all" || item.leaveType === typeFilter;

      return matchQuery && matchStatus && matchType;
    });
  }, [leaves, searchQuery, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: leaves.length,
      approved: leaves.filter((l) => l.status === "approved").length,
      pending: leaves.filter((l) => l.status === "pending").length,
      onLeaveToday: 1,
    };
  }, [leaves]);

  const handleUpdateStatus = (id: string, status: "approved" | "rejected") => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    toast.success(`Leave request ${status}`);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 || 1;

    let designation = "Senior Sales Executive";
    let department = "Sales & Inquiries";
    if (employeeName === "Rashid Ahmed") {
      designation = "Billing Officer";
      department = "Billing & Accounts";
    } else if (employeeName === "Farhana Yasmin") {
      designation = "Human Resources Officer";
      department = "Human Resources";
    } else if (employeeName === "Tariqul Islam") {
      designation = "Operations Supervisor";
      department = "Operations & Fleet";
    }

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now().toString().slice(-4)}`,
      employeeName,
      designation,
      department,
      leaveType,
      startDate,
      endDate,
      days: daysCount,
      reason,
      appliedDate: "Today",
      status: "pending",
    };

    setLeaves([newLeave, ...leaves]);
    setReason("");
    setIsApplyModalOpen(false);
    toast.success("Leave application submitted");
  };

  return (
    <AnimatedContainer>
      <div className="space-y-6">
        {/* Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary-text">
              Leave Management
            </h1>
            <p className="text-xs text-secondary-text mt-0.5">
              Employee leave requests, approvals, and annual leave records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Apply Leave
          </button>
        </div>

        {/* HR Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Total Requests</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {stats.total}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Approved</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {stats.approved}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Pending Review</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {stats.pending}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card surface shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">On Leave Today</p>
              <h3 className="text-xl font-bold text-primary-text mt-0.5">
                {stats.onLeaveToday} Staff
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
              placeholder="Search employee or reason..."
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

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">All Leave Types</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Leaves Table */}
        <div className="bg-card surface border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-light-background/60 text-secondary-text font-semibold border-b border-border">
                <tr>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Leave Type</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5 text-center">Days</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeaves.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-light-background/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={item.employeeName} size="sm" />
                        <div>
                          <span className="block font-semibold text-primary-text">
                            {item.employeeName}
                          </span>
                          <span className="text-[10px] text-secondary-text">
                            {item.designation}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-light-background text-secondary-text border border-border">
                        {item.leaveType}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-secondary-text whitespace-nowrap">
                      {item.startDate} → {item.endDate}
                    </td>

                    <td className="px-5 py-3.5 text-center font-bold text-primary-text">
                      {item.days} d
                    </td>

                    <td className="px-5 py-3.5 text-secondary-text max-w-xs truncate">
                      {item.reason}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          item.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : item.status === "rejected"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {item.status === "pending" ? (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item.id, "approved")}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 cursor-pointer transition"
                            title="Approve leave"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item.id, "rejected")}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 cursor-pointer transition"
                            title="Reject leave"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-secondary-text capitalize">
                          {item.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredLeaves.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-secondary-text">
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Apply for Leave */}
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-card surface rounded-2xl w-full max-w-lg border border-border shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-primary-text">
                      Submit Leave Request
                    </h2>
                    <p className="text-xs text-secondary-text">
                      Record employee time-off application.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-primary-text mb-1">
                      Employee
                    </label>
                    <select
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Sarah Jenkins">Sarah Jenkins (Sales)</option>
                      <option value="Rashid Ahmed">Rashid Ahmed (Billing)</option>
                      <option value="Farhana Yasmin">Farhana Yasmin (HR)</option>
                      <option value="Tariqul Islam">Tariqul Islam (Ops)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary-text mb-1">
                      Leave Type
                    </label>
                    <select
                      value={leaveType}
                      onChange={(e) =>
                        setLeaveType(e.target.value as LeaveRequest["leaveType"])
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Maternity / Paternity">Maternity / Paternity</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-primary-text mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary-text mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary-text mb-1">
                    Reason / Notes *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide details about the leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-md cursor-pointer"
                  >
                    Submit Application
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

export default Leaves;
