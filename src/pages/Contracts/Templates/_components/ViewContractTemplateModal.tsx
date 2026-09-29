import React from "react";
import {
  X,
  FileCheck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  RotateCcw,
} from "lucide-react";
import { ContractTemplate } from "../contractTemplatesData";

interface ViewContractTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ContractTemplate | null;
  onUseTemplate: (template: ContractTemplate) => void;
}

export const ViewContractTemplateModal: React.FC<ViewContractTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}) => {
  if (!isOpen || !template) return null;

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
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {template.templateCode}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-light-background border border-border text-secondary-text">
                {template.contractType}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {template.slaUptimeGuarantee}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight mt-1">
              {template.title}
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

        {/* Specifications Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 border-b border-border bg-light-background/30 text-xs">
          <div className="p-3 rounded-xl bg-card border border-border">
            <span className="text-secondary-text text-[11px] block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              Standard Duration
            </span>
            <span className="font-bold text-primary-text text-sm block mt-1">
              {template.standardDurationMonths} Months ({template.standardBillingCycle})
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border">
            <span className="text-secondary-text text-[11px] block flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              Base AMC Rate
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block mt-1 font-mono">
              ৳{template.baseRatePerUnitMonth} / unit / mo
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border">
            <span className="text-secondary-text text-[11px] block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              On-Site Response SLA
            </span>
            <span className="font-bold text-primary-text text-sm block mt-1">
              {template.slaResponseHours} Hours Window
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border">
            <span className="text-secondary-text text-[11px] block flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-sky-500" />
              Uptime Guarantee
            </span>
            <span className="font-bold text-sky-600 dark:text-sky-400 text-sm block mt-1">
              {template.slaUptimeGuarantee}
            </span>
          </div>
        </div>

        {/* Scrollable Body: Legal Clauses & Services */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* Included & Excluded Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Included */}
            <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-2.5">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Included Services & Entitlements
              </h3>
              <ul className="space-y-1.5">
                {template.includedServices.map((inc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-secondary-text text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Excluded */}
            <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-2.5">
              <h3 className="font-semibold text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-amber-600" />
                Standard Exclusions & Limitations
              </h3>
              <ul className="space-y-1.5">
                {template.excludedServices.map((exc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-secondary-text text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Clauses */}
          <div className="space-y-3">
            <h3 className="font-semibold text-primary-text text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Standard Legal Clauses & Terms ({template.clauses.length} Articles)
            </h3>

            <div className="space-y-3">
              {template.clauses.map((clause) => (
                <div
                  key={clause.id}
                  className="p-3.5 rounded-xl bg-card border border-border space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400">
                      Article {clause.clauseNumber}: {clause.heading}
                    </span>
                    {clause.isMandatory && (
                      <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 px-1.5 py-0.5 rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-secondary-text text-xs leading-relaxed pt-1">
                    {clause.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Terms Banner */}
          <div className="p-3 rounded-xl bg-light-background border border-border flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-semibold text-secondary-text block">
                Standard Settlement Terms
              </span>
              <span className="text-xs font-medium text-primary-text block mt-0.5">
                {template.paymentTerms}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-border bg-light-background/60 flex items-center justify-between gap-3">
          <div className="text-xs text-secondary-text hidden sm:block">
            Spawned <strong className="text-primary-text">{template.usageCount}</strong> active customer contracts
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
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Generate Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
