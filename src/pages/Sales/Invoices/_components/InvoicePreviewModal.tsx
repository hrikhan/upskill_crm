import React from "react";
import { X, Printer, Download, CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Invoice } from "../types";
import { COMPANY_CONFIG } from "@/config/companyConfig";

interface InvoicePreviewModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRecordPayment?: (invoice: Invoice) => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onOpenRecordPayment,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Top Action Bar (Screen Only) */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-light-background/60 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary-text">
              Invoice Preview:
            </span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {invoice.invoiceNo}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                invoice.status === "paid"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : invoice.status === "partially_paid"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                  : invoice.status === "unpaid"
                  ? "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
              }`}
            >
              {invoice.status.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {invoice.dueBalance > 0 && onOpenRecordPayment && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRecordPayment(invoice);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Record Payment
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold text-primary-text hover:bg-light-background transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-secondary-text" />
              Print / PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document Body */}
        <div id="printable-invoice" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-primary-text">
          {/* Company Branding & Invoice Metadata Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {COMPANY_CONFIG.logoInitials}
                </div>
                <h1 className="text-xl font-bold tracking-tight text-primary-text">
                  {COMPANY_CONFIG.brandShortName}
                </h1>
              </div>
              <p className="text-xs text-secondary-text font-medium mt-1">
                {COMPANY_CONFIG.tagline}
              </p>
              <p className="text-xs text-secondary-text mt-0.5">
                {COMPANY_CONFIG.address}
              </p>
              <p className="text-xs text-secondary-text">
                Support: {COMPANY_CONFIG.phone} • {COMPANY_CONFIG.email}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-2xl font-black tracking-tight text-primary-text block uppercase">
                INVOICE
              </span>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400 block mt-0.5">
                {invoice.invoiceNo}
              </span>
              <div className="text-xs text-secondary-text space-y-0.5 mt-2">
                <div>
                  <span className="font-semibold text-primary-text">Issue Date: </span>
                  {invoice.issueDate}
                </div>
                <div>
                  <span className="font-semibold text-primary-text">Due Date: </span>
                  {invoice.dueDate}
                </div>
                <div>
                  <span className="font-semibold text-primary-text">Sales Rep: </span>
                  {invoice.salesRep}
                </div>
              </div>
            </div>
          </div>

          {/* Bill To & Status Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-border">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-text block mb-1">
                Billed To
              </span>
              <h3 className="text-base font-bold text-primary-text">
                {invoice.clientName}
              </h3>
              <p className="text-xs font-semibold text-secondary-text">
                {invoice.companyName}
              </p>
              <p className="text-xs text-secondary-text mt-1">
                {invoice.billingAddress}
              </p>
              <p className="text-xs text-secondary-text">
                Phone: {invoice.clientPhone} • {invoice.clientEmail}
              </p>
            </div>

            <div className="sm:text-right flex flex-col justify-end items-start sm:items-end">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  invoice.status === "paid"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                    : invoice.status === "partially_paid"
                    ? "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                    : invoice.status === "unpaid"
                    ? "bg-sky-500/10 text-sky-600 border border-sky-500/30"
                    : "bg-rose-500/15 text-rose-600 border border-rose-500/30"
                }`}
              >
                {invoice.status === "paid" && <CheckCircle2 className="w-3.5 h-3.5" />}
                {invoice.status === "partially_paid" && <Clock className="w-3.5 h-3.5" />}
                {invoice.status === "overdue" && <AlertCircle className="w-3.5 h-3.5" />}
                Status: {invoice.status.replace("_", " ")}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-secondary-text uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3 w-8">#</th>
                  <th className="py-2.5 px-3">Item & Service Description</th>
                  <th className="py-2.5 px-3 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
                  <th className="py-2.5 px-3 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3 text-secondary-text">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium text-primary-text">
                      {item.description}
                    </td>
                    <td className="py-3 px-3 text-center text-secondary-text">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-secondary-text">
                      Tk,{item.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-primary-text">
                      Tk,{item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-border">
            {/* Payment instructions */}
            <div className="p-4 rounded-xl bg-light-background/60 border border-border/60 max-w-sm text-xs space-y-1">
              <span className="font-bold text-primary-text block mb-1">
                Payment Information:
              </span>
              <p className="text-secondary-text">
                <span className="font-semibold text-primary-text">bKash (Merchant): </span>
                {COMPANY_CONFIG.paymentAccounts.bkashMerchant}
              </p>
              <p className="text-secondary-text">
                <span className="font-semibold text-primary-text">Bank Name: </span>
                {COMPANY_CONFIG.paymentAccounts.bankName}
              </p>
              <p className="text-secondary-text">
                <span className="font-semibold text-primary-text">Account: </span>
                {COMPANY_CONFIG.paymentAccounts.accountName} #{COMPANY_CONFIG.paymentAccounts.accountNumber}
              </p>
            </div>

            {/* Calculations column */}
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-secondary-text">
                <span>Subtotal:</span>
                <span className="font-medium text-primary-text">
                  Tk,{invoice.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {invoice.taxPercent > 0 && (
                <div className="flex justify-between text-secondary-text">
                  <span>VAT ({invoice.taxPercent}%):</span>
                  <span className="font-medium text-primary-text">
                    Tk,{invoice.taxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount:</span>
                  <span className="font-medium">
                    - Tk,{invoice.discount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-border font-bold text-sm text-primary-text">
                <span>Total Billed:</span>
                <span>Tk,{invoice.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Total Paid:</span>
                <span>Tk,{invoice.paidAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-sm mt-2">
                <span>Balance Due:</span>
                <span>Tk,{invoice.dueBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Payment History Ledger */}
          {invoice.payments.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-bold text-primary-text uppercase tracking-wider mb-2">
                Payment History Ledger
              </h4>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-light-background/60 text-secondary-text">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Method</th>
                      <th className="py-2 px-3">Reference / Slip</th>
                      <th className="py-2 px-3">Received By</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoice.payments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 px-3 font-medium">{p.paymentDate}</td>
                        <td className="py-2 px-3">{p.method}</td>
                        <td className="py-2 px-3 text-secondary-text">
                          {p.transactionId || "—"}
                        </td>
                        <td className="py-2 px-3 text-secondary-text">
                          {p.receivedBy}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          Tk,{p.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes & Terms */}
          {invoice.notes && (
            <div className="pt-4 border-t border-border text-xs text-secondary-text">
              <span className="font-semibold text-primary-text block mb-1">Notes:</span>
              <p>{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
