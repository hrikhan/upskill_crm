import React from "react";
import {
  Clock,
  Layers,
  Truck,
  Cpu,
  DollarSign,
  Copy,
  Trash2,
  Eye,
  ArrowRight,
} from "lucide-react";
import { ProjectTemplate } from "../projectTemplatesData";

interface TemplateCardProps {
  template: ProjectTemplate;
  onViewDetails: (template: ProjectTemplate) => void;
  onUseTemplate: (template: ProjectTemplate) => void;
  onDuplicate: (template: ProjectTemplate) => void;
  onDelete: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onViewDetails,
  onUseTemplate,
  onDuplicate,
  onDelete,
}) => {
  const totalTasks = template.phases.reduce((acc, p) => acc + p.tasks.length, 0);

  const getCategoryTheme = (cat: ProjectTemplate["category"]) => {
    switch (cat) {
      case "Commercial Haulers":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "Motorbike Delivery":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800";
      case "Fuel & Telematics":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Cold Chain & Temperature":
        return "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
      default:
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    }
  };

  return (
    <div className="bg-card surface rounded-2xl border border-border hover:border-indigo-400/50 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Header Row */}
        <div className="p-5 pb-3 border-b border-border/60 bg-light-background/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-primary-text shadow-2xs">
                {template.templateCode}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getCategoryTheme(
                  template.category
                )}`}
              >
                {template.category}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDuplicate(template)}
                title="Duplicate Template"
                className="p-1 rounded-md text-secondary-text hover:text-primary-text hover:bg-card transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(template.id)}
                title="Delete Template"
                className="p-1 rounded-md text-secondary-text hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h3 className="font-bold text-base text-primary-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {template.name}
          </h3>
          <p className="text-xs text-secondary-text line-clamp-2 mt-1 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 p-4 text-xs border-b border-border/60 bg-card">
          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <Truck className="w-3 h-3 text-indigo-500" />
              Target Fleet
            </span>
            <span className="font-bold text-primary-text text-xs block mt-0.5 truncate">
              {template.targetVehiclesRange}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <Clock className="w-3 h-3 text-amber-500" />
              Duration
            </span>
            <span className="font-bold text-primary-text text-xs block mt-0.5 truncate">
              {template.estimatedTotalDays} Days ({template.estimatedDaysPerVehicle} d/veh)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <Cpu className="w-3 h-3 text-sky-500" />
              Standard GPS
            </span>
            <span className="font-bold text-primary-text text-xs block mt-0.5 truncate">
              {template.defaultTrackerModel}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              Est. Unit Cost
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs font-mono block mt-0.5 truncate">
              ৳{template.estimatedBudgetPerVehicle.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Phases & Hardware Tags */}
        <div className="p-4 space-y-3 text-xs bg-light-background/20">
          <div className="flex items-center justify-between text-[11px] text-secondary-text">
            <span className="flex items-center gap-1 font-medium text-primary-text">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              {template.phases.length} Phases • {totalTasks} Tasks
            </span>
            <span className="text-[10px] text-secondary-text">
              Used {template.usageCount} times
            </span>
          </div>

          {/* Phase Sequence Dots */}
          <div className="flex items-center gap-1.5">
            {template.phases.map((p, idx) => (
              <div
                key={p.id}
                title={`${p.name} (~${p.estimatedDays} days)`}
                className="flex-1 h-1.5 rounded-full bg-indigo-500/20 overflow-hidden cursor-help"
              >
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${((idx + 1) / template.phases.length) * 100}%` }}
                />
              </div>
            ))}
          </div>

          {/* Hardware Chips Preview */}
          <div className="flex items-center gap-1 flex-wrap pt-0.5">
            {template.requiredHardware.slice(0, 2).map((hw, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-card border border-border text-secondary-text truncate max-w-[150px]"
              >
                {hw.itemName}
              </span>
            ))}
            {template.requiredHardware.length > 2 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-light-background text-secondary-text font-medium">
                +{template.requiredHardware.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-4 pt-3 border-t border-border bg-light-background/60 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(template)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-light-background text-secondary-text hover:text-primary-text transition flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          Roadmap
        </button>

        <button
          type="button"
          onClick={() => onUseTemplate(template)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>Use Template</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
