import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  Download,
  Printer,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Calendar,
  Eye,
  FileText,
  X,
  Smartphone,
  Building,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import { COMPANY_CONFIG } from "@/config/companyConfig";

export interface PaymentReceipt {
  id: string;
  receiptNo: string;
  invoiceNo: string;
  clientName: string;
  companyName: string;
  amount: number;
  method: "bKash" | "Cash" | "Bank Transfer" | "Nagad" | "Credit Card";
  transactionId?: string;
  paymentDate: string;
  receivedBy: string;
  notes?: string;
}

const initialPaymentsData: PaymentReceipt[] = [
  {
    id: "pay-1",
    receiptNo: "REC-2026-001",
    invoiceNo: "#INV-2026-082",
    clientName: "Elena Rostova",
    companyName: "Apex Digital Media",
    amount: 2000,
    method: "bKash",
    transactionId: "BKASH-9X12847",
    paymentDate: "2026-06-25",
    receivedBy: "Hridoy (Admin)",
    notes: "Full payment received for OBD-II GPS tracker.",
  },
  {
    id: "pay-2",
    receiptNo: "REC-2026-002",
    invoiceNo: "#INV-2026-084",
    clientName: "Marcus Vance",
    companyName: "Nova Healthcare Inc",
    amount: 3200,
    method: "Bank Transfer",
    transactionId: "EFT-883921",
    paymentDate: "2026-06-18",
    receivedBy: "Michael Chang",
    notes: "Direct EFT deposit into DBBL account for ambulance fleet.",
  },
  {
    id: "pay-3",
    receiptNo: "REC-2026-003",
    invoiceNo: "#INV-2026-085",
    clientName: "Sabrina Chowdhury",
    companyName: "CloudPulse Tech",
    amount: 2000,
    method: "bKash",
    transactionId: "BKASH-ADV-4829",
    paymentDate: "2026-06-22",
    receivedBy: "David Miller",
    notes: "Advance partial payment (2,000 BDT) for GPS Tracker Pro X1.",
  },
  {
    id: "pay-4",
    receiptNo: "REC-2026-004",
    invoiceNo: "#INV-2026-078",
    clientName: "Tariqul Islam",
    companyName: "Dhaka Freight Forwarding",
    amount: 4500,
    method: "Cash",
    paymentDate: "2026-06-15",
    receivedBy: "Hridoy (Admin)",
    notes: "Cash payment at office counter for heavy-duty truck unit.",
  },
  {
    id: "pay-5",
    receiptNo: "REC-2026-005",
    invoiceNo: "#INV-2026-075",
    clientName: "Tanvir Ahmed",
    companyName: "Prime Textiles Ltd",
    amount: 1500,
    method: "Nagad",
    transactionId: "NAGAD-382910",
    paymentDate: "2026-06-12",
    receivedBy: "Sarah Jenkins",
    notes: "Monthly tracking fee renewal for 5 vehicles.",
  },
];

export default function Payments() {
  const [payments, setPayments] = useState<PaymentReceipt[]>(initialPaymentsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewReceipt, setViewReceipt] = useState<PaymentReceipt | null>(null);

  // New Payment Form state
  const [formClient, setFormClient] = useState("Acme Logistics Ltd");
  const [formInvoice, setFormInvoice] = useState("#INV-2026-081");
  const [formAmount, setFormAmount] = useState<number>(1000);
  const [formMethod, setFormMethod] = useState<PaymentReceipt["method"]>("bKash");
  const [formTrx, setFormTrx] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formNotes, setFormNotes] = useState("");

  // Statistics
  const stats = useMemo(() => {
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const bkashSum = payments
      .filter((p) => p.method === "bKash")
      .reduce((sum, p) => sum + p.amount, 0);
    const bankSum = payments
      .filter((p) => p.method === "Bank Transfer")
      .reduce((sum, p) => sum + p.amount, 0);
    const cashSum = payments
      .filter((p) => p.method === "Cash")
      .reduce((sum, p) => sum + p.amount, 0);

    return { totalCollected, bkashSum, bankSum, cashSum, totalCount: payments.length };
  }, [payments]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        p.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchMethod = methodFilter === "all" || p.method === methodFilter;

      return matchSearch && matchMethod;
    });
  }, [payments, searchQuery, methodFilter]);

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formAmount <= 0) {
      toast.error("Payment amount must be greater than zero");
      return;
    }

    const newPayment: PaymentReceipt = {
      id: `pay-${Date.now()}`,
      receiptNo: `REC-2026-00${payments.length + 1}`,
      invoiceNo: formInvoice,
      clientName: formClient.split(" ")[0],
      companyName: formClient,
      amount: formAmount,
      method: formMethod,
      transactionId: formTrx.trim() || undefined,
      paymentDate: formDate,
      receivedBy: "Hridoy (Admin)",
      notes: formNotes.trim() || undefined,
    };

    setPayments((prev) => [newPayment, ...prev]);
    toast.success(`Payment Receipt ${newPayment.receiptNo} recorded successfully!`);
    setIsAddOpen(false);
  };

  const handleExportCSV = () => {
    const headers = "Receipt No,Invoice No,Company,Client,Amount,Method,Transaction ID,Date,Received By\n";
    const rows = filteredPayments
      .map(
        (p) =>
          `"${p.receiptNo}","${p.invoiceNo}","${p.companyName}","${p.clientName}",${p.amount},"${p.method}","${p.transactionId || ""}","${p.paymentDate}","${p.receivedBy}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-ledger-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Payments ledger exported to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary-text">
            Payments Ledger
          </h1>
          <p className="text-xs text-secondary-text mt-0.5">
            Real-time transaction history, receipts, and multi-channel collection logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-secondary-text hover:text-primary-text hover:bg-light-background transition cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Record Payment Receipt
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card surface rounded-2xl p-5 border border-emerald-200 dark:border-emerald-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Total Collected
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-border/40">
                <CheckCircle2 className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              {stats.totalCount} receipts recorded across all channels
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-sky-200 dark:border-sky-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  bKash Collections
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.bkashSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-border/40">
                <Smartphone className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Merchant & personal wallet transfers
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-indigo-200 dark:border-indigo-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Bank EFT / RTGS
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.bankSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-border/40">
                <Building className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Direct DBBL commercial deposits
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-amber-200 dark:border-amber-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Cash Collections
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.cashSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-border/40">
                <Banknote className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Counter and field installation collections
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Filter Toolbar */}
      <AnimatedContainer delay={0.1}>
        <div className="bg-card surface rounded-2xl p-4 border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["all", "bKash", "Cash", "Bank Transfer", "Nagad"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethodFilter(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  methodFilter === m
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-light-background/60 hover:bg-light-background text-secondary-text hover:text-primary-text border border-border/50"
                }`}
              >
                {m === "all" ? "All Methods" : m}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
            <div className="relative grow max-w-md">
              <Search className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search receipt #, invoice #, client, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-light-background/60 border border-border text-xs text-primary-text placeholder:text-secondary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="text-xs text-secondary-text font-medium">
              Showing {filteredPayments.length} of {payments.length} transactions
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
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client & Company</th>
                  <th className="py-3 px-4">Method & Reference</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4 text-right">Amount Received</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-secondary-text">
                      No payments found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-light-background/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-sky-600 dark:text-sky-400">
                        {p.receiptNo}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-primary-text">
                        {p.invoiceNo}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-primary-text">{p.companyName}</div>
                        <div className="text-[11px] text-secondary-text">{p.clientName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-primary-text">{p.method}</div>
                        <div className="text-[11px] text-secondary-text font-mono">
                          {p.transactionId || "Direct Office Receipt"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-secondary-text">
                        {p.paymentDate}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        Tk,{p.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setViewReceipt(p)}
                          className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background transition cursor-pointer"
                          title="View Receipt"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* Record Payment Receipt Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-border/40">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-primary-text">Record Direct Payment</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Client / Company *
                </label>
                <input
                  type="text"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Invoice # *
                  </label>
                  <input
                    type="text"
                    value={formInvoice}
                    onChange={(e) => setFormInvoice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Amount (Tk) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Payment Method *
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as PaymentReceipt["method"])}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Transaction ID / Slip Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. BKASH-XXXX or Bank Deposit Ref"
                  value={formTrx}
                  onChange={(e) => setFormTrx(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Notes / Memo
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text resize-none"
                  placeholder="Optional internal remarks..."
                />
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Save Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Printable Receipt Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-light-background/60">
              <span className="text-xs font-bold text-primary-text">
                Payment Receipt: {viewReceipt.receiptNo}
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
                  onClick={() => setViewReceipt(null)}
                  className="p-1 rounded-lg text-secondary-text hover:text-primary-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs text-primary-text">
              <div className="text-center pb-4 border-b border-border">
                <h3 className="text-base font-bold">{COMPANY_CONFIG.companyName}</h3>
                <p className="text-secondary-text">{COMPANY_CONFIG.tagline}</p>
                <p className="text-secondary-text">{COMPANY_CONFIG.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border">
                <div>
                  <span className="text-secondary-text block">Received From:</span>
                  <span className="font-bold text-sm">{viewReceipt.companyName}</span>
                  <span className="block text-secondary-text">{viewReceipt.clientName}</span>
                </div>
                <div className="text-right">
                  <span className="text-secondary-text block">Receipt Date:</span>
                  <span className="font-semibold">{viewReceipt.paymentDate}</span>
                  <span className="block text-secondary-text">Invoice: {viewReceipt.invoiceNo}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium block">
                  Amount Received
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">
                  Tk,{viewReceipt.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-secondary-text mt-1 block">
                  Payment Method: {viewReceipt.method}{" "}
                  {viewReceipt.transactionId ? `(${viewReceipt.transactionId})` : ""}
                </span>
              </div>

              {viewReceipt.notes && (
                <div className="p-3 rounded-lg bg-light-background/60 text-secondary-text">
                  <span className="font-semibold text-primary-text block mb-0.5">Note:</span>
                  {viewReceipt.notes}
                </div>
              )}

              <div className="pt-3 border-t border-border flex justify-between text-secondary-text text-[11px]">
                <span>Received by: {viewReceipt.receivedBy}</span>
                <span>System Verified Receipt</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}