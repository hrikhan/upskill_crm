import React from "react";
import { CreditCard, DollarSign } from "lucide-react";

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
}

export function CrmKpiCards({
  paymentsToday = "Tk,0.00",
  paymentsMonth = "Tk,0.00",
  invoicesDue = "Tk,0.00",
  invoicesOverdue = "Tk,1,000.00",
  customCards,
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
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-card surface rounded-xl p-5 border border-border shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between min-h-[115px]"
        >
          {/* Top Row: Clean balanced value + icon */}
          <div className="flex items-start justify-between gap-2">
            <span className="text-xl sm:text-2xl font-semibold tracking-tight text-primary-text">
              {card.value}
            </span>
            <div className="w-9 h-9 rounded-lg bg-light-background border border-border text-secondary-text flex items-center justify-center shrink-0">
              {card.icon}
            </div>
          </div>

          {/* Bottom Label */}
          <span className="text-xs text-secondary-text font-normal mt-2">
            {card.label}
          </span>
        </div>
      ))}
    </div>
  );
}
