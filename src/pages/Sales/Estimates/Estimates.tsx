import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  FileCheck,
  Send,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Trash2,
  Eye,
  ArrowRight,
  DollarSign,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { COMPANY_CONFIG } from "@/config/companyConfig";

export interface EstimateItem {
  id: string;
  estimateNo: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  date: string;
  validUntil: string;
  salesRep: string;
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "declined" | "invoiced";
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
}

const initialEstimatesData: EstimateItem[] = [
  {
    id: "est-1",
    estimateNo: "EST-2026-001",
    clientName: "Tariqul Islam",
    companyName: "Dhaka Freight Forwarding",
    phone: "01711223344",
    email: "tariqul@dhakafreight.com",
    date: "2026-06-20",
    validUntil: "2026-07-20",
    salesRep: "Hridoy (Admin)",
    totalAmount: 45000,
    status: "accepted",
    items: [
      {
        id: "i-1",
        description: "GPS Tracker Pro X1 (Fleet Commercial Heavy Duty)",
        quantity: 10,
        unitPrice: 4500,
        total: 45000,
      },
    ],
    notes: "Quotation for 10 freight trucks. Client accepted via phone conference.",
  },
  {
    id: "est-2",
    estimateNo: "EST-2026-002",
    clientName: "Elena Rostova",
    companyName: "Nordic Soft Labs",
    phone: "01822334455",
    email: "elena@nordicsoft.com",
    date: "2026-06-22",
    validUntil: "2026-07-22",
    salesRep: "Hridoy (Admin)",
    totalAmount: 12800,
    status: "sent",
    items: [
      {
        id: "i-2",
        description: "OBD-II Plug & Play GPS Tracker for Sedans & SUVs",
        quantity: 4,
        unitPrice: 3200,
        total: 12800,
      },
    ],
    notes: "Executive sedan fleet tracking quote sent to procurement.",
  },
  {
    id: "est-3",
    estimateNo: "EST-2026-003",
    clientName: "Tanvir Ahmed",
    companyName: "Prime Textiles Ltd",
    phone: "01933445566",
    email: "tanvir@primetextiles.com",
    date: "2026-06-18",
    validUntil: "2026-07-18",
    salesRep: "Sarah Jenkins",
    totalAmount: 85000,
    status: "sent",
    items: [
      {
        id: "i-3",
        description: "GPS Tracker Pro X1 + Ultrasonic Fuel Sensor Integration",
        quantity: 10,
        unitPrice: 8500,
        total: 85000,
      },
    ],
    notes: "Fuel monitoring telematics for delivery truck fleet.",
  },
  {
    id: "est-4",
    estimateNo: "EST-2026-004",
    clientName: "Marcus Vance",
    companyName: "Apex Cloud Services",
    phone: "01644556677",
    email: "marcus@apexcloud.com",
    date: "2026-06-10",
    validUntil: "2026-07-10",
    salesRep: "Michael Chang",
    totalAmount: 30000,
    status: "invoiced",
    items: [
      {
        id: "i-4",
        description: "Magnetic GPS Unit (Portable / 10,000mAh Battery)",
        quantity: 8,
        unitPrice: 3750,
        total: 30000,
      },
    ],
    notes: "Converted into Invoice #INV-2026-084.",
  },
];

export default function Estimates() {
  const [estimates, setEstimates] = useState<EstimateItem[]>(initialEstimatesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewEstimate, setPreviewEstimate] = useState<EstimateItem | null>(null);

  // New Estimate Form state
  const [formCompany, setFormCompany] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSalesRep, setFormSalesRep] = useState("Hridoy (Admin)");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formValid, setFormValid] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [formNotes, setFormNotes] = useState(COMPANY_CONFIG.invoiceTerms);

  const [items, setItems] = useState([
    {
      id: "item-1",
      description: COMPANY_CONFIG.productPresets[0].name,
      quantity: 5,
      unitPrice: COMPANY_CONFIG.productPresets[0].unitPrice,
      total: COMPANY_CONFIG.productPresets[0].unitPrice * 5,
    },
  ]);

  // Compute Stats
  const stats = useMemo(() => {
    const totalPipeline = estimates.reduce((sum, e) => sum + e.totalAmount, 0);
    const acceptedSum = estimates
      .filter((e) => e.status === "accepted" || e.status === "invoiced")
      .reduce((sum, e) => sum + e.totalAmount, 0);
    const pendingSum = estimates
      .filter((e) => e.status === "sent")
      .reduce((sum, e) => sum + e.totalAmount, 0);

    return {
      totalPipeline,
      acceptedSum,
      pendingSum,
      count: estimates.length,
      acceptedCount: estimates.filter((e) => e.status === "accepted" || e.status === "invoiced").length,
    };
  }, [estimates]);

  // Filtered
  const filteredEstimates = useMemo(() => {
    return estimates.filter((est) => {
      const matchSearch =
        est.estimateNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        est.phone.includes(searchQuery);

      const matchStatus = statusFilter === "all" || est.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [estimates, searchQuery, statusFilter]);

  // Convert to Invoice handler
  const handleConvertToInvoice = (est: EstimateItem) => {
    setEstimates((prev) =>
      prev.map((e) => (e.id === est.id ? { ...e, status: "invoiced" } : e))
    );
    toast.success(
      `Quotation ${est.estimateNo} converted to official Invoice! (Tk,${est.totalAmount.toLocaleString()})`
    );
  };

  const handleCreateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim()) {
      toast.error("Company name is required");
      return;
    }

    const totalAmount = items.reduce((sum, i) => sum + i.total, 0);
    const newEst: EstimateItem = {
      id: `est-${Date.now()}`,
      estimateNo: `EST-2026-00${estimates.length + 1}`,
      clientName: formClient || formCompany,
      companyName: formCompany,
      phone: formPhone || "01700000000",
      email: formEmail || "client@company.com",
      date: formDate,
      validUntil: formValid,
      salesRep: formSalesRep,
      totalAmount,
      status: "sent",
      items,
      notes: formNotes,
    };

    setEstimates((prev) => [newEst, ...prev]);
    toast.success(`Quotation ${newEst.estimateNo} created and ready to send!`);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary-text">
            Estimates & Quotations
          </h1>
          <p className="text-xs text-secondary-text mt-0.5">
            Pre-sale hardware quotes, fleet proposals, and 1-click invoice conversions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Estimate
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
                  Total Quoted Value
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.totalPipeline.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-border/40">
                <FileCheck className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              {stats.count} total estimates issued to prospective clients
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-emerald-200 dark:border-emerald-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Accepted & Invoiced
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.acceptedSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-border/40">
                <CheckCircle2 className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              {stats.acceptedCount} estimates successfully converted to deals
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-amber-200 dark:border-amber-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Pending Client Approval
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.pendingSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-border/40">
                <Clock className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Active proposals awaiting customer signature
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-indigo-200 dark:border-indigo-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Conversion Win Rate
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  {Math.round((stats.acceptedCount / (stats.count || 1)) * 100)}%
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-border/40">
                <Send className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              High sales conversion efficiency
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Filters */}
      <AnimatedContainer delay={0.1}>
        <div className="bg-card surface rounded-2xl p-4 border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["all", "sent", "accepted", "invoiced", "draft"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap capitalize ${
                  statusFilter === st
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-light-background/60 hover:bg-light-background text-secondary-text hover:text-primary-text border border-border/50"
                }`}
              >
                {st === "all" ? "All Estimates" : st}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
            <div className="relative grow max-w-md">
              <Search className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search estimate #, client name, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-light-background/60 border border-border text-xs text-primary-text placeholder:text-secondary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="text-xs text-secondary-text font-medium">
              Showing {filteredEstimates.length} of {estimates.length} quotes
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Estimates Table */}
      <AnimatedContainer delay={0.15}>
        <div className="bg-card surface rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-light-background/40 text-secondary-text uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Estimate #</th>
                  <th className="py-3 px-4">Client & Company</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4 text-right">Quoted Amount</th>
                  <th className="py-3 px-4">Sales Rep</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border">
                {filteredEstimates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-secondary-text">
                      No estimates found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredEstimates.map((est) => (
                    <tr key={est.id} className="hover:bg-light-background/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-sky-600 dark:text-sky-400">
                        {est.estimateNo}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-primary-text">{est.companyName}</div>
                        <div className="text-[11px] text-secondary-text">{est.clientName}</div>
                      </td>
                      <td className="py-3.5 px-4 text-secondary-text">
                        <div>Date: {est.date}</div>
                        <div className="text-[11px]">Valid Until: {est.validUntil}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-primary-text">
                        Tk,{est.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-secondary-text font-medium">
                        {est.salesRep}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            est.status === "invoiced"
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                              : est.status === "accepted"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : est.status === "sent"
                              ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {est.status === "invoiced" && <FileText className="w-3 h-3" />}
                          {est.status === "accepted" && <CheckCircle2 className="w-3 h-3" />}
                          {est.status === "sent" && <Clock className="w-3 h-3" />}
                          {est.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {est.status !== "invoiced" && (
                            <button
                              type="button"
                              onClick={() => handleConvertToInvoice(est)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition cursor-pointer text-[11px] font-semibold"
                              title="Convert to Active Invoice"
                            >
                              <ArrowRight className="w-3 h-3" />
                              Convert to Invoice
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setPreviewEstimate(est)}
                            className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background transition cursor-pointer"
                            title="View Printable Quote"
                          >
                            <Eye className="w-4 h-4" />
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
      </AnimatedContainer>

      {/* Printable Estimate Preview Modal */}
      {previewEstimate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-light-background/60">
              <span className="text-xs font-bold text-primary-text">
                Quotation Preview: {previewEstimate.estimateNo}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-card border border-border text-xs font-medium text-primary-text"
                >
                  <Printer className="w-3.5 h-3.5 text-secondary-text" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewEstimate(null)}
                  className="p-1 rounded-lg text-secondary-text hover:text-primary-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs text-primary-text">
              <div className="flex justify-between items-start pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-bold">{COMPANY_CONFIG.companyName}</h3>
                  <p className="text-secondary-text">{COMPANY_CONFIG.tagline}</p>
                  <p className="text-secondary-text">{COMPANY_CONFIG.address}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black block">ESTIMATE</span>
                  <span className="text-sky-600 font-bold">{previewEstimate.estimateNo}</span>
                  <span className="block text-secondary-text">Valid Until: {previewEstimate.validUntil}</span>
                </div>
              </div>

              <div>
                <span className="text-secondary-text block">Prepared For:</span>
                <span className="font-bold text-sm">{previewEstimate.companyName}</span>
                <span className="block text-secondary-text">{previewEstimate.clientName} • {previewEstimate.phone}</span>
              </div>

              <table className="w-full text-left text-xs border border-border rounded-xl overflow-hidden">
                <thead className="bg-light-background/60 text-secondary-text">
                  <tr>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Price</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border">
                  {previewEstimate.items.map((i) => (
                    <tr key={i.id}>
                      <td className="py-2.5 px-3 font-medium">{i.description}</td>
                      <td className="py-2.5 px-3 text-center text-secondary-text">{i.quantity}</td>
                      <td className="py-2.5 px-3 text-right">Tk,{i.unitPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold">Tk,{i.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 font-bold text-sm">
                <span className="text-sky-800 dark:text-sky-300">Total Quoted Amount:</span>
                <span className="text-sky-600 dark:text-sky-400 text-lg">
                  Tk,{previewEstimate.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="text-secondary-text text-[11px] pt-2 border-t border-border">
                <span className="font-semibold text-primary-text block mb-1">Terms:</span>
                {previewEstimate.notes}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Estimate Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-border/40">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-primary-text">Create Estimate Quotation</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEstimate} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Fleet Ltd"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tariqul Islam"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    placeholder="017XXXXXXXX"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="billing@company.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-light-background/60 border border-border space-y-2">
                <span className="text-xs font-bold text-primary-text block">Quoted Package:</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <span className="text-[11px] text-secondary-text block mb-1">GPS Hardware:</span>
                    <span className="text-xs font-semibold text-primary-text">
                      {COMPANY_CONFIG.productPresets[0].name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-secondary-text block mb-1">Qty Units:</span>
                    <input
                      type="number"
                      min={1}
                      value={items[0].quantity}
                      onChange={(e) => {
                        const qty = Math.max(1, Number(e.target.value));
                        setItems([
                          {
                            ...items[0],
                            quantity: qty,
                            total: qty * items[0].unitPrice,
                          },
                        ]);
                      }}
                      className="w-full px-2 py-1 rounded-lg bg-card border border-border text-xs font-bold text-center"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-border font-bold text-xs">
                  <span>Total Quoted:</span>
                  <span className="text-sky-600 text-sm">
                    Tk,{(items[0].quantity * items[0].unitPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
                >
                  Create & Send Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}