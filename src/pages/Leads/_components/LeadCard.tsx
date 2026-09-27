import React, { useState } from "react";
import { MoreVertical, Phone, Calendar, Mail, Tag, Eye, ArrowRightCircle, Trash2 } from "lucide-react";
import { Lead } from "../types";

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onViewDetails: (lead: Lead) => void;
  onConvertToClient: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onDragStart,
  onViewDetails,
  onConvertToClient,
  onDeleteLead,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing select-none group relative mb-3 hover:border-slate-300 dark:hover:border-slate-700"
    >
      {/* Top Header: Title & Action Menu */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <h4
            onClick={() => onViewDetails(lead)}
            className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-primary-brand cursor-pointer truncate transition-colors"
          >
            {lead.name}
          </h4>

          {/* Subtitle / Company Badge */}
          {lead.subtitle && (
            <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 max-w-full truncate">
              {lead.subtitle}
            </span>
          )}
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-7 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onViewDetails(lead);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onConvertToClient(lead);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  <ArrowRightCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Convert to Client
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDeleteLead(lead.id);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="my-2">
        <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
          Tk,{lead.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Metadata list exactly matching demo */}
      <div className="space-y-1 pt-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium w-16 shrink-0">Telephone:</span>
          <span className="truncate text-slate-600 dark:text-slate-300 font-normal">
            {lead.telephone || "---"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium w-16 shrink-0">Created:</span>
          <span className="truncate">{lead.createdDate || "---"}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium w-16 shrink-0">Contacted:</span>
          <span className="truncate">{lead.contactedStatus || "---"}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium w-16 shrink-0">Category:</span>
          <span className="truncate capitalize text-slate-600 dark:text-slate-300 font-medium">
            {lead.category || "website"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium w-16 shrink-0">Email:</span>
          <span className="truncate">{lead.email || "---"}</span>
        </div>
      </div>
    </div>
  );
};
