import React, { useState, useEffect } from "react";
import {
  X,
  Truck,
  Sparkles,
} from "lucide-react";
import { ContractTemplate } from "../contractTemplatesData";

interface UseContractTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ContractTemplate | null;
  onContractCreated: (contractData: {
    title: string;
    clientName: string;
    contactPerson: string;
    contractType: "Fleet AMC (Annual)" | "SLA Telematics Service" | "Hardware Lease & Maintenance" | "Custom SLA";
    unitsCovered: number;
    contractValue: number;
    startDate: string;
    endDate: string;
    autoRenew: boolean;
    templateCode: string;
  }) => void;
}

export const UseContractTemplateModal: React.FC<UseContractTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onContractCreated,
}) => {
  const [clientName, setClientName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [unitsCovered, setUnitsCovered] = useState(30);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [autoRenew, setAutoRenew] = useState(true);

  useEffect(() => {
    if (template) {
      setClientName("");
      setContactPerson("");
      setUnitsCovered(30);
      setStartDate(new Date().toISOString().split("T")[0]);
      setAutoRenew(true);
    }
  }, [template]);

  if (!isOpen || !template) return null;

  // Calculate End Date
  const start = new Date(startDate || new Date());
  const end = new Date(start);
  end.setMonth(end.getMonth() + template.standardDurationMonths);
  const endDateFormatted = end.toISOString().split("T")[0];

  // Calculate Total Contract Value
  const totalValue =
    unitsCovered *
    template.baseRatePerUnitMonth *
    template.standardDurationMonths;

  const defaultTitle = clientName.trim()
    ? `${clientName.trim()} ${unitsCovered} Units ${template.contractType} (${template.templateCode})`
    : `${template.title} - New Client`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    onContractCreated({
      title: defaultTitle,
      clientName: clientName.trim(),
      contactPerson: contactPerson.trim() || "Operations Lead",
      contractType: template.contractType,
      unitsCovered: Number(unitsCovered),
      contractValue: totalValue,
      startDate,
      endDate: endDateFormatted,
      autoRenew,
      templateCode: template.templateCode,
    });

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
                {template.templateCode}
              </span>
              <span className="text-xs text-secondary-text font-medium">
                Contract Instantiation
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight">
              Generate Service Contract
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              Bind standard SLA legal clauses and billing schedules to a client agreement.
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
          {/* Active Template Banner */}
          <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-700 dark:text-purple-400 block">
                Selected Legal Model
              </span>
              <span className="text-xs font-bold text-primary-text truncate block mt-0.5">
                {template.title}
              </span>
              <span className="text-[11px] text-secondary-text mt-0.5 block">
                {template.standardDurationMonths} Mo • {template.slaUptimeGuarantee} • {template.slaResponseHours}h On-Site SLA
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-secondary-text block">Monthly Unit Rate</span>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                ৳{template.baseRatePerUnitMonth} / unit / mo
              </span>
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Client Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Apex Logistics Ltd"
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Authorized Signatory / Contact
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Tanvir Hasan (Fleet Director)"
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>
          </div>

          {/* Units Covered Slider */}
          <div className="space-y-2 p-3.5 rounded-xl bg-light-background border border-border">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-primary-text flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-purple-600" />
                Fleet Units Covered Under Agreement
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-card border border-border text-primary-text">
                {unitsCovered} Vehicles
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="200"
              value={unitsCovered}
              onChange={(e) => setUnitsCovered(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />

            <div className="flex items-center justify-between text-[11px] text-secondary-text pt-1">
              <span>Billing: {template.standardBillingCycle}</span>
              <span>Calculation: {unitsCovered} × ৳{template.baseRatePerUnitMonth} × {template.standardDurationMonths} mo</span>
            </div>
          </div>

          {/* Dates & Auto-Renew */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Contract Effective Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-secondary-text block">
                Calculated Expiry Date ({template.standardDurationMonths} Months)
              </label>
              <input
                type="date"
                disabled
                value={endDateFormatted}
                className="w-full px-3 py-2 rounded-xl bg-card border border-border text-secondary-text text-xs cursor-not-allowed"
              />
            </div>
          </div>

          {/* Auto-Renew Option */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
            <div className="space-y-0.5">
              <span className="font-semibold text-primary-text block">
                Automatic Annual Renewal Clause
              </span>
              <span className="text-[11px] text-secondary-text block">
                Auto-extends contract for another year unless 30-day notice is served.
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoRenew}
              onChange={(e) => setAutoRenew(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-border cursor-pointer"
            />
          </div>

          {/* Title Preview */}
          <div className="p-3 rounded-xl bg-light-background border border-border space-y-1">
            <span className="text-[10px] uppercase font-semibold text-secondary-text block">
              Contract Agreement Header Preview
            </span>
            <span className="text-xs font-semibold text-primary-text block">
              {defaultTitle}
            </span>
          </div>

          {/* Total Value Highlight */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 block">
                Total Agreement Monetary Value
              </span>
              <span className="text-xs text-secondary-text">
                Full tenure ({template.standardDurationMonths} months) revenue across {unitsCovered} fleet units
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              ৳{totalValue.toLocaleString()}
            </span>
          </div>

          {/* Footer Actions */}
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
              disabled={!clientName.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Agreement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
