import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  Radio,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  FileText,
  X,
  Calendar,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { COMPANY_CONFIG } from "@/config/companyConfig";

export interface GpsSubscription {
  id: string;
  subscriptionCode: string;
  companyName: string;
  contactPerson: string;
  planName: string;
  ratePerUnit: number;
  activeUnits: number;
  totalMonthlyFee: number;
  billingDay: number; // 1-28
  status: "active" | "past_due" | "expiring_soon" | "suspended";
  nextRenewalDate: string;
  simOperator: string;
  autoRenew: boolean;
}

const initialSubscriptionsData: GpsSubscription[] = [
  {
    id: "sub-1",
    subscriptionCode: "SUB-GPS-101",
    companyName: "Acme Logistics Ltd",
    contactPerson: "Tariqul Islam",
    planName: "Fleet Live Tracking Enterprise",
    ratePerUnit: 350,
    activeUnits: 12,
    totalMonthlyFee: 4200,
    billingDay: 1,
    status: "active",
    nextRenewalDate: "2026-07-01",
    simOperator: "Grameenphone IoT",
    autoRenew: true,
  },
  {
    id: "sub-2",
    subscriptionCode: "SUB-GPS-102",
    companyName: "Apex Digital Media",
    contactPerson: "Elena Rostova",
    planName: "Standard Vehicle Security & Anti-Theft",
    ratePerUnit: 350,
    activeUnits: 4,
    totalMonthlyFee: 1400,
    billingDay: 10,
    status: "active",
    nextRenewalDate: "2026-07-10",
    simOperator: "Robi Telematics",
    autoRenew: true,
  },
  {
    id: "sub-3",
    subscriptionCode: "SUB-GPS-103",
    companyName: "Nova Healthcare Inc",
    contactPerson: "Marcus Vance",
    planName: "Ambulance Priority Emergency Tracking",
    ratePerUnit: 500,
    activeUnits: 8,
    totalMonthlyFee: 4000,
    billingDay: 5,
    status: "expiring_soon",
    nextRenewalDate: "2026-07-05",
    simOperator: "Banglalink Dedicated",
    autoRenew: false,
  },
  {
    id: "sub-4",
    subscriptionCode: "SUB-GPS-104",
    companyName: "Dhaka Freight Forwarding",
    contactPerson: "Tariqul Islam",
    planName: "Heavy Trucking & Fuel Level Telematics",
    ratePerUnit: 600,
    activeUnits: 15,
    totalMonthlyFee: 9000,
    billingDay: 15,
    status: "past_due",
    nextRenewalDate: "2026-06-15",
    simOperator: "Grameenphone IoT",
    autoRenew: false,
  },
  {
    id: "sub-5",
    subscriptionCode: "SUB-GPS-105",
    companyName: "Zenith Retail Solutions",
    contactPerson: "Tanvir Ahmed",
    planName: "Delivery Van Tracking Standard",
    ratePerUnit: 350,
    activeUnits: 6,
    totalMonthlyFee: 2100,
    billingDay: 20,
    status: "active",
    nextRenewalDate: "2026-07-20",
    simOperator: "Robi Telematics",
    autoRenew: true,
  },
];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<GpsSubscription[]>(initialSubscriptionsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formCompany, setFormCompany] = useState("Green Agro Foods Ltd");
  const [formContact, setFormContact] = useState("Sabrina Chowdhury");
  const [formPlan, setFormPlan] = useState("Standard Vehicle Security & Anti-Theft");
  const [formRate, setFormRate] = useState<number>(350);
  const [formUnits, setFormUnits] = useState<number>(5);
  const [formBillingDay, setFormBillingDay] = useState<number>(1);
  const [formOperator, setFormOperator] = useState("Grameenphone IoT");

  // Statistics
  const stats = useMemo(() => {
    const totalMRR = subscriptions
      .filter((s) => s.status !== "suspended")
      .reduce((sum, s) => sum + s.totalMonthlyFee, 0);
    const totalUnits = subscriptions.reduce((sum, s) => sum + s.activeUnits, 0);
    const activeCount = subscriptions.filter((s) => s.status === "active").length;
    const dueCount = subscriptions.filter((s) => s.status === "past_due").length;

    return { totalMRR, totalUnits, activeCount, dueCount, totalCount: subscriptions.length };
  }, [subscriptions]);

  // Filtered
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchSearch =
        sub.subscriptionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.planName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || sub.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [subscriptions, searchQuery, statusFilter]);

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: GpsSubscription = {
      id: `sub-${Date.now()}`,
      subscriptionCode: `SUB-GPS-${subscriptions.length + 101}`,
      companyName: formCompany,
      contactPerson: formContact,
      planName: formPlan,
      ratePerUnit: formRate,
      activeUnits: formUnits,
      totalMonthlyFee: formRate * formUnits,
      billingDay: formBillingDay,
      status: "active",
      nextRenewalDate: `2026-07-0${formBillingDay}`,
      simOperator: formOperator,
      autoRenew: true,
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    toast.success(`Subscription ${newSub.subscriptionCode} activated for ${newSub.companyName}`);
    setIsAddOpen(false);
  };

  const handleGenerateInvoice = (sub: GpsSubscription) => {
    toast.success(
      `Monthly recurring invoice generated for ${sub.companyName} (Tk,${sub.totalMonthlyFee.toLocaleString()})`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary-text">
            Monthly Subscriptions
          </h1>
          <p className="text-xs text-secondary-text mt-0.5">
            Recurring GPS cloud monitoring fees, SIM data plans, and fleet renewal tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Subscription Plan
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card surface rounded-2xl p-5 border border-sky-200 dark:border-sky-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Monthly Revenue (MRR)
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.totalMRR.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-border/40">
                <RotateCw className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Predictable recurring tracking subscriptions
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-emerald-200 dark:border-emerald-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Active GPS Units
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  {stats.totalUnits} Trackers
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-border/40">
                <Radio className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Live tracking SIM connections online
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-indigo-200 dark:border-indigo-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Active Subscriber Fleets
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  {stats.activeCount} Companies
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-border/40">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Active accounts in good standing
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-rose-200 dark:border-rose-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Past Due Renewals
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  {stats.dueCount} Accounts
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-border/40">
                <AlertTriangle className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Requires dunning & payment follow-up
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Filter Toolbar */}
      <AnimatedContainer delay={0.1}>
        <div className="bg-card surface rounded-2xl p-4 border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Subscriptions" },
              { id: "active", label: "Active" },
              { id: "expiring_soon", label: "Expiring Soon" },
              { id: "past_due", label: "Past Due" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-light-background/60 hover:bg-light-background text-secondary-text hover:text-primary-text border border-border/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
            <div className="relative grow max-w-md">
              <Search className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search plan, subscriber company, or SIM network..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-light-background/60 border border-border text-xs text-primary-text placeholder:text-secondary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="text-xs text-secondary-text font-medium">
              Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Data Table */}
      <AnimatedContainer delay={0.15}>
        <div className="bg-card surface rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-light-background/40 text-secondary-text uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Subscription Code</th>
                  <th className="py-3 px-4">Company & Client</th>
                  <th className="py-3 px-4">Tracking Plan</th>
                  <th className="py-3 px-4 text-center">Active Units</th>
                  <th className="py-3 px-4 text-right">Monthly Fee</th>
                  <th className="py-3 px-4">Renewal Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-secondary-text">
                      No subscriptions found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-light-background/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-sky-600 dark:text-sky-400">
                        {sub.subscriptionCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-primary-text">{sub.companyName}</div>
                        <div className="text-[11px] text-secondary-text">{sub.contactPerson}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-primary-text">{sub.planName}</div>
                        <div className="text-[11px] text-secondary-text flex items-center gap-1">
                          <Radio className="w-3 h-3 text-sky-500" />
                          <span>{sub.simOperator}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-primary-text">
                        {sub.activeUnits} GPS
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-primary-text">
                        Tk,{sub.totalMonthlyFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        <span className="block text-[10px] text-secondary-text font-normal">
                          (Tk,{sub.ratePerUnit}/unit)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-secondary-text font-medium">
                        {sub.nextRenewalDate}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            sub.status === "active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : sub.status === "expiring_soon"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                          }`}
                        >
                          {sub.status === "active" && <CheckCircle2 className="w-3 h-3" />}
                          {sub.status === "expiring_soon" && <Clock className="w-3 h-3" />}
                          {sub.status === "past_due" && <AlertTriangle className="w-3 h-3" />}
                          {sub.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleGenerateInvoice(sub)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition cursor-pointer text-[11px] font-semibold"
                          title="Generate Monthly Invoice"
                        >
                          <FileText className="w-3 h-3" />
                          Bill Month
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedContainer>

      {/* Create Subscription Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-border/40">
                  <RotateCw className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-primary-text">Create Subscription Plan</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Subscriber Company *
                </label>
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Subscription Plan Package *
                </label>
                <select
                  value={formPlan}
                  onChange={(e) => setFormPlan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                >
                  <option value="Standard Vehicle Security & Anti-Theft">
                    Standard Vehicle Security (350 BDT/unit)
                  </option>
                  <option value="Fleet Live Tracking Enterprise">
                    Fleet Live Tracking Enterprise (350 BDT/unit)
                  </option>
                  <option value="Heavy Trucking & Fuel Level Telematics">
                    Heavy Trucking & Fuel Telematics (600 BDT/unit)
                  </option>
                  <option value="Ambulance Priority Emergency Tracking">
                    Emergency Vehicle Priority (500 BDT/unit)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Rate / Unit (Tk) *
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={formRate}
                    onChange={(e) => setFormRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Active GPS Units *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formUnits}
                    onChange={(e) => setFormUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Billing Cycle Day (1-28) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={28}
                    value={formBillingDay}
                    onChange={(e) => setFormBillingDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    SIM Operator *
                  </label>
                  <select
                    value={formOperator}
                    onChange={(e) => setFormOperator(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  >
                    <option value="Grameenphone IoT">Grameenphone IoT</option>
                    <option value="Robi Telematics">Robi Telematics</option>
                    <option value="Banglalink Dedicated">Banglalink Dedicated</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-xs flex justify-between items-center font-bold">
                <span className="text-sky-800 dark:text-sky-300">Total Monthly Fee:</span>
                <span className="text-base text-sky-600 dark:text-sky-400">
                  Tk,{(formRate * formUnits).toLocaleString()} / month
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
                >
                  Activate Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}