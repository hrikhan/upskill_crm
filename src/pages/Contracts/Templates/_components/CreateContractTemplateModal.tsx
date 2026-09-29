import React, { useState } from "react";
import {
  X,
  FilePlus,
} from "lucide-react";
import { ContractTemplate } from "../contractTemplatesData";

interface CreateContractTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (newTemplate: ContractTemplate) => void;
  existingCount: number;
}

export const CreateContractTemplateModal: React.FC<CreateContractTemplateModalProps> = ({
  isOpen,
  onClose,
  onTemplateCreated,
  existingCount,
}) => {
  const [title, setTitle] = useState("");
  const [templateCode, setTemplateCode] = useState(`TPL-CTR-0${existingCount + 1}`);
  const [contractType, setContractType] = useState<ContractTemplate["contractType"]>(
    "Fleet AMC (Annual)"
  );
  const [description, setDescription] = useState("");
  const [standardDurationMonths, setStandardDurationMonths] = useState(12);
  const [standardBillingCycle, setStandardBillingCycle] =
    useState<ContractTemplate["standardBillingCycle"]>("Annual Advance");
  const [baseRatePerUnitMonth, setBaseRatePerUnitMonth] = useState(350);
  const [slaResponseHours, setSlaResponseHours] = useState(8);
  const [slaUptimeGuarantee, setSlaUptimeGuarantee] = useState("99.5% Uptime");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTemplate: ContractTemplate = {
      id: `tpl-ctr-${Date.now()}`,
      templateCode: templateCode.trim() || `TPL-CTR-0${existingCount + 1}`,
      title: title.trim(),
      contractType,
      description:
        description.trim() ||
        "Standardized telematics service agreement and fleet maintenance guidelines with guaranteed technician response windows.",
      standardDurationMonths: Number(standardDurationMonths),
      standardBillingCycle,
      baseRatePerUnitMonth: Number(baseRatePerUnitMonth),
      slaResponseHours: Number(slaResponseHours),
      slaUptimeGuarantee,
      status: "Active",
      usageCount: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      paymentTerms: `${standardBillingCycle} billing via Bank Transfer or bKash Merchant`,
      includedServices: [
        "24/7 Live Web & App Tracking Portal Access",
        "4G M2M SIM Connectivity with Automated Data Renewal",
        "On-Site Field Technician Support for Hardware Issues",
        "Quarterly Fleet Health & Tampering Audit Report",
      ],
      excludedServices: [
        "Damage from vehicle fire, flood, or accident collision",
        "Unauthorized electrical splicing by non-certified workshops",
      ],
      clauses: [
        {
          id: `c-${Date.now()}-1`,
          clauseNumber: "1.0",
          heading: "Scope of Telematics Maintenance",
          body: "The Service Provider shall deliver uninterrupted GPS tracking cloud server access, device health audits, and preventative servicing for all contracted fleet units.",
          isMandatory: true,
        },
        {
          id: `c-${Date.now()}-2`,
          clauseNumber: "2.0",
          heading: "Field Response & Technician Dispatch",
          body: `Certified technicians will be dispatched to inspect and repair faulty GPS hardware within ${slaResponseHours} business hours of ticket escalation.`,
          isMandatory: true,
        },
        {
          id: `c-${Date.now()}-3`,
          clauseNumber: "3.0",
          heading: "Uptime & Service Level Commitment",
          body: `The system shall maintain a minimum of ${slaUptimeGuarantee} availability throughout the contracted tenure.`,
          isMandatory: true,
        },
        {
          id: `c-${Date.now()}-4`,
          clauseNumber: "4.0",
          heading: "Settlement & Payment Terms",
          body: "Invoices are subject to Net 15 days settlement terms. Late payments exceeding 30 calendar days may result in temporary telematics portal suspension.",
          isMandatory: true,
        },
      ],
    };

    onTemplateCreated(newTemplate);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-card surface rounded-2xl w-full max-w-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border bg-light-background/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                New Legal Agreement
              </span>
              <span className="text-xs text-secondary-text font-medium">
                Standard Contract Template
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight">
              Create Contract Template
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              Standardize legal articles, SLA uptime, and billing rates for customer contracts.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Contract Template Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Multi-Year Heavy Hauler Maintenance AMC"
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Template Code
              </label>
              <input
                type="text"
                required
                value={templateCode}
                onChange={(e) => setTemplateCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Contract Category / Type
              </label>
              <select
                value={contractType}
                onChange={(e) =>
                  setContractType(e.target.value as ContractTemplate["contractType"])
                }
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="Fleet AMC (Annual)">Fleet AMC (Annual)</option>
                <option value="SLA Telematics Service">SLA Telematics Service</option>
                <option value="Hardware Lease & Maintenance">Hardware Lease & Maintenance</option>
                <option value="Custom SLA">Custom SLA</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Standard Billing Cycle
              </label>
              <select
                value={standardBillingCycle}
                onChange={(e) =>
                  setStandardBillingCycle(
                    e.target.value as ContractTemplate["standardBillingCycle"]
                  )
                }
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="Annual Advance">Annual Advance</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Monthly Recurring">Monthly Recurring</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Duration (Months)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={standardDurationMonths}
                onChange={(e) => setStandardDurationMonths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Base Rate / Unit / Mo (৳)
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={baseRatePerUnitMonth}
                onChange={(e) => setBaseRatePerUnitMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                On-Site SLA (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="48"
                value={slaResponseHours}
                onChange={(e) => setSlaResponseHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-primary-text block">
              SLA Uptime Guarantee
            </label>
            <input
              type="text"
              value={slaUptimeGuarantee}
              onChange={(e) => setSlaUptimeGuarantee(e.target.value)}
              placeholder="e.g. 99.9% Uptime"
              className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-primary-text block">
              Agreement Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of contract scope, key customer entitlements, and service coverage..."
              className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs resize-none"
            />
          </div>

          {/* Pre-Loaded Clauses Note */}
          <div className="p-3 rounded-xl bg-light-background border border-border text-[11px] text-secondary-text">
            <strong className="text-primary-text block mb-0.5">Pre-configured Legal Articles:</strong>
            Standard Scope of Work, Field Technician Dispatch SLA, Uptime Guarantee, and Settlement terms are automatically generated into 4 numbered clauses.
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-border bg-card hover:bg-light-background text-secondary-text hover:text-primary-text transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              Save Contract Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
