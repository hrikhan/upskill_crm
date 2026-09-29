import React from "react";
import {
  X,
  Printer,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  DollarSign,
  Truck,
  Sparkles,
  Percent,
} from "lucide-react";
import { ProposalTemplate } from "../proposalTemplatesData";
import { toast } from "sonner";

interface ViewProposalTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ProposalTemplate | null;
  onUseTemplate: (template: ProposalTemplate) => void;
}

export const ViewProposalTemplateModal: React.FC<ViewProposalTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}) => {
  if (!isOpen || !template) return null;

  const handlePrint = () => {
    window.print();
    toast.info("Opening proposal template print preview...");
  };

  const getItemTypeBadge = (type: string) => {
    switch (type) {
      case "hardware":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800";
      case "installation":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "subscription":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "accessory":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-200 dark:border-slate-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card surface border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-light-background/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary-text">
                  {template.templateCode}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {template.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {template.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-primary-text line-clamp-1 mt-0.5">
                {template.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl text-secondary-text hover:text-primary-text hover:bg-card border border-border/60 transition cursor-pointer"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-secondary-text hover:text-primary-text hover:bg-card border border-border/60 transition cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* Executive Overview Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-200/50 dark:border-sky-800/40">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Commercial Scope & Positioning
            </p>
            <h3 className="text-lg font-bold text-primary-text mt-1">
              {template.title}
            </h3>
            <p className="text-xs sm:text-sm text-secondary-text mt-1.5 leading-relaxed">
              {template.description}
            </p>

            <div className="mt-3 pt-3 border-t border-sky-200/40 dark:border-sky-800/40 flex items-center gap-2 text-xs text-secondary-text">
              <span className="font-semibold text-primary-text">Target Audience:</span>
              <span>{template.targetAudience}</span>
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-light-background border border-border">
              <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                Est. Per Vehicle Rate
              </span>
              <span className="font-bold text-base text-primary-text font-mono mt-0.5 block">
                ৳{template.estimatedPerVehicleCost.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-light-background border border-border">
              <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
                <Percent className="w-3.5 h-3.5 text-indigo-500" />
                Volume Discount
              </span>
              <span className="font-bold text-sm text-primary-text mt-0.5 block">
                Up to {template.standardDiscountPercent}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-light-background border border-border">
              <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
                <Truck className="w-3.5 h-3.5 text-sky-500" />
                Optimal Fleet Scale
              </span>
              <span className="font-bold text-xs text-primary-text mt-0.5 block truncate">
                {template.recommendedFleetSize}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-light-background border border-border">
              <span className="text-[10px] text-secondary-text flex items-center gap-1 block">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                Turnaround SLA
              </span>
              <span className="font-bold text-xs text-primary-text mt-0.5 block truncate">
                {template.turnaroundTime}
              </span>
            </div>
          </div>

          {/* Bundled Bill of Materials / Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-primary-text flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-500" />
                <span>Bundled Bill of Materials & Services</span>
              </h4>
              <span className="text-xs text-secondary-text">
                {template.items.length} items configured
              </span>
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-light-background/80 border-b border-border text-secondary-text font-semibold">
                    <th className="py-2.5 px-4">Item / Solution Component</th>
                    <th className="py-2.5 px-3">Classification</th>
                    <th className="py-2.5 px-3 text-center">Default Qty / Unit</th>
                    <th className="py-2.5 px-4 text-right">Standard Rate</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {template.items.map((item) => (
                    <tr key={item.id} className="hover:bg-light-background/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-primary-text">{item.name}</p>
                        <p className="text-[11px] text-secondary-text mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border capitalize ${getItemTypeBadge(
                            item.type
                          )}`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-primary-text">
                        {item.defaultQuantityPerVehicle}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-primary-text">
                        ৳{item.defaultUnitPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.isOptional ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
                            Optional Addon
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                            Core Bundle
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scope of Work Phases */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-primary-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Standard Implementation Scope & Phased Milestones</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {template.scopeOfWork.map((phase, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-light-background border border-border/80 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {phase.phase}
                    </span>
                    <h5 className="font-bold text-xs text-primary-text mt-0.5 mb-2">
                      {phase.title}
                    </h5>
                    <ul className="space-y-1.5 text-[11px] text-secondary-text">
                      {phase.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5 leading-relaxed">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Included Perks & Commercial Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-light-background border border-border space-y-2">
              <h5 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                Value-Added Deliverables & Platform Perks
              </h5>
              <ul className="space-y-1.5 text-xs text-secondary-text">
                {template.includedPerks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-light-background border border-border space-y-2">
              <h5 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-1.5 text-secondary-text">
                <FileText className="w-3.5 h-3.5" />
                Standard Terms, Validity & Billing
              </h5>
              <div className="space-y-2 text-xs text-secondary-text">
                <p>
                  <strong className="text-primary-text">Quotation Validity:</strong>{" "}
                  {template.validityDays} Calendar Days
                </p>
                <p>
                  <strong className="text-primary-text">Payment Schedule:</strong>{" "}
                  {template.defaultPaymentTerms}
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-secondary-text/90">
                  {template.termsAndConditions.slice(0, 2).map((term, idx) => (
                    <li key={idx}>{term}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-light-background/60">
          <div className="text-xs text-secondary-text">
            <span>Last reviewed: {template.lastUpdated}</span>
            <span className="mx-2">•</span>
            <span>{template.usageCount} proposals created</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary-text hover:text-primary-text hover:bg-card border border-border/80 transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onUseTemplate(template);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <span>Use This Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
