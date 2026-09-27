import React from "react";
import { Lead, STAGE_CONFIGS } from "../types";
import { MoreVertical, ArrowRightCircle, Trash2, Eye } from "lucide-react";

interface LeadsTableViewProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
  onConvertToClient: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
}

export const LeadsTableView: React.FC<LeadsTableViewProps> = ({
  leads,
  onViewDetails,
  onConvertToClient,
  onDeleteLead,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Lead Name</th>
              <th className="px-4 py-3">Company / Subtitle</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {leads.map((lead) => {
              const stageConfig = STAGE_CONFIGS.find((s) => s.id === lead.stage);

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    <button
                      onClick={() => onViewDetails(lead)}
                      className="hover:text-primary-brand text-left"
                    >
                      {lead.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {lead.subtitle || lead.company || "---"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {lead.telephone || "---"}
                  </td>
                  <td className="px-4 py-3 font-bold text-sky-600 dark:text-sky-400">
                    Tk,{lead.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300 font-medium">
                    {lead.category || "website"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        stageConfig?.badgeBg || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {lead.createdDate}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title="View Details"
                        onClick={() => onViewDetails(lead)}
                        className="p-1 rounded-md text-slate-400 hover:text-primary-brand hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Convert to Client"
                        onClick={() => onConvertToClient(lead)}
                        className="p-1 rounded-md text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      >
                        <ArrowRightCircle className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete Lead"
                        onClick={() => onDeleteLead(lead.id)}
                        className="p-1 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {leads.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No leads found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
