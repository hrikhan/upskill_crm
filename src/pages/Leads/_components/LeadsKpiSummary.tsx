import React from "react";
import { Lead, STAGE_CONFIGS } from "../types";

interface LeadsKpiSummaryProps {
  leads: Lead[];
  onSelectStageFilter?: (stage: string | null) => void;
  selectedStage?: string | null;
}

export const LeadsKpiSummary: React.FC<LeadsKpiSummaryProps> = ({
  leads,
  onSelectStageFilter,
  selectedStage,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {STAGE_CONFIGS.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage.id);
        const count = stageLeads.length;
        const totalValue = stageLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
        const isSelected = selectedStage === stage.id;

        return (
          <div
            key={stage.id}
            onClick={() =>
              onSelectStageFilter &&
              onSelectStageFilter(isSelected ? null : stage.id)
            }
            className={`bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all duration-200 cursor-pointer hover:shadow-md relative overflow-hidden ${
              isSelected ? "ring-2 ring-primary-brand shadow-md" : ""
            }`}
          >
            {/* Value */}
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Tk,{totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>

            {/* Stage title & count */}
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 truncate">
              {stage.title} - {count}
            </p>

            {/* Colored bottom accent line matching demo image */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
              style={{ backgroundColor: stage.borderColor }}
            />
          </div>
        );
      })}
    </div>
  );
};
