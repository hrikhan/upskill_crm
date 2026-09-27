import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  Filter,
  FileText,
  CreditCard,
  Printer,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Invoice, InvoiceStatus, InvoicePaymentRecord } from "./types";
import { InvoicesKpiCards } from "./_components/InvoicesKpiCards";
import { RecordPaymentModal } from "./_components/RecordPaymentModal";
import { CreateInvoiceModal } from "./_components/CreateInvoiceModal";
import { InvoicePreviewModal } from "./_components/InvoicePreviewModal";

// Initial master invoices dataset matching CRM business & dashboard data
const initialInvoicesData: Invoice[] = [
  {
    id: "inv-1",
    invoiceNo: "#INV-2026-081",
    clientId: "cli-1",
    clientName: "Tariqul Islam",
    companyName: "Acme Logistics Ltd",
    clientPhone: "01711223344",
    clientEmail: "billing@acmecorp.com",
    billingAddress: "House 12, Road 4, Banani, Dhaka",
    issueDate: "2026-06-01",
    dueDate: "2026-06-15",
    status: "overdue",
    salesRep: "Hridoy (Admin)",
    items: [
      {
        id: "i-1",
        description: "GPS Tracker Pro X1 (Fleet Commercial Unit)",
        quantity: 1,
        unitPrice: 1000,
        total: 1000,
      },
    ],
    subtotal: 1000,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 1000,
    paidAmount: 0,
    dueBalance: 1000,
    payments: [],
    notes: "Payment was scheduled for June 15, 2026. Account marked as overdue.",
  },
  {
    id: "inv-2",
    invoiceNo: "#INV-2026-082",
    clientId: "cli-2",
    clientName: "Elena Rostova",
    companyName: "Apex Digital Media",
    clientPhone: "01822334455",
    clientEmail: "accounts@apexglobal.com",
    billingAddress: "Gulshan-2, Dhaka",
    issueDate: "2026-06-10",
    dueDate: "2026-06-28",
    status: "paid",
    salesRep: "Hridoy (Admin)",
    items: [
      {
        id: "i-2",
        description: "OBD-II Plug & Play GPS Tracker for Executive Car",
        quantity: 1,
        unitPrice: 2000,
        total: 2000,
      },
    ],
    subtotal: 2000,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 2000,
    paidAmount: 2000,
    dueBalance: 0,
    payments: [
      {
        id: "p-1",
        amount: 2000,
        paymentDate: "2026-06-25",
        method: "bKash",
        transactionId: "BKASH-9X12847",
        receivedBy: "Hridoy (Admin)",
        notes: "Full payment received via bKash Merchant.",
      },
    ],
    notes: "Completed delivery and vehicle anti-theft setup verified.",
  },
  {
    id: "inv-3",
    invoiceNo: "#INV-2026-083",
    clientId: "cli-3",
    clientName: "Tanvir Ahmed",
    companyName: "Zenith Retail Solutions",
    clientPhone: "01933445566",
    clientEmail: "finance@zenithgroup.com",
    billingAddress: "Uttara Sector 7, Dhaka",
    issueDate: "2026-06-20",
    dueDate: "2026-07-05",
    status: "unpaid",
    salesRep: "Sarah Jenkins",
    items: [
      {
        id: "i-3",
        description: "Magnetic GPS Unit (Portable / 10,000mAh Battery)",
        quantity: 1,
        unitPrice: 1500,
        total: 1500,
      },
    ],
    subtotal: 1500,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 1500,
    paidAmount: 0,
    dueBalance: 1500,
    payments: [],
    notes: "Invoice issued to Tanvir Ahmed. Payment pending via Bank Transfer.",
  },
  {
    id: "inv-4",
    invoiceNo: "#INV-2026-084",
    clientId: "cli-4",
    clientName: "Marcus Vance",
    companyName: "Nova Healthcare Inc",
    clientPhone: "01644556677",
    clientEmail: "info@novacare.com",
    billingAddress: "Dhanmondi, Dhaka",
    issueDate: "2026-06-05",
    dueDate: "2026-06-20",
    status: "paid",
    salesRep: "Michael Chang",
    items: [
      {
        id: "i-4",
        description: "Fleet Tracking Hardware & 1 Year SIM Cloud Service",
        quantity: 1,
        unitPrice: 3200,
        total: 3200,
      },
    ],
    subtotal: 3200,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 3200,
    paidAmount: 3200,
    dueBalance: 0,
    payments: [
      {
        id: "p-2",
        amount: 3200,
        paymentDate: "2026-06-18",
        method: "Bank Transfer",
        transactionId: "EFT-883921",
        receivedBy: "Michael Chang",
        notes: "Direct EFT into DBBL account.",
      },
    ],
    notes: "Installed on 2 medical ambulances.",
  },
  {
    id: "inv-5",
    invoiceNo: "#INV-2026-085",
    clientId: "cli-5",
    clientName: "Sabrina Chowdhury",
    companyName: "CloudPulse Tech",
    clientPhone: "01755667788",
    clientEmail: "admin@cloudpulse.net",
    billingAddress: "Mirpur DOHS, Dhaka",
    issueDate: "2026-06-22",
    dueDate: "2026-07-10",
    status: "partially_paid",
    salesRep: "David Miller",
    items: [
      {
        id: "i-5",
        description: "GPS Tracker Pro X1 (Fleet Commercial)",
        quantity: 1,
        unitPrice: 4500,
        total: 4500,
      },
      {
        id: "i-6",
        description: "Installation & Electrical Wiring",
        quantity: 1,
        unitPrice: 1500,
        total: 1500,
      },
    ],
    subtotal: 6000,
    taxPercent: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 6000,
    paidAmount: 2000,
    dueBalance: 4000,
    payments: [
      {
        id: "p-3",
        amount: 2000,
        paymentDate: "2026-06-22",
        method: "bKash",
        transactionId: "BKASH-ADV-4829",
        receivedBy: "David Miller",
        notes: "Partial payment received in advance (2,000 BDT). Remaining 4,000 BDT due on final wiring.",
      },
    ],
    notes: "Vehicle scheduled for installation on July 2.",
  },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoicesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [recordPaymentInvoice, setRecordPaymentInvoice] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // Compute stats for KPI cards
  const stats = useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalDue = invoices.reduce((sum, inv) => sum + inv.dueBalance, 0);
    const totalOverdue = invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.dueBalance, 0);

    return {
      totalInvoiced,
      totalPaid,
      totalDue,
      totalOverdue,
      count: invoices.length,
      paidCount: invoices.filter((i) => i.status === "paid").length,
      partialCount: invoices.filter((i) => i.status === "partially_paid").length,
      unpaidCount: invoices.filter((i) => i.status === "unpaid").length,
      overdueCount: invoices.filter((i) => i.status === "overdue").length,
    };
  }, [invoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.clientPhone.includes(searchQuery);

      const matchStatus =
        statusFilter === "all" || inv.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Create new invoice handler
  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  // Record payment handler (recalculates paid, due, and status)
  const handleSavePayment = (
    invoiceId: string,
    paymentData: Omit<InvoicePaymentRecord, "id">
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;

        const newPayment: InvoicePaymentRecord = {
          id: `pay-${Date.now()}`,
          ...paymentData,
        };

        const updatedPaid = inv.paidAmount + paymentData.amount;
        const updatedDue = Math.max(0, inv.totalAmount - updatedPaid);

        let newStatus: InvoiceStatus = inv.status;
        if (updatedDue <= 0) {
          newStatus = "paid";
        } else if (updatedPaid > 0) {
          newStatus = "partially_paid";
        }

        return {
          ...inv,
          paidAmount: updatedPaid,
          dueBalance: updatedDue,
          status: newStatus,
          payments: [newPayment, ...inv.payments],
        };
      })
    );
  };

  // Delete invoice handler
  const handleDeleteInvoice = (id: string, invoiceNo: string) => {
    if (confirm(`Are you sure you want to delete invoice ${invoiceNo}?`)) {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      toast.success(`Invoice ${invoiceNo} deleted`);
    }
  };

  // Generate next sequential invoice number
  const nextInvoiceNo = useMemo(() => {
    const num = invoices.length + 81;
    return `#INV-2026-0${num}`;
  }, [invoices.length]);

  return (
    <div className="space-y-6">
      {/* Top Header & New Invoice Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary-text">
            Invoices & Billing
          </h1>
          <p className="text-xs text-secondary-text mt-0.5">
            Client billing, installments, and payment ledger management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Row 1: KPI Stat Cards */}
      <AnimatedContainer delay={0.05}>
        <InvoicesKpiCards
          totalInvoiced={stats.totalInvoiced}
          totalPaid={stats.totalPaid}
          totalDue={stats.totalDue}
          totalOverdue={stats.totalOverdue}
          invoiceCount={stats.count}
        />
      </AnimatedContainer>

      {/* Row 2: Filter Toolbar & Status Tabs */}
      <AnimatedContainer delay={0.1}>
        <div className="bg-card surface rounded-2xl p-4 border border-border shadow-xs space-y-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All Invoices", count: stats.count },
              { id: "paid", label: "Paid", count: stats.paidCount },
              { id: "partially_paid", label: "Partially Paid", count: stats.partialCount },
              { id: "unpaid", label: "Unpaid", count: stats.unpaidCount },
              { id: "overdue", label: "Overdue", count: stats.overdueCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-light-background/60 hover:bg-light-background text-secondary-text hover:text-primary-text border border-border/50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-border text-secondary-text"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
            <div className="relative grow max-w-md">
              <Search className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by invoice #, client name, company, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-light-background/60 border border-border text-xs text-primary-text placeholder:text-secondary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="text-xs text-secondary-text font-medium">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Row 3: Invoices Data Grid */}
      <AnimatedContainer delay={0.15}>
        <div className="bg-card surface rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-light-background/40 text-secondary-text uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Invoice</th>
                  <th className="py-3 px-4">Client & Company</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4 text-right">Total Billed</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-secondary-text">
                      No invoices found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-light-background/60 transition-colors"
                    >
                      {/* Invoice No */}
                      <td className="py-3.5 px-4 font-bold text-sky-600 dark:text-sky-400">
                        <button
                          type="button"
                          onClick={() => setPreviewInvoice(inv)}
                          className="hover:underline flex items-center gap-1.5 cursor-pointer text-left"
                        >
                          <FileText className="w-4 h-4 text-secondary-text" />
                          <span>{inv.invoiceNo}</span>
                        </button>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-primary-text">
                          {inv.companyName}
                        </div>
                        <div className="text-[11px] text-secondary-text">
                          {inv.clientName} • {inv.clientPhone}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="text-secondary-text">
                          Issued: {inv.issueDate}
                        </div>
                        <div
                          className={`text-[11px] font-medium ${
                            inv.status === "overdue"
                              ? "text-rose-600 dark:text-rose-400 font-bold"
                              : "text-secondary-text"
                          }`}
                        >
                          Due: {inv.dueDate}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-bold text-primary-text">
                        Tk,{inv.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Paid */}
                      <td className="py-3.5 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        Tk,{inv.paidAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Due Balance */}
                      <td className="py-3.5 px-4 text-right font-bold">
                        {inv.dueBalance > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400">
                            Tk,{inv.dueBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-secondary-text">Tk,0.00</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            inv.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : inv.status === "partially_paid"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              : inv.status === "unpaid"
                              ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                          }`}
                        >
                          {inv.status === "paid" && <CheckCircle2 className="w-3 h-3" />}
                          {inv.status === "partially_paid" && <Clock className="w-3 h-3" />}
                          {inv.status === "overdue" && <AlertCircle className="w-3 h-3" />}
                          {inv.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.dueBalance > 0 && (
                            <button
                              type="button"
                              onClick={() => setRecordPaymentInvoice(inv)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition cursor-pointer font-semibold text-[11px]"
                              title="Record Payment"
                            >
                              <CreditCard className="w-3 h-3" />
                              Pay
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setPreviewInvoice(inv)}
                            className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background transition cursor-pointer"
                            title="View / Print Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNo)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Record Payment Modal */}
      <RecordPaymentModal
        invoice={recordPaymentInvoice}
        isOpen={!!recordPaymentInvoice}
        onClose={() => setRecordPaymentInvoice(null)}
        onSavePayment={handleSavePayment}
      />

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateInvoice={handleCreateInvoice}
        nextInvoiceNumber={nextInvoiceNo}
      />

      {/* Invoice Printable Preview Modal */}
      <InvoicePreviewModal
        invoice={previewInvoice}
        isOpen={!!previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        onOpenRecordPayment={(inv) => setRecordPaymentInvoice(inv)}
      />
    </div>
  );
}