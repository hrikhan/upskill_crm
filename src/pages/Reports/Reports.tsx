import React, { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Download,
  Filter,
  Layers,
  LineChart,
  PieChart as PieIcon,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Line,
  ComposedChart,
} from "recharts";
import { COMPANY_CONFIG } from "@/config/companyConfig";

// Monthly financial trajectory (2026)
const monthlyFinancials = [
  { month: "Jan", revenue: 165000, expenses: 54000, profit: 111000, subscriptions: 82000 },
  { month: "Feb", revenue: 182000, expenses: 61000, profit: 121000, subscriptions: 91000 },
  { month: "Mar", revenue: 210000, expenses: 68000, profit: 142000, subscriptions: 104000 },
  { month: "Apr", revenue: 195000, expenses: 65000, profit: 130000, subscriptions: 112000 },
  { month: "May", revenue: 240000, expenses: 74000, profit: 166000, subscriptions: 125000 },
  { month: "Jun", revenue: 275000, expenses: 82000, profit: 193000, subscriptions: 138000 },
  { month: "Jul", revenue: 310000, expenses: 89000, profit: 221000, subscriptions: 154000 },
  { month: "Aug", revenue: 345000, expenses: 95000, profit: 250000, subscriptions: 172000 },
  { month: "Sep", revenue: 388000, expenses: 102000, profit: 286000, subscriptions: 192000 },
];

// GPS Device Sales by Model
const deviceSalesDistribution = [
  { name: "Concox GT06N Pro", value: 45, units: 315, color: "#4f46e5" },
  { name: "Teltonika FMB920", value: 30, units: 210, color: "#06b6d4" },
  { name: "SinoTrack ST-901 Mini", value: 15, units: 105, color: "#10b981" },
  { name: "OBD Plug & Play Tracker", value: 10, units: 70, color: "#f59e0b" },
];

// Payment Collection by Channel
const paymentMethodsBreakdown = [
  { name: "bKash Merchant", amount: 1125000, percentage: 58, color: "#e11d48" },
  { name: "Bank EFT / Cheque", amount: 620000, percentage: 32, color: "#2563eb" },
  { name: "Cash on Delivery / Install", amount: 135000, percentage: 7, color: "#16a34a" },
  { name: "Nagad Merchant", amount: 58000, percentage: 3, color: "#d97706" },
];

// Top Fleet Clients by Lifetime Revenue
const topFleetClients = [
  {
    client: "Apex Logistics Ltd",
    contact: "Tanvir Hasan",
    units: 64,
    monthlyBilling: 22400,
    totalSpent: 412000,
    status: "Active Fleet",
  },
  {
    client: "Pathao Express Fleet",
    contact: "Farhan Ahmed",
    units: 110,
    monthlyBilling: 38500,
    totalSpent: 685000,
    status: "Active Fleet",
  },
  {
    client: "Walton Distribution Haulers",
    contact: "Engr. Mahmudul Hasan",
    units: 85,
    monthlyBilling: 29750,
    totalSpent: 520000,
    status: "Active Fleet",
  },
  {
    client: "Shun Shing Edible Oil Bulk",
    contact: "Shahriar Kabir",
    units: 35,
    monthlyBilling: 12250,
    totalSpent: 245000,
    status: "Active Fleet",
  },
  {
    client: "Bashundhara ReadyMix Fleet",
    contact: "Tariqul Islam",
    units: 42,
    monthlyBilling: 14700,
    totalSpent: 290000,
    status: "Active Fleet",
  },
];

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState("2026-YTD");
  const [selectedReportType, setSelectedReportType] = useState<"financial" | "hardware" | "clients">("financial");

  const totalGrossRevenue = monthlyFinancials.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalExpenses = monthlyFinancials.reduce((acc, curr) => acc + curr.expenses, 0);
  const totalNetProfit = totalGrossRevenue - totalExpenses;
  const currentMrr = monthlyFinancials[monthlyFinancials.length - 1].subscriptions;

  const handleExportCSV = () => {
    const headers = "Month,Revenue,Expenses,Profit,Subscriptions\n";
    const rows = monthlyFinancials
      .map((r) => `${r.month},${r.revenue},${r.expenses},${r.profit},${r.subscriptions}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Upskill_CRM_Report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header with Title and Global Report Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Executive Business Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reports & Revenue Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Financial trends, recurring subscription growth, and GPS tracker hardware metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent border-none outline-none font-semibold text-slate-900 cursor-pointer"
              >
                <option value="2026-YTD">Year to Date (2026)</option>
                <option value="Q3-2026">Q3 2026 (Jul - Sep)</option>
                <option value="Q2-2026">Q2 2026 (Apr - Jun)</option>
                <option value="Current-Month">This Month (Sep 2026)</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* 4 Primary Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Revenue</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              ৳{totalGrossRevenue.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24.8% vs last period</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recurring MRR</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-emerald-600 mt-2">
              ৳{currentMrr.toLocaleString()}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>720 active fleet units</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Operating Expenses</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              ৳{totalExpenses.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-2">Hardware imports + SIM data bundles</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Profit</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-purple-600 mt-2">
              ৳{totalNetProfit.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-2">
              <span>Margin:</span>
              <strong className="text-purple-700 font-bold">
                {((totalNetProfit / totalGrossRevenue) * 100).toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setSelectedReportType("financial")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              selectedReportType === "financial"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Monthly Revenue & Expenses Trend
          </button>
          <button
            onClick={() => setSelectedReportType("hardware")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              selectedReportType === "hardware"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            Hardware & Channels Breakdown
          </button>
          <button
            onClick={() => setSelectedReportType("clients")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              selectedReportType === "clients"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Truck className="w-4 h-4" />
            Top Fleet Accounts
          </button>
        </div>

        {/* Tab 1: Financial Trends */}
        {selectedReportType === "financial" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Monthly Cash Flow & Profit Trend</h3>
                <p className="text-xs text-slate-500">Revenue (Total Sales) vs Operational Expenses vs MRR</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" /> Revenue
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" /> Expenses
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" /> MRR Subscriptions
                </span>
              </div>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(val) => `৳${val / 1000}k`} />
                  <Tooltip
                    formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, ""]}
                    contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Revenue" barSize={28} />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expenses" barSize={28} />
                  <Line type="monotone" dataKey="subscriptions" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="MRR Subscriptions" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Hardware & Channels Breakdown */}
        {selectedReportType === "hardware" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">GPS Hardware Model Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of GPS trackers deployed across client vehicles</p>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceSalesDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={50}
                      paddingAngle={4}
                    >
                      {deviceSalesDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value}% of total fleet`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {deviceSalesDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-slate-800">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{item.units} units ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Payment Collections by Gateway</h3>
              <p className="text-xs text-slate-500">Distribution of customer payments received this year</p>
              
              <div className="space-y-4 pt-3">
                {paymentMethodsBreakdown.map((pm) => (
                  <div key={pm.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{pm.name}</span>
                      <span className="font-bold text-slate-900">৳{pm.amount.toLocaleString()} ({pm.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pm.percentage}%`, backgroundColor: pm.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                <p className="font-semibold text-slate-900 mb-1">Payment Channel Insight:</p>
                bKash Merchant remains the dominant channel with 58% of payments for monthly subscriptions, while corporate clients prefer Bank EFT for large hardware bulk orders.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Top Fleet Clients */}
        {selectedReportType === "clients" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Top Fleet Accounts by Lifetime Spend</h3>
              <p className="text-xs text-slate-500">Key enterprise clients generating recurring subscription revenue</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Client Company</th>
                    <th className="py-3.5 px-4">Contact Officer</th>
                    <th className="py-3.5 px-4 text-center">Active Trackers</th>
                    <th className="py-3.5 px-4 text-right">Monthly Subscription</th>
                    <th className="py-3.5 px-4 text-right">Lifetime Spent</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topFleetClients.map((client) => (
                    <tr key={client.client} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{client.client}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{client.contact}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                          {client.units} GPS Units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-900">
                        ৳{client.monthlyBilling.toLocaleString()} /mo
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        ৳{client.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CommonWrapper>
  );
};

export default Reports;