import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import { CrmKpiCards } from "./_components/CrmKpiCards";
import { IncomeExpenseChart } from "./_components/IncomeExpenseChart";
import { LeadsDonutChart } from "./_components/LeadsDonutChart";
import { DashboardFilters } from "./_components/DashboardFilters";
import { RecentActivitySection, InvoiceItem, LeadItem } from "./_components/RecentActivitySection";
import { KpiCalculationModal } from "./_components/KpiCalculationModal";
import { getKpiCalculationDetails } from "./kpiCalculationData";
import {
  SlidersHorizontal,
  RotateCcw,
  Filter,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";

// Master Invoices Dataset
const initialInvoices: InvoiceItem[] = [
  {
    id: "inv-1",
    invoiceNo: "#INV-2026-081",
    client: "Acme Logistics Ltd",
    company: "Acme Corp",
    amount: 1000,
    dueDate: "2026-06-15",
    status: "overdue",
    salesRep: "Hridoy (Admin)",
    source: "Website Inbound",
  },
  {
    id: "inv-2",
    invoiceNo: "#INV-2026-082",
    client: "Apex Digital Media",
    company: "Apex Global",
    amount: 2000,
    dueDate: "2026-06-28",
    status: "paid",
    salesRep: "Hridoy (Admin)",
    source: "Direct Referral",
  },
  {
    id: "inv-3",
    invoiceNo: "#INV-2026-083",
    client: "Zenith Retail Solutions",
    company: "Zenith Group",
    amount: 1500,
    dueDate: "2026-07-05",
    status: "unpaid",
    salesRep: "Sarah Jenkins",
    source: "LinkedIn Campaign",
  },
  {
    id: "inv-4",
    invoiceNo: "#INV-2026-084",
    client: "Nova Healthcare",
    company: "Nova Care Inc",
    amount: 3200,
    dueDate: "2026-06-20",
    status: "paid",
    salesRep: "Michael Chang",
    source: "Website Inbound",
  },
  {
    id: "inv-5",
    invoiceNo: "#INV-2026-085",
    client: "CloudPulse Tech",
    company: "CloudPulse Networks",
    amount: 850,
    dueDate: "2026-07-10",
    status: "unpaid",
    salesRep: "David Miller",
    source: "Cold Outreach",
  },
];

// Master Leads Dataset
const initialLeads: LeadItem[] = [
  {
    id: "lead-1",
    name: "Tariqul Islam",
    company: "Dhaka Freight Forwarding",
    value: 45000,
    stage: "Demonstrations Done",
    salesRep: "Hridoy (Admin)",
    source: "Website Inbound",
    date: "Today, 11:20 AM",
  },
  {
    id: "lead-2",
    name: "Elena Rostova",
    company: "Nordic Soft Labs",
    value: 12000,
    stage: "Appointment Collected",
    salesRep: "Hridoy (Admin)",
    source: "Direct Referral",
    date: "Today, 09:45 AM",
  },
  {
    id: "lead-3",
    name: "Tanvir Ahmed",
    company: "Prime Textiles Ltd",
    value: 85000,
    stage: "Proposal Sent",
    salesRep: "Sarah Jenkins",
    source: "LinkedIn Campaign",
    date: "Yesterday",
  },
  {
    id: "lead-4",
    name: "Marcus Vance",
    company: "Apex Cloud Services",
    value: 30000,
    stage: "Closed Won",
    salesRep: "Michael Chang",
    source: "Website Inbound",
    date: "Jun 24, 2026",
  },
  {
    id: "lead-5",
    name: "Sabrina Chowdhury",
    company: "Green Agro Foods",
    value: 15000,
    stage: "New Leads",
    salesRep: "David Miller",
    source: "Cold Outreach",
    date: "Jun 23, 2026",
  },
  {
    id: "lead-6",
    name: "Kazi Nabil",
    company: "Bengal FinTech",
    value: 62000,
    stage: "Demonstrations Done",
    salesRep: "Hridoy (Admin)",
    source: "Website Inbound",
    date: "Jun 22, 2026",
  },
];

export default function OverviewPage() {
  const { hasPermission, isAdmin, isSuperAdmin, user } = usePermissions();

  const isExecutive = isSuperAdmin || isAdmin;
  const userCleanName = useMemo(() => {
    if (!user?.name) return "";
    return user.name.split(" (")[0].trim();
  }, [user?.name]);

  const staffScope = useMemo(() => {
    return {
      isStaff: !isExecutive,
      staffName: userCleanName || "Staff Member",
    };
  }, [isExecutive, userCleanName]);

  const canViewSales = isSuperAdmin || isAdmin || hasPermission("sales");
  const canViewLeads = isSuperAdmin || isAdmin || hasPermission("leads");
  const canViewHR = isSuperAdmin || isAdmin || hasPermission("team");

  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedAgent, setSelectedAgent] = useState("All Sales Reps");
  const [selectedSource, setSelectedSource] = useState("All Sources");

  // KPI Calculation Modal State
  const [selectedKpiCardId, setSelectedKpiCardId] = useState<string | null>(null);

  const hasActiveFilters =
    selectedStage !== "All Stages" ||
    (isExecutive && selectedAgent !== "All Sales Reps") ||
    selectedSource !== "All Sources";

  const handleResetFilters = () => {
    setSelectedStage("All Stages");
    setSelectedAgent("All Sales Reps");
    setSelectedSource("All Sources");
  };

  // Filtered Invoices (Admin/Executive has total calculation; Staff has only their specific revenue/invoices)
  const filteredInvoices = useMemo(() => {
    return initialInvoices.filter((inv) => {
      // Row-Level Security for Staff
      if (!isExecutive) {
        const isOwner =
          inv.salesRep.toLowerCase().includes(userCleanName.toLowerCase()) ||
          userCleanName.toLowerCase().includes(inv.salesRep.toLowerCase());
        const matchSource =
          selectedSource === "All Sources" || inv.source === selectedSource;
        return isOwner && matchSource;
      }

      // Executive / Admin organization total
      const matchAgent =
        selectedAgent === "All Sales Reps" || inv.salesRep === selectedAgent;
      const matchSource =
        selectedSource === "All Sources" || inv.source === selectedSource;
      return matchAgent && matchSource;
    });
  }, [isExecutive, selectedAgent, selectedSource, userCleanName]);

  // Filtered Leads (Admin/Executive has total calculation; Staff has only their assigned leads)
  const filteredLeads = useMemo(() => {
    return initialLeads.filter((lead) => {
      // Row-Level Security for Staff
      if (!isExecutive) {
        const isOwner =
          lead.salesRep.toLowerCase().includes(userCleanName.toLowerCase()) ||
          userCleanName.toLowerCase().includes(lead.salesRep.toLowerCase());
        const matchStage =
          selectedStage === "All Stages" || lead.stage === selectedStage;
        const matchSource =
          selectedSource === "All Sources" || lead.source === selectedSource;
        return isOwner && matchStage && matchSource;
      }

      // Executive / Admin organization total
      const matchStage =
        selectedStage === "All Stages" || lead.stage === selectedStage;
      const matchAgent =
        selectedAgent === "All Sales Reps" || lead.salesRep === selectedAgent;
      const matchSource =
        selectedSource === "All Sources" || lead.source === selectedSource;
      return matchStage && matchAgent && matchSource;
    });
  }, [isExecutive, selectedStage, selectedAgent, selectedSource, userCleanName]);

  // Computed KPI Metrics from active filter
  const kpiMetrics = useMemo(() => {
    const paidSum = filteredInvoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);
    const dueSum = filteredInvoices
      .filter((i) => i.status === "unpaid")
      .reduce((sum, i) => sum + i.amount, 0);
    const overdueSum = filteredInvoices
      .filter((i) => i.status === "overdue")
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      paymentsToday: "Tk,0.00",
      paymentsMonth: `Tk,${paidSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      invoicesDue: `Tk,${dueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      invoicesOverdue: `Tk,${overdueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      totalIncome: paidSum,
      totalExpenses: 0,
    };
  }, [filteredInvoices]);

  // Computed Leads Funnel Stages from active filter
  const leadsStages = useMemo(() => {
    const stageCounts: Record<string, number> = {
      "New": filteredLeads.filter((l) => l.stage === "New Leads").length,
      "Appointment collected": filteredLeads.filter((l) => l.stage === "Appointment Collected").length,
      "Demonstrations Done": filteredLeads.filter((l) => l.stage === "Demonstrations Done").length,
      "Need Followup": 6,
      "Proposal Sent": filteredLeads.filter((l) => l.stage === "Proposal Sent").length,
      "Implemented": filteredLeads.filter((l) => l.stage === "Closed Won").length,
    };

    return [
      { id: "new", name: "New", count: stageCounts["New"] || 0, badgeClass: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200" },
      { id: "appointment", name: "Appointment collected", count: stageCounts["Appointment collected"] || 0, badgeClass: "bg-[#f97316] text-white" },
      { id: "demo", name: "Demonstrations Done", count: stageCounts["Demonstrations Done"] || 0, badgeClass: "bg-[#06b6d4] text-white" },
      { id: "followup", name: "Need Followup", count: 6, badgeClass: "bg-[#64748b] text-white" },
      { id: "proposal", name: "Proposal Sent", count: stageCounts["Proposal Sent"] || 0, badgeClass: "bg-[#84cc16] text-slate-950 font-bold" },
      { id: "implemented", name: "Implemented", count: stageCounts["Implemented"] || 0, badgeClass: "bg-[#10b981] text-white" },
    ];
  }, [filteredLeads]);

  // Custom KPI cards for Sales staff
  const salesKpiCards = useMemo(
    () => [
      {
        id: "total-leads",
        value: `${filteredLeads.length} Leads`,
        label: "Total Leads",
        icon: <Users className="w-5 h-5 stroke-[1.5]" />,
      },
      {
        id: "active-demos",
        value: `${filteredLeads.filter((l) => l.stage === "Appointment Collected" || l.stage === "Demonstrations Done").length} Active`,
        label: "Demos & Meetings",
        icon: <Calendar className="w-5 h-5 stroke-[1.5]" />,
      },
      {
        id: "proposals-sent",
        value: `${filteredLeads.filter((l) => l.stage === "Proposal Sent").length} Sent`,
        label: "Proposals Sent",
        icon: <FileText className="w-5 h-5 stroke-[1.5]" />,
      },
      {
        id: "deals-won",
        value: `${filteredLeads.filter((l) => l.stage === "Closed Won").length} Won`,
        label: "Closed Won Deals",
        icon: <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />,
      },
    ],
    [filteredLeads]
  );

  // Custom KPI cards for HR staff
  const hrKpiCards = useMemo(
    () => [
      {
        id: "total-staff",
        value: "12 Members",
        label: "Total Staff Team",
        icon: <Users className="w-5 h-5 stroke-[1.5]" />,
      },
      {
        id: "on-leave",
        value: "1 Member",
        label: "On Leave Today",
        icon: <Calendar className="w-5 h-5 stroke-[1.5]" />,
      },
      {
        id: "clocked-in",
        value: "91.6%",
        label: "Today's Attendance",
        icon: <Clock className="w-5 h-5 stroke-[1.5]" />,
      },
      {
        id: "pending-leaves",
        value: "2 Requests",
        label: "Pending Approvals",
        icon: <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />,
      },
    ],
    []
  );

  // Active KPI Calculation and Schedule Data for Modal
  const activeKpiCalculationData = useMemo(() => {
    if (!selectedKpiCardId) return null;
    return getKpiCalculationDetails(
      selectedKpiCardId,
      filteredInvoices,
      filteredLeads,
      staffScope
    );
  }, [selectedKpiCardId, filteredInvoices, filteredLeads, staffScope]);

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-primary-text">
              Dashboard
            </h1>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                !isExecutive
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                  : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300 dark:border-sky-800"
              }`}
            >
              {!isExecutive
                ? `Personal View (${userCleanName})`
                : "Executive Enterprise View"}
            </span>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            {!isExecutive
              ? `Displaying your individual revenue, assigned leads, and performance results.`
              : `Consolidated organization-wide performance across all 12 staff accounts.`}
          </p>
        </div>

        {(canViewSales || canViewLeads) && (
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 rounded-lg transition cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer shadow-xs ${
                showFilters || hasActiveFilters
                  ? "bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-700 dark:text-sky-300"
                  : "bg-card border-border text-secondary-text hover:text-primary-text"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showFilters ? "Hide Filters" : "Filter Period & Sales"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Staff Personal Scope Notice Banner */}
      {!isExecutive && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Personal Performance Scope:</span>{" "}
              <span>
                Displaying only your specific revenue, leads, and pipeline results (<strong>{userCleanName}</strong>). Enterprise-wide organization totals are restricted to Admins &amp; Sales Executives.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-amber-200/70 dark:bg-amber-900 text-amber-900 dark:text-amber-200 shrink-0">
            Personal Result
          </span>
        </div>
      )}

      {/* Active Filter Notification Banner */}
      {hasActiveFilters && (canViewSales || canViewLeads) && (
        <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sky-800 dark:text-sky-300 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Active Filter:
            </span>
            {selectedAgent !== "All Sales Reps" && (
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-sky-300 text-sky-800 dark:text-sky-200 font-medium">
                Rep: {selectedAgent}
              </span>
            )}
            {canViewLeads && selectedStage !== "All Stages" && (
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-sky-300 text-sky-800 dark:text-sky-200 font-medium">
                Stage: {selectedStage}
              </span>
            )}
            {selectedSource !== "All Sources" && (
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-sky-300 text-sky-800 dark:text-sky-200 font-medium">
                Source: {selectedSource}
              </span>
            )}
            <span className="text-secondary-text">
              ({canViewSales ? `${filteredInvoices.length} invoices` : ""}
              {canViewSales && canViewLeads ? ", " : ""}
              {canViewLeads ? `${filteredLeads.length} leads` : ""})
            </span>
          </div>

          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Collapsible Filter Toolbar */}
      {showFilters && (canViewSales || canViewLeads) && (
        <AnimatedContainer delay={0.05}>
          <div className="p-4 bg-card surface rounded-xl border border-border shadow-xs">
            <DashboardFilters
              stage={selectedStage}
              onStageChange={setSelectedStage}
              agent={selectedAgent}
              onAgentChange={setSelectedAgent}
              source={selectedSource}
              onSourceChange={setSelectedSource}
              showStage={canViewLeads}
              staffScope={staffScope}
            />
          </div>
        </AnimatedContainer>
      )}

      {/* Row 1: Top 4 KPI Cards (Permission based & reacts to filter) */}
      <AnimatedContainer delay={0.1}>
        <CrmKpiCards
          paymentsToday={kpiMetrics.paymentsToday}
          paymentsMonth={kpiMetrics.paymentsMonth}
          invoicesDue={kpiMetrics.invoicesDue}
          invoicesOverdue={kpiMetrics.invoicesOverdue}
          onCardClick={setSelectedKpiCardId}
          customCards={
            !canViewSales && canViewLeads
              ? salesKpiCards
              : !canViewSales && !canViewLeads && canViewHR
              ? hrKpiCards
              : undefined
          }
        />
      </AnimatedContainer>

      {/* Row 2: Analytics Panels responding to RBAC */}
      {(canViewSales || canViewLeads || canViewHR) && (
        <AnimatedContainer delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Income vs Expenses (Visible if canViewSales) */}
            {canViewSales && (
              <div className={`${canViewLeads ? "lg:col-span-8" : "lg:col-span-12"} flex flex-col`}>
                <IncomeExpenseChart
                  totalIncome={kpiMetrics.totalIncome}
                  totalExpenses={kpiMetrics.totalExpenses}
                  periodLabel={selectedAgent === "All Sales Reps" ? "2026" : selectedAgent.split(" ")[0]}
                />
              </div>
            )}

            {/* Leads Donut Funnel (Visible if canViewLeads) */}
            {canViewLeads && (
              <div className={`${canViewSales ? "lg:col-span-4" : "lg:col-span-12"} flex flex-col`}>
                <LeadsDonutChart
                  totalCount={filteredLeads.length}
                  stages={leadsStages}
                />
              </div>
            )}

            {/* HR Overview card if HR only */}
            {!canViewSales && !canViewLeads && canViewHR && (
              <div className="lg:col-span-12 bg-card surface rounded-2xl p-6 border border-border shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-light-background border border-border flex items-center justify-center text-primary-text">
                      <Users className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-text">Human Resources Operations</h3>
                      <p className="text-xs text-secondary-text">Staff directory, leave approvals, and daily timesheets</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/team/members"
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 hover:underline"
                  >
                    View Staff Directory
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-light-background/60 border border-border/60">
                    <span className="text-xs text-secondary-text block mb-1">Active Leave Requests</span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">2 Pending</span>
                    <p className="text-xs text-secondary-text mt-2">Requires review and management approval.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-light-background/60 border border-border/60">
                    <span className="text-xs text-secondary-text block mb-1">Today's Attendance Status</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">91.6% Present</span>
                    <p className="text-xs text-secondary-text mt-2">11 out of 12 employees checked in.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-light-background/60 border border-border/60">
                    <span className="text-xs text-secondary-text block mb-1">Upcoming Holidays</span>
                    <span className="text-2xl font-bold text-primary-text">1 Day</span>
                    <p className="text-xs text-secondary-text mt-2">Next public holiday in 12 days.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AnimatedContainer>
      )}

      {/* Row 3: Recent Activity Section (Respects permissions) */}
      {(canViewSales || canViewLeads) && (
        <AnimatedContainer delay={0.2}>
          <RecentActivitySection
            invoices={filteredInvoices}
            leads={filteredLeads}
            showInvoices={canViewSales}
            showLeads={canViewLeads}
          />
        </AnimatedContainer>
      )}

      {/* KPI Calculation Formula & Schedule Details Modal */}
      <KpiCalculationModal
        isOpen={Boolean(selectedKpiCardId)}
        onClose={() => setSelectedKpiCardId(null)}
        data={activeKpiCalculationData}
      />
    </div>
  );
}
