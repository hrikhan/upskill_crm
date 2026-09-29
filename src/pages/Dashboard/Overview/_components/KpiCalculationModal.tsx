import React, { useEffect } from "react";
import {
  X,
  Calculator,
  Clock,
  ArrowRight,
  Layers,
  UserCheck,
  Globe,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { KpiCalculationDetail } from "../kpiCalculationData";

interface KpiCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: KpiCalculationDetail | null;
}

export const KpiCalculationModal: React.FC<KpiCalculationModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-card surface rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg md:max-w-xl border-t sm:border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kpi-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Bottom Sheet Pull Handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-light-background/60">
          <div className="w-12 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border bg-light-background/60">
          <div className="flex items-center gap-2 flex-wrap min-w-0 pr-2">
            <h2
              id="kpi-modal-title"
              className="text-base sm:text-lg font-bold text-primary-text tracking-tight truncate"
            >
              {data.title}
            </h2>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${
                data.scope?.badgeClass || "bg-slate-100 text-slate-800"
              }`}
            >
              {data.scope?.isStaff ? (
                <UserCheck className="w-3 h-3 shrink-0" />
              ) : (
                <Globe className="w-3 h-3 shrink-0" />
              )}
              <span>
                {data.scope?.isStaff
                  ? `Personal (${data.scope.staffName || "You"})`
                  : "Enterprise Total"}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-card border border-transparent hover:border-border transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlighted Value Card */}
        <div className="p-4 sm:p-5 border-b border-border bg-sky-50/50 dark:bg-sky-950/20 flex items-center justify-between gap-3 sm:gap-4 min-w-0">
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider block">
              Current Active Value
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-700 dark:text-sky-300 tracking-tight truncate block">
              {data.currentValue}
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-card border border-border text-primary-text shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>{data.schedule.frequency.split(" / ")[0]}</span>
            </span>
            <span className="text-[10px] text-secondary-text block mt-1">
              Next: {data.schedule.nextCalculation.split(" or ")[0]}
            </span>
          </div>
        </div>

        {/* Scrollable Body: Clean & Highlighted */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs min-w-0">
          {/* Section 1: How It's Calculated */}
          <div className="space-y-2 min-w-0">
            <span className="font-semibold text-secondary-text uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              Calculation Formula
            </span>

            <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto whitespace-pre-wrap break-words">
              <code className="break-words whitespace-pre-wrap leading-relaxed">
                {data.formula.expression}
              </code>
            </div>

            {/* Highlighted Variable Chips */}
            {data.formula.variables.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {data.formula.variables.slice(0, 2).map((v, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-light-background border border-border min-w-0"
                  >
                    <span className="text-[10px] text-secondary-text block truncate">
                      {v.name}
                    </span>
                    <span className="font-bold text-primary-text text-sm block mt-0.5 truncate">
                      {v.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: When It Updates */}
          <div className="p-3 rounded-xl bg-light-background border border-border flex items-start gap-2.5 min-w-0">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0">
              <span className="font-semibold text-primary-text block truncate">
                Update Schedule & Triggers
              </span>
              <p className="text-secondary-text text-[11px] leading-relaxed break-words">
                {data.schedule.cronScheduleDescription}
              </p>
            </div>
          </div>

          {/* Section 3: Contributing Data (Clean Line Items) */}
          <div className="space-y-2 pt-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-secondary-text uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                Contributing Records ({data.contributingData.items.length})
              </span>
            </div>

            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card max-h-36 overflow-y-auto min-w-0">
              {data.contributingData.items.length === 0 ? (
                <div className="p-4 text-center text-secondary-text text-[11px]">
                  No matching records in the active period.
                </div>
              ) : (
                data.contributingData.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 hover:bg-light-background/60 transition flex items-center justify-between gap-2 text-xs min-w-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-primary-text truncate text-[11px]">
                        {item.primary}
                      </div>
                      {item.secondary && (
                        <div className="text-[10px] text-secondary-text truncate">
                          {item.secondary}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-right">
                      {item.amount && (
                        <span className="font-bold text-primary-text text-[11px] font-mono">
                          {item.amount}
                        </span>
                      )}
                      {item.status && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                            item.statusBadge || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 border-t border-border bg-light-background/60 flex items-center justify-between gap-3 shrink-0">
          <Link
            to={data.quickAction.path}
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition cursor-pointer"
          >
            <span>{data.quickAction.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-light-background text-secondary-text hover:text-primary-text transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
