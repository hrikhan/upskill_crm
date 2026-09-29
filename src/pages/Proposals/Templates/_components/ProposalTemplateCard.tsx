import React from "react";
import {
  Clock,
  DollarSign,
  Copy,
  Trash2,
  Eye,
  ArrowRight,
  Truck,
  CheckCircle2,
  Sparkles,
  Percent,
  Layers,
} from "lucide-react";
import { ProposalTemplate } from "../proposalTemplatesData";

interface ProposalTemplateCardProps {
  template: ProposalTemplate;
  onViewDetails: (template: ProposalTemplate) => void;
  onUseTemplate: (template: ProposalTemplate) => void;
  onDuplicate: (template: ProposalTemplate) => void;
  onDelete: (templateId: string) => void;
}

export const ProposalTemplateCard: React.FC<ProposalTemplateCardProps> = ({
  template,
  onViewDetails,
  onUseTemplate,
  onDuplicate,
  onDelete,
}) => {
  const getCategoryBadge = (category: ProposalTemplate["category"]) => {
    switch (category) {
      case "Enterprise Fleet":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800";
      case "Cold Chain":
        return "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
      case "Fuel Telematics":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Plug & Play":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Heavy Asset":
        return "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "Video Telematics":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-200 dark:border-slate-800";
    }
  };

  return (
    <div className="bg-card surface rounded-2xl border border-border hover:border-sky-400/50 dark:hover:border-sky-500/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Header Row */}
        <div className="p-5 pb-3 border-b border-border/60 bg-light-background/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-primary-text shadow-2xs">
                {template.templateCode}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getCategoryBadge(
                  template.category
                )}`}
              >
                {template.category}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Truck className="w-3 h-3" />
                {template.recommendedFleetSize}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDuplicate(template)}
                title="Duplicate Proposal Template"
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

          <h3 className="font-bold text-base text-primary-text group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
            {template.title}
          </h3>
          <p className="text-xs text-secondary-text line-clamp-2 mt-1 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 p-4 text-xs border-b border-border/60 bg-card">
          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              Unit Package Rate
            </span>
            <span className="font-bold text-sm text-primary-text font-mono mt-0.5 block">
              ৳{template.estimatedPerVehicleCost.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <Clock className="w-3 h-3 text-sky-500" />
              Turnaround Time
            </span>
            <span className="font-semibold text-xs text-primary-text mt-0.5 block truncate">
              {template.turnaroundTime}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <Percent className="w-3 h-3 text-indigo-500" />
              Volume Discount
            </span>
            <span className="font-semibold text-xs text-primary-text mt-0.5 block">
              Up to {template.standardDiscountPercent}% Off
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <Layers className="w-3 h-3 text-purple-500" />
              Schedule Scope
            </span>
            <span className="font-semibold text-xs text-primary-text mt-0.5 block">
              {template.items.length} Bundled Items
            </span>
          </div>
        </div>

        {/* Included Perks / Features preview */}
        <div className="p-4 bg-light-background/20 space-y-1.5">
          <p className="text-[10px] font-semibold text-secondary-text uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Standard Deliverables
          </p>
          <div className="space-y-1">
            {template.includedPerks.slice(0, 2).map((perk, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs text-secondary-text truncate"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{perk}</span>
              </div>
            ))}
            {template.includedPerks.length > 2 && (
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium block pl-4">
                +{template.includedPerks.length - 2} more included benefits
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-3 border-t border-border bg-card flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-light-background text-secondary-text font-medium border border-border/60">
            {template.usageCount} proposals issued
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(template)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-light-background hover:bg-card border border-border text-primary-text text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => onUseTemplate(template)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Use Template</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
