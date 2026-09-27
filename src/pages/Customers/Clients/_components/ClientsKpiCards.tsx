import React from "react";
import { Client } from "../../types";

interface ClientsKpiCardsProps {
  clients: Client[];
}

export const ClientsKpiCards: React.FC<ClientsKpiCardsProps> = ({ clients }) => {
  const totalClients = clients.length;
  const totalPendingProjects = clients.reduce((acc, c) => acc + (c.pendingProjects || 0), 0);
  const totalInvoices = clients.reduce((acc, c) => acc + (c.invoices || 0), 0);
  const totalPayments = clients.reduce((acc, c) => acc + (c.payments || 0), 0);

  const kpis = [
    {
      id: "clients",
      value: `${totalClients}`,
      label: "Clients",
      accentColor: "#14b8a6", // Teal
    },
    {
      id: "projects",
      value: `${totalPendingProjects}`,
      label: "Projects",
      accentColor: "#0ea5e9", // Sky Blue
    },
    {
      id: "invoices",
      value: `Tk,${totalInvoices.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      label: "Invoices",
      accentColor: "#8b5cf6", // Purple
    },
    {
      id: "payments",
      value: `Tk,${totalPayments.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      label: "Payments",
      accentColor: "#475569", // Dark Slate
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {kpi.value}
            </h3>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
              {kpi.label}
            </span>
          </div>

          {/* Bottom Accent line matching demo screenshot */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
            style={{ backgroundColor: kpi.accentColor }}
          />
        </div>
      ))}
    </div>
  );
};
