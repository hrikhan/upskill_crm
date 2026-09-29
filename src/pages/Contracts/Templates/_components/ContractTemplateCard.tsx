import React from "react";
import {
  Clock,
  ShieldCheck,
  DollarSign,
  Copy,
  Trash2,
  Eye,
  ArrowRight,
  RotateCcw,
  FileCheck,
} from "lucide-react";
import { ContractTemplate } from "../contractTemplatesData";

interface ContractTemplateCardProps {
  template: ContractTemplate;
  onViewDetails: (template: ContractTemplate) => void;
  onUseTemplate: (template: ContractTemplate) => void;
  onDuplicate: (template: ContractTemplate) => void;
  onDelete: (templateId: string) => void;
}

export const ContractTemplateCard: React.FC<ContractTemplateCardProps> = ({
  template,
  onViewDetails,
  onUseTemplate,
  onDuplicate,
  onDelete,
}) => {
  const getTypeBadge = (type: ContractTemplate["contractType"]) => {
    switch (type) {
      case "Fleet AMC (Annual)":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "SLA Telematics Service":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "Hardware Lease & Maintenance":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800";
      default:
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    }
  };

  return (
    <div className="bg-card surface rounded-2xl border border-border hover:border-purple-400/50 dark:hover:border-purple-500/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Header Row */}
        <div className="p-5 pb-3 border-b border-border/60 bg-light-background/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-primary-text shadow-2xs">
                {template.templateCode}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getTypeBadge(
                  template.contractType
                )}`}
              >
                {template.contractType}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {template.slaUptimeGuarantee}
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

          <h3 className="font-bold text-base text-primary-text group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
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
              <Clock className="w-3 h-3 text-purple-500" />
              Tenure
            </span>
            <span className="font-bold text-primary-text text-xs block mt-0.5 truncate">
              {template.standardDurationMonths} Months ({template.standardBillingCycle})
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              AMC Rate
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs font-mono block mt-0.5 truncate">
              ৳{template.baseRatePerUnitMonth} / unit / mo
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <ShieldCheck className="w-3 h-3 text-indigo-500" />
              On-Site SLA
            </span>
            <span className="font-bold text-primary-text text-xs block mt-0.5 truncate">
              {template.slaResponseHours}h Max Dispatch
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-light-background border border-border/80">
            <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
              <RotateCcw className="w-3 h-3 text-sky-500" />
              Uptime Target
            </span>
            <span className="font-bold text-sky-600 dark:text-sky-400 text-xs block mt-0.5 truncate">
              {template.slaUptimeGuarantee}
            </span>
          </div>
        </div>

        {/* Included Services Preview */}
        <div className="p-4 space-y-3 text-xs bg-light-background/20">
          <div className="flex items-center justify-between text-[11px] text-secondary-text">
            <span className="flex items-center gap-1 font-medium text-primary-text">
              <FileCheck className="w-3.5 h-3.5 text-purple-600" />
              {template.clauses.length} Articles • {template.includedServices.length} Entitlements
            </span>
            <span className="text-[10px] text-secondary-text">
              Used {template.usageCount} times
            </span>
          </div>

          {/* Included Services Tags */}
          <div className="flex items-center gap-1 flex-wrap pt-0.5">
            {template.includedServices.slice(0, 2).map((srv, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-card border border-border text-secondary-text truncate max-w-[170px]"
              >
                {srv}
              </span>
            ))}
            {template.includedServices.length > 2 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-light-background text-secondary-text font-medium">
                +{template.includedServices.length - 2} more
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
          Agreement
        </button>

        <button
          type="button"
          onClick={() => onUseTemplate(template)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>Generate Contract</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
