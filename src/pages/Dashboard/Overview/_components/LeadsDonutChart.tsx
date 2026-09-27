import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface LeadStage {
  id: string;
  name: string;
  count: number;
  badgeClass: string;
}

const initialStages: LeadStage[] = [
  {
    id: "new",
    name: "New",
    count: 14,
    badgeClass: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  },
  {
    id: "appointment",
    name: "Appointment collected",
    count: 8,
    badgeClass: "bg-[#f97316] text-white",
  },
  {
    id: "demo",
    name: "Demonstrations Done",
    count: 12,
    badgeClass: "bg-[#06b6d4] text-white",
  },
  {
    id: "followup",
    name: "Need Followup",
    count: 6,
    badgeClass: "bg-[#64748b] text-white",
  },
  {
    id: "proposal",
    name: "Proposal Sent",
    count: 10,
    badgeClass: "bg-[#84cc16] text-slate-950 font-bold",
  },
  {
    id: "implemented",
    name: "Implemented",
    count: 18,
    badgeClass: "bg-[#10b981] text-white",
  },
];

const donutData = [
  { name: "Active Pipeline", value: 34, color: "#06b6d4" },
  { name: "Converted & Won", value: 34, color: "#2563eb" },
];

export interface LeadsDonutChartProps {
  totalCount?: number;
  stages?: LeadStage[];
  donutSegments?: { name: string; value: number; color: string }[];
}

export function LeadsDonutChart({
  totalCount,
  stages = initialStages,
  donutSegments = donutData,
}: LeadsDonutChartProps) {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const totalLeads = totalCount !== undefined ? totalCount : stages.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="bg-card surface rounded-xl p-5 border border-border shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-primary-text">
            Leads Funnel
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Stage conversion
          </p>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-light-background text-secondary-text">
          This Year
        </span>
      </div>

      {/* Donut Chart with Centered Info */}
      <div className="relative w-full h-[200px] flex items-center justify-center my-1 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutSegments}
              innerRadius={65}
              outerRadius={86}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
            >
              {donutSegments.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-border rounded-lg p-2 shadow-md text-xs">
                      <span className="font-semibold text-primary-text">
                        {payload[0].name}: {payload[0].value} leads
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Labels */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold tracking-tight text-primary-text">
            {totalLeads}
          </span>
          <span className="text-[10px] font-medium text-secondary-text uppercase tracking-wider">
            Total Leads
          </span>
        </div>
      </div>

      {/* Stage Legend Badges with Balanced Font and Spacing */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 border-t border-border">
        {stages.map((stage) => {
          const isSelected = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() =>
                setActiveStage((prev) => (prev === stage.id ? null : stage.id))
              }
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer select-none shadow-xs ${
                stage.badgeClass
              } ${
                isSelected
                  ? "ring-1 ring-offset-1 ring-blue-500 scale-105"
                  : "hover:opacity-90"
              }`}
            >
              {stage.name} ({stage.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
