import React, { useState, useEffect } from "react";
import {
  X,
  Truck,
  Sparkles,
} from "lucide-react";
import { ProjectTemplate } from "../projectTemplatesData";

interface UseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ProjectTemplate | null;
  onProjectCreated: (projectData: {
    projectName: string;
    clientName: string;
    contactPerson: string;
    totalVehicles: number;
    projectLead: string;
    deadline: string;
    budget: number;
    trackerModel: string;
    templateCode: string;
  }) => void;
}

export const UseTemplateModal: React.FC<UseTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onProjectCreated,
}) => {
  const [clientName, setClientName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [vehicleCount, setVehicleCount] = useState(25);
  const [projectLead, setProjectLead] = useState("Engr. Nayeem (Deployment Lead)");
  const [deadline, setDeadline] = useState("2026-11-30");

  useEffect(() => {
    if (template) {
      setClientName("");
      setContactPerson("");
      setVehicleCount(20);
    }
  }, [template]);

  if (!isOpen || !template) return null;

  const calculatedBudget = vehicleCount * template.estimatedBudgetPerVehicle;
  const estimatedDays = Math.ceil(vehicleCount * template.estimatedDaysPerVehicle);

  const defaultProjectName = clientName.trim()
    ? `${clientName.trim()} ${vehicleCount} Vehicles GPS Rollout (${template.templateCode})`
    : `New Fleet Project - ${template.name}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    onProjectCreated({
      projectName: defaultProjectName,
      clientName: clientName.trim(),
      contactPerson: contactPerson.trim() || "Fleet Transport Manager",
      totalVehicles: Number(vehicleCount),
      projectLead,
      deadline,
      budget: calculatedBudget,
      trackerModel: template.defaultTrackerModel,
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
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {template.templateCode}
              </span>
              <span className="text-xs text-secondary-text font-medium">
                Template Rollout Setup
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-primary-text tracking-tight">
              Create Project from Template
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              Instantiate standard phases, milestones, and task checklists for a client.
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
          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-700 dark:text-indigo-400 block">
                Selected Blueprint
              </span>
              <span className="text-xs font-bold text-primary-text truncate block mt-0.5">
                {template.name}
              </span>
              <span className="text-[11px] text-secondary-text mt-0.5 block">
                Default Hardware: {template.defaultTrackerModel} ({template.phases.length} phases pre-loaded)
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-secondary-text block">Standard Rate</span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                ৳{template.estimatedBudgetPerVehicle.toLocaleString()} / unit
              </span>
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Client / Fleet Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Apex Logistics Ltd"
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Client Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Tanvir Hasan (Transport Head)"
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>
          </div>

          {/* Fleet Vehicles Count & Dynamics */}
          <div className="space-y-2 p-3.5 rounded-xl bg-light-background border border-border">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-primary-text flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-indigo-600" />
                Fleet Vehicle Count
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-card border border-border text-primary-text">
                {vehicleCount} Units
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="200"
              value={vehicleCount}
              onChange={(e) => setVehicleCount(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />

            <div className="flex items-center justify-between text-[11px] text-secondary-text pt-1">
              <span>Est. Timeline: ~{estimatedDays} working days</span>
              <span>Calculated: {vehicleCount} × ৳{template.estimatedBudgetPerVehicle.toLocaleString()}</span>
            </div>
          </div>

          {/* Project Lead & Target Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Assigned Project Lead
              </label>
              <select
                value={projectLead}
                onChange={(e) => setProjectLead(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs cursor-pointer"
              >
                <option value="Engr. Nayeem (Deployment Lead)">Engr. Nayeem (Deployment Lead)</option>
                <option value="Md. Rubel Hossain (Field Lead)">Md. Rubel Hossain (Field Lead)</option>
                <option value="Jahangir Alam (Senior Tech)">Jahangir Alam (Senior Tech)</option>
                <option value="Tanvir Ahmed (Field Supervisor)">Tanvir Ahmed (Field Supervisor)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-primary-text block">
                Target Handover Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs"
              />
            </div>
          </div>

          {/* Generated Project Title Preview */}
          <div className="p-3 rounded-xl bg-card border border-border space-y-1">
            <span className="text-[10px] uppercase font-semibold text-secondary-text block">
              Auto-Generated Project Title
            </span>
            <span className="text-xs font-semibold text-primary-text block">
              {defaultProjectName}
            </span>
          </div>

          {/* Estimated Total Budget Highlight */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 block">
                Total Estimated Rollout Budget
              </span>
              <span className="text-xs text-secondary-text">
                Includes hardware provisioning, SIM, relay wiring & testing
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              ৳{calculatedBudget.toLocaleString()}
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
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Launch Fleet Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
