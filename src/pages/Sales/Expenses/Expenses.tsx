import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  Download,
  Receipt,
  DollarSign,
  TrendingDown,
  Wifi,
  Cpu,
  Truck,
  Building,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { COMPANY_CONFIG } from "@/config/companyConfig";

export interface ExpenseItem {
  id: string;
  expenseNo: string;
  title: string;
  category: "SIM & IoT Data" | "Hardware Procurement" | "Field Conveyance" | "Cloud Server & Maps" | "Office Operations";
  amount: number;
  payee: string;
  paymentMethod: "Cash" | "Bank Transfer" | "bKash" | "Credit Card";
  date: string;
  referenceNo?: string;
  status: "approved" | "pending" | "reimbursed";
  notes?: string;
}

const initialExpensesData: ExpenseItem[] = [
  {
    id: "exp-1",
    expenseNo: "EXP-2026-041",
    title: "Monthly M2M Telematics Bulk SIM Data Bundle (50 SIMs)",
    category: "SIM & IoT Data",
    amount: 7500,
    payee: "Grameenphone Business Services",
    paymentMethod: "Bank Transfer",
    date: "2026-06-20",
    referenceNo: "GP-CORP-94812",
    status: "approved",
    notes: "Data plan active for 50 commercial GPS devices.",
  },
  {
    id: "exp-2",
    expenseNo: "EXP-2026-042",
    title: "Procurement of 25x GPS Tracker Pro X1 Hardware Units",
    category: "Hardware Procurement",
    amount: 62500,
    payee: "Shenzhen Concox Telematics Ltd",
    paymentMethod: "Bank Transfer",
    date: "2026-06-15",
    referenceNo: "LC-IMPORT-3829",
    status: "approved",
    notes: "Batch import clearing at airport customs.",
  },
  {
    id: "exp-3",
    expenseNo: "EXP-2026-043",
    title: "Field Installation Motorcycle Fuel & Conveyance Allowance",
    category: "Field Conveyance",
    amount: 3200,
    payee: "Installation Team (4 Technicians)",
    paymentMethod: "bKash",
    date: "2026-06-24",
    referenceNo: "CONVEYANCE-WK3",
    status: "approved",
    notes: "Fuel allowance for Banani, Mirpur and Gazipur fleet installations.",
  },
  {
    id: "exp-4",
    expenseNo: "EXP-2026-044",
    title: "Google Maps Platform API & Live Geocoding Billing",
    category: "Cloud Server & Maps",
    amount: 5400,
    payee: "Google Cloud Platform",
    paymentMethod: "Credit Card",
    date: "2026-06-05",
    referenceNo: "GCP-INV-849201",
    status: "approved",
    notes: "Reverse geocoding and live road snap-to-roads API usage.",
  },
  {
    id: "exp-5",
    expenseNo: "EXP-2026-045",
    title: "Office Internet High-Speed Optical Fiber Line",
    category: "Office Operations",
    amount: 2500,
    payee: "Link3 Technologies Ltd",
    paymentMethod: "bKash",
    date: "2026-06-02",
    referenceNo: "LINK3-84729",
    status: "approved",
    notes: "Monthly office internet connection for GPS tracking monitoring room.",
  },
  {
    id: "exp-6",
    expenseNo: "EXP-2026-046",
    title: "Ultrasonic Fuel Sensor Calibration Equipment & Cables",
    category: "Hardware Procurement",
    amount: 4800,
    payee: "Dhaka Electronic Market (Stadium)",
    paymentMethod: "Cash",
    date: "2026-06-25",
    referenceNo: "CASH-REC-482",
    status: "pending",
    notes: "Awaiting approval from Operations Director.",
  },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpensesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<ExpenseItem["category"]>("SIM & IoT Data");
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formPayee, setFormPayee] = useState("");
  const [formMethod, setFormMethod] = useState<ExpenseItem["paymentMethod"]>("bKash");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formRef, setFormRef] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Statistics
  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const hardwareSum = expenses
      .filter((e) => e.category === "Hardware Procurement")
      .reduce((sum, e) => sum + e.amount, 0);
    const simSum = expenses
      .filter((e) => e.category === "SIM & IoT Data")
      .reduce((sum, e) => sum + e.amount, 0);
    const conveyanceSum = expenses
      .filter((e) => e.category === "Field Conveyance")
      .reduce((sum, e) => sum + e.amount, 0);

    return { totalExpenses, hardwareSum, simSum, conveyanceSum, count: expenses.length };
  }, [expenses]);

  // Filtered
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        e.expenseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.payee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.referenceNo && e.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = categoryFilter === "all" || e.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [expenses, searchQuery, categoryFilter]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (formAmount <= 0) {
      toast.error("Expense amount must be greater than zero");
      return;
    }

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      expenseNo: `EXP-2026-0${expenses.length + 41}`,
      title: formTitle,
      category: formCategory,
      amount: formAmount,
      payee: formPayee,
      paymentMethod: formMethod,
      date: formDate,
      referenceNo: formRef.trim() || undefined,
      status: "approved",
      notes: formNotes.trim() || undefined,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    toast.success(`Expense ${newExpense.expenseNo} recorded!`);
    setIsAddOpen(false);
  };

  const handleExportCSV = () => {
    const headers = "Expense No,Title,Category,Amount,Payee,Payment Method,Date,Reference,Status\n";
    const rows = filteredExpenses
      .map(
        (e) =>
          `"${e.expenseNo}","${e.title}","${e.category}",${e.amount},"${e.payee}","${e.paymentMethod}","${e.date}","${e.referenceNo || ""}","${e.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Expenses exported to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary-text">
            Expense Management
          </h1>
          <p className="text-xs text-secondary-text mt-0.5">
            Operational costs, hardware procurement, SIM data bundles, and field conveyance
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Record Expense
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card surface rounded-2xl p-5 border border-rose-200 dark:border-rose-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Total Expenses
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-border/40">
                <TrendingDown className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              {stats.count} recorded business expenditures
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-indigo-200 dark:border-indigo-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Hardware Stock Import
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.hardwareSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-border/40">
                <Cpu className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              GPS trackers & fuel sensors inventory
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-sky-200 dark:border-sky-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  SIM & IoT Data
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.simSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-border/40">
                <Wifi className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Telco telematics bulk data connectivity
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-amber-200 dark:border-amber-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Field Conveyance
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.conveyanceSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-border/40">
                <Truck className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Technician travel, tools & on-site wiring
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Filters */}
      <AnimatedContainer delay={0.1}>
        <div className="bg-card surface rounded-2xl p-4 border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              "all",
              "SIM & IoT Data",
              "Hardware Procurement",
              "Field Conveyance",
              "Cloud Server & Maps",
              "Office Operations",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-light-background/60 hover:bg-light-background text-secondary-text hover:text-primary-text border border-border/50"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
            <div className="relative grow max-w-md">
              <Search className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search expense description, payee, or receipt reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-light-background/60 border border-border text-xs text-primary-text placeholder:text-secondary-text focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="text-xs text-secondary-text font-medium">
              Showing {filteredExpenses.length} of {expenses.length} entries
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Table */}
      <AnimatedContainer delay={0.15}>
        <div className="bg-card surface rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-light-background/40 text-secondary-text uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Expense #</th>
                  <th className="py-3 px-4">Description & Notes</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Payee / Vendor</th>
                  <th className="py-3 px-4">Date & Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-secondary-text">
                      No expenses found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((e) => (
                    <tr key={e.id} className="hover:bg-light-background/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-rose-600 dark:text-rose-400">
                        {e.expenseNo}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-primary-text">{e.title}</div>
                        {e.notes && (
                          <div className="text-[11px] text-secondary-text line-clamp-1">
                            {e.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-light-background border border-border text-[11px] font-medium text-secondary-text">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-primary-text">
                        {e.payee}
                      </td>
                      <td className="py-3.5 px-4 text-secondary-text">
                        <div>{e.date}</div>
                        <div className="text-[11px]">{e.paymentMethod}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-primary-text">
                        Tk,{e.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            e.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          }`}
                        >
                          {e.status === "approved" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedContainer>

      {/* Record Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-border/40">
                  <Receipt className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-primary-text">Record Business Expense</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Expense Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50x M2M SIM Connectivity Renewal"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ExpenseItem["category"])}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  >
                    <option value="SIM & IoT Data">SIM & IoT Data</option>
                    <option value="Hardware Procurement">Hardware Procurement</option>
                    <option value="Field Conveyance">Field Conveyance</option>
                    <option value="Cloud Server & Maps">Cloud Server & Maps</option>
                    <option value="Office Operations">Office Operations</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Amount (Tk) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formAmount || ""}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-rose-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Payee / Vendor *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grameenphone / Robi"
                    value={formPayee}
                    onChange={(e) => setFormPayee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Payment Method *
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as ExpenseItem["paymentMethod"])}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Voucher / Slip Ref #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GP-CORP-4821"
                    value={formRef}
                    onChange={(e) => setFormRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Internal Remarks
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text resize-none"
                  placeholder="Optional notes or procurement memo..."
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
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}