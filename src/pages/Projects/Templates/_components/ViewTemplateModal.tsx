import React from "react";
import {
  X,
  Clock,
  Layers,
  CheckCircle2,
  Wrench,
  Cpu,
  Truck,
  DollarSign,
} from "lucide-react";
import { ProjectTemplate } from "../projectTemplatesData";

interface ViewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ProjectTemplate | null;
  onUseTemplate: (template: ProjectTemplate) => void;
}

export const ViewTemplateModal: React.FC<ViewTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}) => {
  if (!isOpen || !template) return null;

  const totalTasks = template.phases.reduce((acc, p) => acc + p.tasks.length, 0);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Lead Engineer":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "Field Wiring Tech":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Calibration Specialist":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "QA Tech":
        return "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-card surface rounded-2xl w-full max-w-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border bg-light-background/60">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {template.templateCode}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-light-background border border-border text-secondary-text">
                {template.category}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {template.status}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight mt-1">
              {template.name}
            </h2>
            <p className="text-xs text-secondary-text leading-relaxed">
              {template.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-card border border-transparent hover:border-border transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Spec Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 border-b border-border bg-light-background/30 text-xs">
          <div className="p-3 rounded-xl bg-card border border-border">
            <span className="text-secondary-text text-[11px] block flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-indigo-500" />
              Target Fleet Size
            </span>
            <span className="font-bold text-primary-text text-sm block mt-1">
              {template.targetVehiclesRange}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border">
            <span className="text-secondary-text text-[11px] block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Standard Duration
            </span>
            <span className="font-bold text-primary-text text-sm block mt-1">
              {template.estimatedTotalDays} Days ({template.estimatedDaysPerVehicle} d/veh)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border">
            <span className="text-secondary-text text-[11px] block flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              Estimated Budget
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block mt-1 font-mono">
              ৳{template.estimatedBudgetPerVehicle.toLocaleString()} / vehicle
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border">
            <span className="text-secondary-text text-[11px] block flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              Default Hardware
            </span>
            <span className="font-bold text-primary-text text-xs block mt-1 truncate">
              {template.defaultTrackerModel}
            </span>
          </div>
        </div>

        {/* Scrollable Content: Hardware List & Phase Roadmap */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* Hardware Bill of Materials */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary-text text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Required Bill of Materials (Per Vehicle)
              </h3>
              <span className="text-[11px] text-secondary-text">
                {template.requiredHardware.length} standard items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {template.requiredHardware.map((hw, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-light-background border border-border flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        hw.isMandatory ? "bg-indigo-500" : "bg-amber-400"
                      }`}
                    />
                    <span className="text-primary-text font-medium truncate text-xs">
                      {hw.itemName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-card border border-border font-mono text-[11px] font-semibold text-primary-text">
                      Qty: {hw.quantityPerVehicle}
                    </span>
                    {hw.isMandatory ? (
                      <span className="text-[10px] text-indigo-600 font-semibold uppercase">
                        Req
                      </span>
                    ) : (
                      <span className="text-[10px] text-secondary-text uppercase">
                        Opt
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sequential Phase Breakdown & Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary-text text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Standard Implementation Roadmap ({template.phases.length} Phases, {totalTasks} Tasks)
              </h3>
            </div>

            <div className="space-y-4">
              {template.phases.map((phase) => (
                <div
                  key={phase.id}
                  className="border border-border rounded-xl overflow-hidden bg-card shadow-2xs"
                >
                  {/* Phase Title Bar */}
                  <div className="p-3.5 bg-light-background/80 border-b border-border flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {phase.phaseNumber}
                      </span>
                      <h4 className="font-bold text-primary-text text-xs sm:text-sm">
                        {phase.name}
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary-text px-2 py-0.5 rounded-md bg-card border border-border">
                      <Clock className="w-3 h-3 text-secondary-text" />
                      Est. {phase.estimatedDays} Days
                    </span>
                  </div>

                  {/* Task Items */}
                  <div className="divide-y divide-border">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-light-background/50 transition-colors"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              task.mandatory ? "text-indigo-600" : "text-secondary-text"
                            }`}
                          />
                          <div>
                            <span className="text-primary-text font-medium text-xs block">
                              {task.title}
                            </span>
                            <span className="text-[10px] text-secondary-text">
                              Est. {task.estimatedHours} hrs labor allocation
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRoleBadge(
                              task.roleRequired
                            )}`}
                          >
                            {task.roleRequired}
                          </span>
                          {task.mandatory && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-border bg-light-background/60 flex items-center justify-between gap-3">
          <div className="text-xs text-secondary-text hidden sm:block">
            Used across <strong className="text-primary-text">{template.usageCount}</strong> fleet rollouts to date
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-light-background text-secondary-text hover:text-primary-text transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onUseTemplate(template);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
