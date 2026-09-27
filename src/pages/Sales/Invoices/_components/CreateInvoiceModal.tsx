import React, { useState } from "react";
import { X, Plus, Trash2, FileText, CheckCircle2, DollarSign } from "lucide-react";
import { Invoice, InvoiceLineItem, InvoiceStatus } from "../types";
import { toast } from "sonner";
import { COMPANY_CONFIG } from "@/config/companyConfig";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (invoice: Invoice) => void;
  nextInvoiceNumber: string;
}

const PRESET_CLIENTS = [
  {
    id: "cli-1",
    name: "Acme Logistics Ltd",
    company: "Acme Corp",
    phone: "01711223344",
    email: "billing@acmecorp.com",
    address: "Banani, Dhaka",
  },
  {
    id: "cli-2",
    name: "Apex Digital Media",
    company: "Apex Global",
    phone: "01822334455",
    email: "accounts@apexglobal.com",
    address: "Gulshan-2, Dhaka",
  },
  {
    id: "cli-3",
    name: "Zenith Retail Solutions",
    company: "Zenith Group",
    phone: "01933445566",
    email: "finance@zenithgroup.com",
    address: "Uttara Sector 7, Dhaka",
  },
  {
    id: "cli-4",
    name: "Nova Healthcare Inc",
    company: "Nova Care",
    phone: "01644556677",
    email: "info@novacare.com",
    address: "Dhanmondi, Dhaka",
  },
  {
    id: "cli-5",
    name: "CloudPulse Tech",
    company: "CloudPulse Networks",
    phone: "01755667788",
    email: "admin@cloudpulse.net",
    address: "Mirpur DOHS, Dhaka",
  },
];

const PRESET_PRODUCTS = COMPANY_CONFIG.productPresets.map((p) => ({
  description: p.name,
  unitPrice: p.unitPrice,
}));

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onCreateInvoice,
  nextInvoiceNumber,
}) => {
  if (!isOpen) return null;

  const [selectedClientId, setSelectedClientId] = useState(PRESET_CLIENTS[0].id);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [salesRep, setSalesRep] = useState("Hridoy (Admin)");
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [upfrontPaid, setUpfrontPaid] = useState<number>(0);
  const [notes, setNotes] = useState(COMPANY_CONFIG.invoiceTerms);

  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: "item-1",
      description: PRESET_PRODUCTS[0].description,
      quantity: 1,
      unitPrice: PRESET_PRODUCTS[0].unitPrice,
      total: PRESET_PRODUCTS[0].unitPrice,
    },
    {
      id: "item-2",
      description: PRESET_PRODUCTS[3].description,
      quantity: 1,
      unitPrice: PRESET_PRODUCTS[3].unitPrice,
      total: PRESET_PRODUCTS[3].unitPrice,
    },
  ]);

  // Handle line item modifications
  const handleItemChange = (
    id: string,
    field: keyof InvoiceLineItem,
    val: any
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };
        if (field === "quantity" || field === "unitPrice") {
          const qty = field === "quantity" ? Number(val) : item.quantity;
          const price = field === "unitPrice" ? Number(val) : item.unitPrice;
          updated.total = qty * price;
        }
        return updated;
      })
    );
  };

  const handleAddItem = (presetIndex = 0) => {
    const preset = PRESET_PRODUCTS[presetIndex];
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: preset.description,
        quantity: 1,
        unitPrice: preset.unitPrice,
        total: preset.unitPrice,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error("Invoice must have at least one line item");
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Compute Subtotal, Tax, and Final Total
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - discount);
  const dueBalance = Math.max(0, totalAmount - upfrontPaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Please add at least one line item");
      return;
    }

    const client =
      PRESET_CLIENTS.find((c) => c.id === selectedClientId) || PRESET_CLIENTS[0];

    let status: InvoiceStatus = "unpaid";
    if (upfrontPaid >= totalAmount) {
      status = "paid";
    } else if (upfrontPaid > 0) {
      status = "partially_paid";
    }

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: nextInvoiceNumber,
      clientId: client.id,
      clientName: client.name,
      companyName: client.company,
      clientPhone: client.phone,
      clientEmail: client.email,
      billingAddress: client.address,
      issueDate,
      dueDate,
      status,
      salesRep,
      items,
      subtotal,
      taxPercent,
      taxAmount,
      discount,
      totalAmount,
      paidAmount: upfrontPaid,
      dueBalance,
      payments:
        upfrontPaid > 0
          ? [
              {
                id: `pay-${Date.now()}`,
                amount: upfrontPaid,
                paymentDate: issueDate,
                method: "bKash",
                transactionId: "INITIAL-ADVANCE",
                receivedBy: salesRep,
                notes: "Initial advance received upon invoice generation.",
              },
            ]
          : [],
      notes,
    };

    onCreateInvoice(newInvoice);
    toast.success(`Invoice ${nextInvoiceNumber} created successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-primary-text">
                Generate New Invoice
              </h2>
              <p className="text-xs text-secondary-text">
                Invoice Number:{" "}
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {nextInvoiceNumber}
                </span>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Row 1: Client & Sales Rep */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-primary-text block mb-1.5">
                Select Client *
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-primary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              >
                {PRESET_CLIENTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary-text block mb-1.5">
                Sales Representative *
              </label>
              <select
                value={salesRep}
                onChange={(e) => setSalesRep(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-primary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              >
                <option value="Hridoy (Admin)">Hridoy (Admin)</option>
                <option value="Sarah Jenkins">Sarah Jenkins (Sales)</option>
                <option value="Michael Chang">Michael Chang (Sales)</option>
                <option value="David Miller">David Miller (Sales)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-primary-text block mb-1.5">
                Issue Date *
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-primary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-primary-text block mb-1.5">
                Payment Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-xs font-medium text-primary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>
          </div>

          {/* Line Items Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary-text uppercase tracking-wider">
                Invoice Line Items
              </span>
              <button
                type="button"
                onClick={() => handleAddItem(0)}
                className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Line Item
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-light-background/60 border border-border/70 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="grow">
                    <input
                      type="text"
                      placeholder="Item & Service Description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text focus:outline-hidden focus:border-sky-500"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            Math.max(1, Number(e.target.value))
                          )
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-card border border-border text-xs text-center font-medium text-primary-text focus:outline-hidden focus:border-sky-500"
                        required
                      />
                    </div>

                    <div className="w-28">
                      <input
                        type="number"
                        min={0}
                        step="any"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "unitPrice",
                            Math.max(0, Number(e.target.value))
                          )
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-card border border-border text-xs text-right font-medium text-primary-text focus:outline-hidden focus:border-sky-500"
                        required
                      />
                    </div>

                    <div className="w-28 text-right font-bold text-xs text-primary-text px-2">
                      Tk,{item.total.toLocaleString()}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick presets shortcut bar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-secondary-text">Quick Add:</span>
            {PRESET_PRODUCTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddItem(idx)}
                className="text-[10px] px-2 py-1 rounded-md bg-card border border-border/80 text-secondary-text hover:text-primary-text hover:border-sky-400 transition cursor-pointer"
              >
                + {p.description.split(" ")[0]} {p.description.split(" ")[1]} (Tk,{p.unitPrice})
              </button>
            ))}
          </div>

          {/* Totals & Calculations Card */}
          <div className="p-4 rounded-xl bg-light-background/60 border border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1">
                  VAT / Tax Rate (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1">
                  Discount (BDT)
                </label>
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Upfront / Advance Paid (BDT)
                </label>
                <input
                  type="number"
                  min={0}
                  max={totalAmount}
                  value={upfrontPaid}
                  onChange={(e) => setUpfrontPaid(Number(e.target.value))}
                  placeholder="e.g. 2,000 BDT advance"
                  className="w-full px-3 py-1.5 rounded-lg bg-card border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2 text-xs flex flex-col justify-end">
              <div className="flex justify-between text-secondary-text">
                <span>Line Items Subtotal:</span>
                <span className="font-semibold text-primary-text">
                  Tk,{subtotal.toLocaleString()}
                </span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between text-secondary-text">
                  <span>VAT Amount:</span>
                  <span className="font-semibold text-primary-text">
                    Tk,{taxAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span className="font-semibold">
                    - Tk,{discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-primary-text pt-2 border-t border-border">
                <span>Total Invoice Amount:</span>
                <span>Tk,{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Advance Paid:</span>
                <span>Tk,{upfrontPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <span>Remaining Due:</span>
                <span>Tk,{dueBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-primary-text block mb-1">
              Invoice Footer & Warranty Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text focus:outline-hidden focus:border-sky-500 resize-none"
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Create & Issue Invoice (Tk,{totalAmount.toLocaleString()})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
