import React from "react";
import { FileText, UserCheck, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  client: string;
  company: string;
  amount: number;
  dueDate: string;
  status: "paid" | "unpaid" | "overdue";
  salesRep: string;
  source: string;
}

export interface LeadItem {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: "New Leads" | "Appointment Collected" | "Demonstrations Done" | "Proposal Sent" | "Closed Won";
  salesRep: string;
  source: string;
  date: string;
}

interface RecentActivitySectionProps {
  invoices: InvoiceItem[];
  leads: LeadItem[];
  showInvoices?: boolean;
  showLeads?: boolean;
}

export function RecentActivitySection({
  invoices,
  leads,
  showInvoices = true,
  showLeads = true,
}: RecentActivitySectionProps) {
  if (!showInvoices && !showLeads) return null;

  const invoiceSpan = showInvoices && !showLeads ? "lg:col-span-12" : "lg:col-span-7";
  const leadSpan = showLeads && !showInvoices ? "lg:col-span-12" : "lg:col-span-5";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
      {/* Recent Invoices */}
      {showInvoices && (
        <div className={`${invoiceSpan} bg-card surface rounded-2xl p-6 border border-border shadow-xs flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-light-background border border-border flex items-center justify-center text-primary-text">
                <FileText className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-text">Recent Invoices</h3>
                <p className="text-xs text-secondary-text">Latest generated client invoices & billing</p>
              </div>
            </div>

            <Link
              to="/admin/sales/invoices"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 hover:underline"
            >
              View All ({invoices.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-secondary-text border-b border-border uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-semibold">Invoice</th>
                  <th className="py-2.5 px-3 font-semibold">Client</th>
                  <th className="py-2.5 px-3 font-semibold">Amount</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-secondary-text">
                      No invoices match the selected filter.
                    </td>
                  </tr>
                ) : (
                  invoices.slice(0, 5).map((inv) => (
                    <tr key={inv.id} className="hover:bg-light-background/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-primary-text">{inv.invoiceNo}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-primary-text leading-tight">{inv.client}</div>
                        <div className="text-xs text-secondary-text leading-tight">{inv.company}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-primary-text">
                        Tk,{inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                            inv.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : inv.status === "unpaid"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                          }`}
                        >
                          {inv.status === "paid" && <CheckCircle2 className="w-3 h-3" />}
                          {inv.status === "unpaid" && <Clock className="w-3 h-3" />}
                          {inv.status === "overdue" && <AlertCircle className="w-3 h-3" />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-secondary-text">{inv.dueDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-3 border-t border-border mt-3 text-xs text-secondary-text flex items-center justify-between">
          <span>Showing latest invoices</span>
          <span>Updated real-time</span>
        </div>
      </div>
      )}

      {/* Right: Recent Leads Pipeline */}
      {showLeads && (
        <div className={`${leadSpan} bg-card surface rounded-2xl p-6 border border-border shadow-xs flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-light-background border border-border flex items-center justify-center text-primary-text">
                <UserCheck className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-text">Recent Leads</h3>
                <p className="text-xs text-secondary-text">Incoming prospects & stage status</p>
              </div>
            </div>

            <Link
              to="/admin/leads"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 hover:underline"
            >
              View All ({leads.length})
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 mt-3">
            {leads.length === 0 ? (
              <div className="py-8 text-center text-sm text-secondary-text">
                No leads match the selected filter.
              </div>
            ) : (
              leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-light-background/60 hover:bg-light-background transition-colors border border-border/50"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-sm text-primary-text truncate">{lead.name}</div>
                    <div className="text-xs text-secondary-text flex items-center gap-1.5 mt-0.5">
                      <span className="truncate">{lead.company}</span>
                      <span>•</span>
                      <span className="text-sky-600 dark:text-sky-400 font-medium">{lead.salesRep}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-primary-text block">
                      Tk,{lead.value.toLocaleString("en-US")}
                    </span>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                        lead.stage === "Closed Won"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : lead.stage === "Proposal Sent"
                          ? "bg-lime-500/15 text-lime-700 dark:text-lime-300"
                          : lead.stage === "Demonstrations Done"
                          ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300"
                          : lead.stage === "Appointment Collected"
                          ? "bg-orange-500/15 text-orange-700 dark:text-orange-300"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {lead.stage}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-border mt-3 text-xs text-secondary-text flex items-center justify-between">
          <span>Sales pipeline activities</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Active</span>
        </div>
      </div>
      )}
    </div>
  );
}
