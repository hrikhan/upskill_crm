import React, { useState } from "react";
import {
  X,
  FilePlus,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  DollarSign,
  Truck,
  Clock,
  Percent,
} from "lucide-react";
import {
  ProposalTemplate,
  ProposalTemplateLineItem,
} from "../proposalTemplatesData";

interface CreateProposalTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (newTemplate: ProposalTemplate) => void;
  existingCount: number;
}

export const CreateProposalTemplateModal: React.FC<CreateProposalTemplateModalProps> = ({
  isOpen,
  onClose,
  onTemplateCreated,
  existingCount,
}) => {
  const [title, setTitle] = useState("");
  const [templateCode, setTemplateCode] = useState(
    `TPL-PROP-0${existingCount + 1}`
  );
  const [category, setCategory] = useState<ProposalTemplate["category"]>(
    "Enterprise Fleet"
  );
  const [targetAudience, setTargetAudience] = useState("");
  const [description, setDescription] = useState("");
  const [recommendedFleetSize, setRecommendedFleetSize] = useState("10 - 50 Vehicles");
  const [turnaroundTime, setTurnaroundTime] = useState("2-3 Business Days");
  const [validityDays, setValidityDays] = useState(30);
  const [standardDiscountPercent, setStandardDiscountPercent] = useState(10);
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState(
    "50% advance on PO confirmation, 50% upon deployment signoff"
  );

  // Line items state
  const [items, setItems] = useState<ProposalTemplateLineItem[]>([
    {
      id: "line-1",
      type: "hardware",
      name: "Standard 4G GPS Tracker Hardware",
      description: "IP65 water resistant, internal backup battery, engine cut relay support.",
      defaultUnitPrice: 3800,
      defaultQuantityPerVehicle: 1,
      isOptional: false,
    },
    {
      id: "line-2",
      type: "installation",
      name: "Concealed On-Site Dashboard Installation & Wiring",
      description: "Certified field technician labor and vehicle power fuse tap.",
      defaultUnitPrice: 900,
      defaultQuantityPerVehicle: 1,
      isOptional: false,
    },
    {
      id: "line-3",
      type: "subscription",
      name: "Annual Upskill Cloud Platform License & M2M SIM Connectivity",
      description: "12 months 4G telemetry server access, live mobile app, 90-day trip playback.",
      defaultUnitPrice: 1200,
      defaultQuantityPerVehicle: 1,
      isOptional: false,
    },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const newItem: ProposalTemplateLineItem = {
      id: `line-${Date.now()}`,
      type: "accessory",
      name: "New Addon Component",
      description: "Component specification and functional description.",
      defaultUnitPrice: 500,
      defaultQuantityPerVehicle: 1,
      isOptional: true,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof ProposalTemplateLineItem,
    value: any
  ) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  // Estimate per vehicle package cost
  const estimatedCost = items
    .filter((i) => !i.isOptional)
    .reduce(
      (sum, i) => sum + i.defaultUnitPrice * i.defaultQuantityPerVehicle,
      0
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTemplate: ProposalTemplate = {
      id: `tpl-prop-${Date.now()}`,
      templateCode: templateCode.trim() || `TPL-PROP-0${existingCount + 1}`,
      title: title.trim(),
      category,
      targetAudience:
        targetAudience.trim() || "Commercial fleets, logistics providers and corporate transport",
      description:
        description.trim() ||
        "Turnkey GPS tracking and fleet telematics solution tailored for commercial transport efficiency.",
      validityDays: Number(validityDays),
      defaultPaymentTerms:
        defaultPaymentTerms.trim() ||
        "50% advance on PO confirmation, 50% upon deployment signoff",
      standardDiscountPercent: Number(standardDiscountPercent),
      status: "Active",
      usageCount: 0,
      estimatedPerVehicleCost: estimatedCost,
      recommendedFleetSize,
      turnaroundTime,
      lastUpdated: new Date().toISOString().split("T")[0],
      items,
      scopeOfWork: [
        {
          phase: "Phase 1",
          title: "Fleet Site Audit & Scheduling",
          deliverables: [
            "Technical inspection of vehicle electrical systems and depot access schedule.",
          ],
        },
        {
          phase: "Phase 2",
          title: "Hardware Installation & Sensor Calibration",
          deliverables: [
            "Covert mounting of hardware and testing of remote engine immobilizers.",
          ],
        },
        {
          phase: "Phase 3",
          title: "Telemetry Provisioning & Dispatch Signoff",
          deliverables: [
            "Portal credentials onboarding, vehicle grouping, and live telemetry test.",
          ],
        },
      ],
      termsAndConditions: [
        "Hardware is backed by a 1-year replacement warranty against manufacturing faults.",
        "Prices are quoted in BDT excluding VAT unless formally stated.",
        `Quotation remains valid for ${validityDays} days from issue date.`,
      ],
      includedPerks: [
        "Android & iOS Fleet Manager Mobile App Access",
        "Unlimited Web Portal Sub-Account RBAC Logins",
        "24/7 Geofence and Overspeed SMS & Push Alerts",
        "1-Year Comprehensive Hardware Warranty",
      ],
    };

    onTemplateCreated(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card surface border border-border rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-light-background/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary-text">
                Author New Proposal Template
              </h2>
              <p className="text-xs text-secondary-text">
                Configure a standardized quotation blueprint for rapid sales deployment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-secondary-text hover:text-primary-text hover:bg-card border border-border/60 transition cursor-pointer"
            title="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* General Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Template Blueprint Metadata
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Template Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cold-Chain Pharma Dual BLE Telematics"
                  className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-sky-500 text-primary-text focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Template Code
                </label>
                <input
                  type="text"
                  value={templateCode}
                  onChange={(e) => setTemplateCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-light-background border border-border font-mono text-xs text-primary-text"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-light-background border border-border text-xs text-primary-text"
                >
                  <option value="Enterprise Fleet">Enterprise Fleet</option>
                  <option value="Cold Chain">Cold Chain</option>
                  <option value="Fuel Telematics">Fuel Telematics</option>
                  <option value="Plug & Play">Plug & Play</option>
                  <option value="Heavy Asset">Heavy Asset</option>
                  <option value="Video Telematics">Video Telematics</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Target Customer Sector / Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Courier logistics, pharmaceutical distributors, prime movers"
                  className="w-full px-3 py-2 rounded-xl bg-light-background border border-border text-xs text-primary-text"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Executive Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of the solution bundle, hardware components, and client value proposition."
                  className="w-full p-3 rounded-xl bg-light-background border border-border text-xs text-primary-text resize-none"
                />
              </div>
            </div>
          </div>

          {/* Operational & Financial Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-500" />
              Commercial & Operational Standards
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-secondary-text mb-1">
                  Recommended Fleet Scale
                </label>
                <input
                  type="text"
                  value={recommendedFleetSize}
                  onChange={(e) => setRecommendedFleetSize(e.target.value)}
                  placeholder="e.g. 10 - 80 Vehicles"
                  className="w-full px-3 py-2 rounded-xl bg-light-background border border-border text-xs text-primary-text"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-secondary-text mb-1">
                  Turnaround SLA
                </label>
                <input
                  type="text"
                  value={turnaroundTime}
                  onChange={(e) => setTurnaroundTime(e.target.value)}
                  placeholder="e.g. 2-3 Business Days"
                  className="w-full px-3 py-2 rounded-xl bg-light-background border border-border text-xs text-primary-text"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-secondary-text mb-1">
                  Default Validity (Days)
                </label>
                <input
                  type="number"
                  min="7"
                  max="90"
                  value={validityDays}
                  onChange={(e) => setValidityDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-light-background border border-border text-xs text-primary-text"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-secondary-text mb-1">
                  Standard Discount %
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={standardDiscountPercent}
                  onChange={(e) => setStandardDiscountPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-light-background border border-border text-xs text-primary-text"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-medium text-secondary-text mb-1">
                  Standard Payment Terms
                </label>
                <input
                  type="text"
                  value={defaultPaymentTerms}
                  onChange={(e) => setDefaultPaymentTerms(e.target.value)}
                  placeholder="e.g. 50% advance on PO confirmation, 50% upon deployment signoff"
                  className="w-full px-3 py-2 rounded-xl bg-light-background border border-border text-xs text-primary-text"
                />
              </div>
            </div>
          </div>

          {/* Line Item Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                Bundled Bill of Materials & Services ({items.length} lines)
              </h4>

              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 hover:bg-sky-100 text-xs font-semibold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Line</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-light-background border border-border/80 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-primary-text">
                      Item #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length <= 1}
                      className="p-1 text-secondary-text hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Item name / model"
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text"
                      />
                    </div>

                    <div>
                      <select
                        value={item.type}
                        onChange={(e) => handleItemChange(item.id, "type", e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text"
                      >
                        <option value="hardware">Hardware</option>
                        <option value="accessory">Accessory</option>
                        <option value="installation">Installation</option>
                        <option value="subscription">Subscription</option>
                        <option value="service">Service</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="number"
                        min="0"
                        placeholder="Unit Price (৳)"
                        value={item.defaultUnitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "defaultUnitPrice",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-xs pt-1">
                    <input
                      type="text"
                      placeholder="Brief specification notes..."
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      className="flex-1 px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] text-secondary-text"
                    />

                    <label className="flex items-center gap-1.5 cursor-pointer text-secondary-text shrink-0 text-xs">
                      <input
                        type="checkbox"
                        checked={item.isOptional}
                        onChange={(e) =>
                          handleItemChange(item.id, "isOptional", e.target.checked)
                        }
                        className="accent-sky-600 rounded"
                      />
                      <span>Optional Addon</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
              <span className="text-secondary-text font-medium">
                Baseline Turnkey Rate (Per Vehicle):
              </span>
              <span className="font-mono font-bold text-base text-sky-600 dark:text-sky-400">
                ৳{estimatedCost.toLocaleString()}
              </span>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-light-background/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary-text hover:text-primary-text hover:bg-card border border-border/80 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};
