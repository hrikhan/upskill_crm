import React, { useState } from "react";
import { X, CreditCard, DollarSign, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { Invoice, InvoicePaymentRecord } from "../types";
import { toast } from "sonner";

interface RecordPaymentModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (
    invoiceId: string,
    payment: Omit<InvoicePaymentRecord, "id">
  ) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onSavePayment,
}) => {
  if (!isOpen || !invoice) return null;

  const [amount, setAmount] = useState<number>(invoice.dueBalance);
  const [method, setMethod] = useState<InvoicePaymentRecord["method"]>("bKash");
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.error("Payment amount must be greater than zero");
      return;
    }

    if (amount > invoice.dueBalance + 0.01) {
      toast.error(
        `Amount cannot exceed the remaining due balance of Tk,${invoice.dueBalance.toLocaleString()}`
      );
      return;
    }

    onSavePayment(invoice.id, {
      amount,
      paymentDate,
      method,
      transactionId: transactionId.trim() || undefined,
      receivedBy: "Hridoy (Admin)",
      notes: notes.trim() || undefined,
    });

    toast.success(
      `Payment of Tk,${amount.toLocaleString()} recorded for ${invoice.invoiceNo}`
    );
    onClose();
  };

  const handleFullAmount = () => {
    setAmount(invoice.dueBalance);
  };

  const handleHalfAmount = () => {
    setAmount(Math.round(invoice.dueBalance / 2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-primary-text">
                Record Payment
              </h2>
              <p className="text-xs text-secondary-text">
                Invoice {invoice.invoiceNo} • {invoice.companyName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Balance Snapshot */}
        <div className="bg-light-background/60 p-4 border-b border-border grid grid-cols-3 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-card border border-border/60">
            <span className="text-[11px] text-secondary-text block">Total Billed</span>
            <span className="text-sm font-bold text-primary-text mt-0.5 block">
              Tk,{invoice.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border/60">
            <span className="text-[11px] text-secondary-text block">Already Paid</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              Tk,{invoice.paidAmount.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-amber-300 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block">
              Remaining Due
            </span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
              Tk,{invoice.dueBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Amount Input with quick pill buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-primary-text flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-secondary-text" />
                Payment Amount (BDT) *
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleHalfAmount}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-light-background border border-border text-secondary-text hover:text-primary-text cursor-pointer"
                >
                  50% Partial
                </button>
                <button
                  type="button"
                  onClick={handleFullAmount}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-700 dark:text-emerald-300 cursor-pointer"
                >
                  Full Due
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary-text">
                Tk,
              </span>
              <input
                type="number"
                min={1}
                max={invoice.dueBalance}
                step="any"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm font-bold text-primary-text focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>
            <p className="text-[11px] text-secondary-text mt-1">
              {amount === invoice.dueBalance
                ? "This payment will mark the invoice as FULLY PAID."
                : `After this payment, remaining due will be Tk,${Math.max(
                    0,
                    invoice.dueBalance - (amount || 0)
                  ).toLocaleString()}.`}
            </p>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary-text block mb-1.5">
                Payment Method *
              </label>
              <select
                value={method}
                onChange={(e) =>
                  setMethod(e.target.value as InvoicePaymentRecord["method"])
                }
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-primary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              >
                <option value="bKash">bKash (Merchant / Personal)</option>
                <option value="Cash">Cash at Counter / Office</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank Transfer">Bank Transfer (EFT / RTGS)</option>
                <option value="Credit Card">Credit / Debit Card</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary-text block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-secondary-text" />
                Payment Date *
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-primary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>
          </div>

          {/* Transaction ID */}
          <div>
            <label className="text-xs font-semibold text-primary-text block mb-1.5">
              Transaction ID / Slip Reference
            </label>
            <input
              type="text"
              placeholder="e.g. BKASH-9X82716 or Bank Deposit Slip #481"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-primary-text placeholder:text-secondary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-primary-text block mb-1.5">
              Internal Note / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Received partial advance via bKash; remaining due scheduled on installation day."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text placeholder:text-secondary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary-text hover:text-primary-text hover:bg-light-background transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirm Payment (Tk,{amount.toLocaleString()})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
