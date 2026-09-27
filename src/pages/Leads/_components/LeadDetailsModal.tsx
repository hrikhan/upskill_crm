import React, { useState } from "react";
import { X, ArrowRightCircle, Phone, Mail, Calendar, DollarSign, Tag, CheckCircle2 } from "lucide-react";
import { Lead, LeadStage, STAGE_CONFIGS } from "../types";

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertToClient: (lead: Lead) => void;
  onUpdateStage: (id: string, newStage: LeadStage) => void;
  onSaveNotes: (id: string, notes: string) => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  lead,
  isOpen,
  onClose,
  onConvertToClient,
  onUpdateStage,
  onSaveNotes,
}) => {
  if (!isOpen || !lead) return null;

  const [notes, setNotes] = useState(lead.notes || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleNotesSave = () => {
    onSaveNotes(lead.id, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const currentStageConfig = STAGE_CONFIGS.find((s) => s.id === lead.stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                {lead.name}
              </h2>
              {lead.subtitle && (
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {lead.subtitle}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Lead ID: #{lead.id} • Created: {lead.createdDate}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Top Status & Value Pill banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                Lead Value
              </span>
              <span className="text-xl font-bold text-sky-600 dark:text-sky-400">
                Tk,{lead.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block mb-1">
                Current Pipeline Stage
              </span>
              <select
                value={lead.stage}
                onChange={(e) => onUpdateStage(lead.id, e.target.value as LeadStage)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {STAGE_CONFIGS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Telephone</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {lead.telephone || "Not provided"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Email</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate block">
                  {lead.email || "Not provided"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <Tag className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Category / Source</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                  {lead.category || "Website"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block font-medium">Contacted Status</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {lead.contactedStatus || "---"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Follow-up History */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Follow-up Notes & Vehicle Requirements
              </label>
              {isSaved && (
                <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record phone calls, vehicle inspection feedback, quotation follow-ups..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 resize-none"
            />
            <button
              type="button"
              onClick={handleNotesSave}
              className="mt-2 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            >
              Update Notes
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onConvertToClient(lead);
              onClose();
            }}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md flex items-center gap-2"
          >
            <ArrowRightCircle className="w-4 h-4" />
            1-Click Convert to Client
          </button>
        </div>
      </div>
    </div>
  );
};
