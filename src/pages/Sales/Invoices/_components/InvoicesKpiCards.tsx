import React from "react";
import { DollarSign, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface InvoicesKpiCardsProps {
  totalInvoiced: number;
  totalPaid: number;
  totalDue: number;
  totalOverdue: number;
  invoiceCount: number;
}

export const InvoicesKpiCards: React.FC<InvoicesKpiCardsProps> = ({
  totalInvoiced,
  totalPaid,
  totalDue,
  totalOverdue,
  invoiceCount,
}) => {
  const cards = [
    {
      id: "total-invoiced",
      title: "Total Invoiced",
      value: `Tk,${totalInvoiced.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      subtitle: `${invoiceCount} total invoices generated`,
      icon: DollarSign,
      iconColor: "text-sky-600 dark:text-sky-400",
      bgLight: "bg-sky-50 dark:bg-sky-950/30",
      border: "border-sky-200 dark:border-sky-900/50",
    },
    {
      id: "total-collected",
      title: "Total Collected",
      value: `Tk,${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      subtitle: "Cleared payments in ledger",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-900/50",
    },
    {
      id: "total-due",
      title: "Outstanding Balance",
      value: `Tk,${totalDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      subtitle: "Pending receivables & partials",
      icon: Clock,
      iconColor: "text-amber-600 dark:text-amber-400",
      bgLight: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-900/50",
    },
    {
      id: "total-overdue",
      title: "Overdue Invoices",
      value: `Tk,${totalOverdue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      subtitle: "Past scheduled due date",
      icon: AlertTriangle,
      iconColor: "text-rose-600 dark:text-rose-400",
      bgLight: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-200 dark:border-rose-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className={`bg-card surface rounded-2xl p-5 border ${c.border} shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  {c.title}
                </span>
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  {c.value}
                </span>
              </div>
              <div
                className={`w-10 h-10 rounded-xl ${c.bgLight} flex items-center justify-center shrink-0 border border-border/40`}
              >
                <Icon className={`w-5 h-5 ${c.iconColor} stroke-[2]`} />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              {c.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
