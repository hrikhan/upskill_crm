import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface MonthlyDataPoint {
  month: number;
  monthName: string;
  income: number;
  expense: number;
}

const defaultMonthlyData: MonthlyDataPoint[] = [
  { month: 1, monthName: "Jan", income: 2000, expense: 0 },
  { month: 2, monthName: "Feb", income: 40, expense: 0 },
  { month: 3, monthName: "Mar", income: 0, expense: 0 },
  { month: 4, monthName: "Apr", income: 0, expense: 0 },
  { month: 5, monthName: "May", income: 0, expense: 0 },
  { month: 6, monthName: "Jun", income: 0, expense: 0 },
  { month: 7, monthName: "Jul", income: 0, expense: 0 },
  { month: 8, monthName: "Aug", income: 0, expense: 0 },
  { month: 9, monthName: "Sep", income: 0, expense: 0 },
  { month: 10, monthName: "Oct", income: 0, expense: 0 },
  { month: 11, monthName: "Nov", income: 0, expense: 0 },
  { month: 12, monthName: "Dec", income: 0, expense: 0 },
];

export interface IncomeExpenseChartProps {
  totalIncome?: number;
  totalExpenses?: number;
  periodLabel?: string;
  data?: MonthlyDataPoint[];
}

export function IncomeExpenseChart({
  totalIncome = 2000,
  totalExpenses = 0,
  periodLabel = "2026",
  data = defaultMonthlyData,
}: IncomeExpenseChartProps) {
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  return (
    <div className="bg-card surface rounded-xl p-5 border border-border shadow-xs flex flex-col justify-between h-full">
      {/* Header with Title and Legend/Filter Pills */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-primary-text">
            Income vs Expenses
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Cash inflow & expenditures
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowIncome((prev) => !prev)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-all cursor-pointer select-none flex items-center gap-1.5 shadow-xs ${
              showIncome
                ? "bg-teal-600 text-white"
                : "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-400 opacity-60"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Income
          </button>
          <button
            type="button"
            onClick={() => setShowExpense((prev) => !prev)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-all cursor-pointer select-none flex items-center gap-1.5 shadow-xs ${
              showExpense
                ? "bg-sky-600 text-white"
                : "bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400 opacity-60"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
            Expense
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[250px] min-w-0 select-none pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeFillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
              className="dark:stroke-slate-800/80"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              dy={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 2000]}
              ticks={[0, 500, 1000, 1500, 2000]}
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
              dx={-2}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-lg p-2.5 shadow-md text-xs">
                      <p className="font-semibold text-primary-text mb-1">
                        Month {label} ({data[Number(label) - 1]?.monthName || label})
                      </p>
                      {payload.map((item, idx) => (
                        <p
                          key={idx}
                          className="flex items-center justify-between gap-3 py-0.5"
                          style={{ color: item.color }}
                        >
                          <span className="font-medium capitalize">{item.name}:</span>
                          <span className="font-bold">
                            Tk,{Number(item.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {showIncome && (
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#0d9488"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeFillGradient)"
                activeDot={{ r: 5, fill: "#0d9488" }}
              />
            )}
            {showExpense && (
              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#0284c7" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Metrics Row with Balanced Compact Typography */}
      <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 mt-2">
        <div className="text-center p-2 rounded-lg bg-light-background">
          <span className="block text-base sm:text-lg font-bold tracking-tight text-primary-text">
            {periodLabel}
          </span>
          <span className="text-[10px] font-medium uppercase text-secondary-text block">
            Period
          </span>
        </div>
        <div className="text-center p-2 rounded-lg bg-teal-50/50 dark:bg-teal-950/20">
          <span className="block text-base sm:text-lg font-bold tracking-tight text-teal-600 dark:text-teal-400">
            Tk,{totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] font-medium uppercase text-teal-600/80 dark:text-teal-400/80 block">
            Income
          </span>
        </div>
        <div className="text-center p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/20">
          <span className="block text-base sm:text-lg font-bold tracking-tight text-sky-600 dark:text-sky-400">
            Tk,{totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] font-medium uppercase text-sky-600/80 dark:text-sky-400/80 block">
            Expenses
          </span>
        </div>
      </div>
    </div>
  );
}
