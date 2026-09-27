import React from "react";
import { X, Building2, Phone, Mail, MapPin, DollarSign, Briefcase, Tag, FileText } from "lucide-react";
import { Client } from "../../types";
import { Avatar } from "@/common/Avatar";

interface ClientDetailsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteClient: (id: number) => void;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  client,
  isOpen,
  onClose,
  onDeleteClient,
}) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {client.companyName}
              </h2>
              <p className="text-xs text-slate-400">
                Client ID: #{client.id} {client.industry && `• ${client.industry}`}
              </p>
            </div>
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Account Owner & Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-medium">Account Owner</span>
              <div className="flex items-center gap-2">
                <Avatar name={client.accountOwner.name} size="sm" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {client.accountOwner.name}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 block mb-1 font-medium">Pending Projects</span>
              <span className="text-base font-bold text-sky-600 dark:text-sky-400">
                {client.pendingProjects} Active
              </span>
            </div>
          </div>

          {/* Financial summary */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
            <div>
              <span className="text-slate-500 font-medium block">Total Invoiced</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Tk,{client.invoices.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Total Paid</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                Tk,{client.payments.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{client.phone || "No phone provided"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{client.email || "No email provided"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{client.address || "No office address recorded"}</span>
            </div>
          </div>

          {/* Tags */}
          {client.tags && client.tags.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-slate-400 block mb-1 font-medium">Tags</span>
              <div className="flex items-center flex-wrap gap-1.5">
                {client.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onDeleteClient(client.id);
              onClose();
            }}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            Delete Client
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
