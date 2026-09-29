import React, { useState } from "react";
import {
  X,
  FolderPlus,
} from "lucide-react";
import { ProjectTemplate } from "../projectTemplatesData";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (newTemplate: ProjectTemplate) => void;
  existingCount: number;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onTemplateCreated,
  existingCount,
}) => {
  const [name, setName] = useState("");
  const [templateCode, setTemplateCode] = useState(
    `TPL-CUSTOM-0${existingCount + 1}`
  );
  const [category, setCategory] = useState<ProjectTemplate["category"]>(
    "Commercial Haulers"
  );
  const [description, setDescription] = useState("");
  const [targetVehiclesRange, setTargetVehiclesRange] = useState("10 - 50 Vehicles");
  const [defaultTrackerModel, setDefaultTrackerModel] = useState("Concox GT06N Pro");
  const [estimatedDaysPerVehicle, setEstimatedDaysPerVehicle] = useState(1.0);
  const [estimatedBudgetPerVehicle, setEstimatedBudgetPerVehicle] = useState(5000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTemplate: ProjectTemplate = {
      id: `tpl-${Date.now()}`,
      templateCode: templateCode.trim() || `TPL-0${existingCount + 1}`,
      name: name.trim(),
      category,
      description:
        description.trim() ||
        "Custom enterprise fleet installation blueprint with standardized wiring and inspection milestones.",
      targetVehiclesRange,
      defaultTrackerModel,
      estimatedDaysPerVehicle: Number(estimatedDaysPerVehicle),
      estimatedTotalDays: Math.ceil(Number(estimatedDaysPerVehicle) * 12),
      estimatedBudgetPerVehicle: Number(estimatedBudgetPerVehicle),
      status: "Active",
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      requiredHardware: [
        { itemName: `${defaultTrackerModel} Unit`, quantityPerVehicle: 1, isMandatory: true },
        { itemName: "Engine Cutoff Relay Harness", quantityPerVehicle: 1, isMandatory: true },
        { itemName: "4G IoT Machine SIM Card", quantityPerVehicle: 1, isMandatory: true },
        { itemName: "Inline Fuse & Wiring Harness", quantityPerVehicle: 1, isMandatory: true },
      ],
      phases: [
        {
          id: `p-${Date.now()}-1`,
          phaseNumber: 1,
          name: "Phase 1: Initial Scheduling & Fleet Audit",
          estimatedDays: 2,
          tasks: [
            {
              id: `t-${Date.now()}-1`,
              title: "Electrical baseline inspection & vehicle availability list",
              roleRequired: "Lead Engineer",
              mandatory: true,
              estimatedHours: 6,
            },
          ],
        },
        {
          id: `p-${Date.now()}-2`,
          phaseNumber: 2,
          name: "Phase 2: Hardware Provisioning & IMEI Pairing",
          estimatedDays: 2,
          tasks: [
            {
              id: `t-${Date.now()}-2`,
              title: "SIM activation & platform endpoint provisioning",
              roleRequired: "QA Tech",
              mandatory: true,
              estimatedHours: 8,
            },
          ],
        },
        {
          id: `p-${Date.now()}-3`,
          phaseNumber: 3,
          name: "Phase 3: Concealed Installation & Relay Wiring",
          estimatedDays: 6,
          tasks: [
            {
              id: `t-${Date.now()}-3`,
              title: "Secure under-dash bracket wiring and relay ignition splice",
              roleRequired: "Field Wiring Tech",
              mandatory: true,
              estimatedHours: 20,
            },
          ],
        },
        {
          id: `p-${Date.now()}-4`,
          phaseNumber: 4,
          name: "Phase 4: Live Portal Verification & Signoff",
          estimatedDays: 2,
          tasks: [
            {
              id: `t-${Date.now()}-4`,
              title: "Remote immobilizer test and client dispatch handover",
              roleRequired: "Operations",
              mandatory: true,
              estimatedHours: 6,
            },
          ],
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
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                New Blueprint
              </span>
              <span className="text-xs text-secondary-text font-medium">
                Standard Rollout Template
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight">
              Create Project Template
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              Standardize workflow phases, hardware specifications, and time benchmarks.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. School Bus RFID & Live Video Rollout"
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs"
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
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Vehicle Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ProjectTemplate["category"])
                }
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="Commercial Haulers">Commercial Haulers</option>
                <option value="Motorbike Delivery">Motorbike Delivery</option>
                <option value="Fuel & Telematics">Fuel & Telematics</option>
                <option value="Cold Chain & Temperature">Cold Chain & Temperature</option>
                <option value="Personal & Executive">Personal & Executive</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Default Hardware Tracker
              </label>
              <select
                value={defaultTrackerModel}
                onChange={(e) => setDefaultTrackerModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="Concox GT06N Pro">Concox GT06N Pro</option>
                <option value="Teltonika FMB920 Fleet">Teltonika FMB920 Fleet</option>
                <option value="SinoTrack ST-901 Mini">SinoTrack ST-901 Mini</option>
                <option value="Teltonika FMB125 Advanced">Teltonika FMB125 Advanced</option>
                <option value="Capacitive Fuel Sensor Rod">Capacitive Fuel Sensor Rod</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Target Fleet Size
              </label>
              <input
                type="text"
                value={targetVehiclesRange}
                onChange={(e) => setTargetVehiclesRange(e.target.value)}
                placeholder="e.g. 10 - 50 Vans"
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Days / Vehicle
              </label>
              <input
                type="number"
                step="0.1"
                min="0.2"
                max="10"
                value={estimatedDaysPerVehicle}
                onChange={(e) => setEstimatedDaysPerVehicle(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Budget / Unit (৳)
              </label>
              <input
                type="number"
                step="100"
                min="500"
                value={estimatedBudgetPerVehicle}
                onChange={(e) =>
                  setEstimatedBudgetPerVehicle(Number(e.target.value))
                }
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-primary-text block">
              Blueprint Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the operational objective, wiring techniques, and client handover requirements..."
              className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs resize-none"
            />
          </div>

          {/* Pre-Loaded Milestones Note */}
          <div className="p-3 rounded-xl bg-light-background border border-border text-[11px] text-secondary-text">
            <strong className="text-primary-text block mb-0.5">Pre-configured Milestones:</strong>
            New templates automatically initialize with 4 standard phases (Site Audit, Provisioning, Concealed Wiring & Live Signoff), customizable upon project instantiation.
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
              disabled={!name.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
