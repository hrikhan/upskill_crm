import React from "react";
import { CreditCard, DollarSign, Info } from "lucide-react";

export interface KpiCardItem {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
}

export interface CrmKpiCardsProps {
  paymentsToday?: string;
  paymentsMonth?: string;
  invoicesDue?: string;
  invoicesOverdue?: string;
  customCards?: KpiCardItem[];
  onCardClick?: (cardId: string) => void;
}

export function CrmKpiCards({
  paymentsToday = "Tk,0.00",
  paymentsMonth = "Tk,0.00",
  invoicesDue = "Tk,0.00",
  invoicesOverdue = "Tk,1,000.00",
  customCards,
  onCardClick,
}: CrmKpiCardsProps) {
  const cards = customCards || [
    {
      id: "payments-today",
      value: paymentsToday,
      label: "Payments - Today",
      icon: <CreditCard className="w-5 h-5 stroke-[1.5]" />,
    },
    {
      id: "payments-month",
      value: paymentsMonth,
      label: "Payments - Month",
      icon: <CreditCard className="w-5 h-5 stroke-[1.5]" />,
    },
    {
      id: "invoices-due",
      value: invoicesDue,
      label: "Invoices - Due",
      icon: <DollarSign className="w-5 h-5 stroke-[1.75]" />,
    },
    {
      id: "invoices-overdue",
      value: invoicesOverdue,
      label: "Invoices - Overdue",
      icon: <DollarSign className="w-5 h-5 stroke-[1.75]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isClickable = Boolean(onCardClick);

        return (
          <div
            key={card.id}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={() => onCardClick?.(card.id)}
            onKeyDown={(e) => {
              if (isClickable && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onCardClick?.(card.id);
              }
            }}
            className={`bg-card surface rounded-xl p-5 border border-border shadow-xs transition-all duration-200 flex flex-col justify-between min-h-[115px] relative group select-none ${
              isClickable
                ? "cursor-pointer hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-md hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40"
                : ""
            }`}
          >
            {/* Top Row: Clean balanced value + icon */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-primary-text group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {card.value}
              </span>
              <div className="w-9 h-9 rounded-lg bg-light-background border border-border text-secondary-text group-hover:border-sky-300 dark:group-hover:border-sky-700 group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center justify-center shrink-0 transition-colors">
                {card.icon}
              </div>
            </div>

            {/* Bottom Row: Label & Info Icon Button */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-1 border-t border-border/50">
              <span className="text-xs text-secondary-text font-normal truncate">
                {card.label}
              </span>

              {isClickable && (
                <button
                  type="button"
                  title="View calculation & timing details"
                  aria-label={`View info for ${card.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardClick?.(card.id);
                  }}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-secondary-text/70 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
