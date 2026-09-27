import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Lead, LeadStage, STAGE_CONFIGS } from "../types";
import { LeadCard } from "./LeadCard";

interface LeadsKanbanBoardProps {
  leads: Lead[];
  onMoveLeadStage: (leadId: string, newStage: LeadStage) => void;
  onOpenCreateModal: (defaultStage?: LeadStage) => void;
  onViewDetails: (lead: Lead) => void;
  onConvertToClient: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
}

export const LeadsKanbanBoard: React.FC<LeadsKanbanBoardProps> = ({
  leads,
  onMoveLeadStage,
  onOpenCreateModal,
  onViewDetails,
  onConvertToClient,
  onDeleteLead,
}) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (stage: LeadStage) => {
    if (dragOverStage === stage) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    const id = draggedLeadId || e.dataTransfer.getData("text/plain");
    if (id) {
      onMoveLeadStage(id, stage);
    }
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-[1280px]">
        {STAGE_CONFIGS.map((stage) => {
          const columnLeads = leads.filter((l) => l.stage === stage.id);
          const isOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={() => handleDragLeave(stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`flex-1 min-w-[240px] max-w-[280px] bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl p-3 border transition-all duration-200 flex flex-col ${
                isOver
                  ? "border-primary-brand bg-primary-brand/5 dark:bg-primary-brand/10 ring-2 ring-primary-brand/20"
                  : "border-slate-200/80 dark:border-slate-800"
              }`}
            >
              {/* Column Header matching screenshot */}
              <div className="flex items-center justify-between px-1 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    {stage.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.2 rounded-full border border-slate-200 dark:border-slate-700">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Plus button inside column header */}
                <button
                  type="button"
                  title={`Add lead to ${stage.title}`}
                  onClick={() => onOpenCreateModal(stage.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-primary-brand transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cards Container */}
              <div className="flex-1 min-h-[350px]">
                {columnLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onDragStart={handleDragStart}
                    onViewDetails={onViewDetails}
                    onConvertToClient={onConvertToClient}
                    onDeleteLead={onDeleteLead}
                  />
                ))}

                {columnLeads.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                    <span>Drop leads here</span>
                    <button
                      onClick={() => onOpenCreateModal(stage.id)}
                      className="text-primary-brand hover:underline font-medium text-[11px]"
                    >
                      + Add Lead
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
