import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  TrendingUp,
  Download,
  Upload,
  Filter,
  Settings,
  MoreVertical,
  Eye,
  Trash2,
  FileText,
  Building2,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { Client } from "../types";
import { ClientsKpiCards } from "./_components/ClientsKpiCards";
import { CreateClientModal } from "./_components/CreateClientModal";
import { ClientDetailsModal } from "./_components/ClientDetailsModal";
import { Avatar } from "@/common/Avatar";

// Initial Clients dataset matching demo screenshot
const initialClientsData: Client[] = [
  {
    id: 19,
    companyName: "Eminence",
    accountOwner: {
      name: "Software Software",
    },
    pendingProjects: 1,
    invoices: 0,
    payments: 500,
    tags: ["---"],
    phone: "01711223344",
    email: "info@eminence.com",
    address: "Banani, Dhaka",
    industry: "Software & Technology",
  },
  {
    id: 15,
    companyName: "Nitor",
    accountOwner: {
      name: "Dr Golam Mahmud Suhash",
    },
    pendingProjects: 0,
    invoices: 0,
    payments: 0,
    tags: ["---"],
    phone: "01822334455",
    email: "contact@nitor.com",
    address: "Gulshan, Dhaka",
    industry: "Healthcare",
  },
  {
    id: 6,
    companyName: "Smile Dental Plan",
    accountOwner: {
      name: "Smile Dental Plan 9 Furler Steet Tolowa, NJ 07512",
    },
    pendingProjects: 0,
    invoices: 0,
    payments: 500,
    tags: ["---"],
    phone: "01933445566",
    email: "will@mdpsmile.com",
    address: "9 Furler Street Tolowa, NJ 07512",
    industry: "Dental Services",
  },
  {
    id: 20,
    companyName: "XYZ Organization",
    accountOwner: {
      name: "Tanvir Rahman",
    },
    pendingProjects: 0,
    invoices: 1000,
    payments: 1000,
    tags: ["---"],
    phone: "01644556677",
    email: "info@xyz.com",
    address: "Uttara, Dhaka",
    industry: "Logistics & Fleet",
  },
];

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(initialClientsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Client>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Sorting handler
  const handleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filtered and Sorted Clients
  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          client.companyName.toLowerCase().includes(q) ||
          client.accountOwner.name.toLowerCase().includes(q) ||
          String(client.id).includes(q)
        );
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA || "").toLowerCase();
        const strB = String(valB || "").toLowerCase();
        return sortOrder === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
  }, [clients, searchQuery, sortField, sortOrder]);

  // Create Client
  const handleCreateClient = (
    newClientData: Omit<Client, "id" | "invoices" | "payments">
  ) => {
    const nextId = Math.max(...clients.map((c) => c.id), 20) + 1;
    const newClient: Client = {
      ...newClientData,
      id: nextId,
      invoices: 0,
      payments: 0,
    };

    setClients((prev) => [newClient, ...prev]);
    toast.success(`Client "${newClient.companyName}" created successfully!`);
  };

  // Delete Client
  const handleDeleteClient = (id: number) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    toast.error("Client record removed.");
  };

  return (
    <AnimatedContainer>
      <div className="space-y-6">
        {/* Top Header Row matching demo screenshot */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Clients
            </h1>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              APP &gt; CLIENTS
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-44 sm:w-56 pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 shadow-2xs"
              />
            </div>

            {/* Quick action buttons matching screenshot */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                title="View Analytics"
                onClick={() => toast.info("Client analytics overview")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-sky-500" />
              </button>
              <button
                type="button"
                title="Import Clients"
                onClick={() => toast.info("Import clients modal")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Download className="w-4 h-4 text-teal-600" />
              </button>
              <button
                type="button"
                title="Export Clients"
                onClick={() => toast.success("Exporting clients list...")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Upload className="w-4 h-4 text-primary-brand" />
              </button>
              <button
                type="button"
                title="Filter Clients"
                onClick={() => toast.info("Filter options")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Filter className="w-4 h-4 text-sky-500" />
              </button>
            </div>

            {/* Circular Floating Plus Button matching demo */}
            <button
              type="button"
              title="Add New Client"
              onClick={() => setIsCreateModalOpen(true)}
              className="w-9 h-9 rounded-full bg-primary-brand hover:bg-primary-brand/90 text-white flex items-center justify-center shadow-md hover:shadow-primary-brand/30 transition-all hover:scale-105 active:scale-95 cursor-pointer ml-1"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards matching demo */}
        <ClientsKpiCards clients={clients} />

        {/* Clients Data Table matching demo screenshot */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th
                    onClick={() => handleSort("id")}
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 w-16"
                  >
                    <div className="flex items-center gap-1">
                      <span>ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("companyName")}
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Company Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <span>Account Owner</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("pendingProjects")}
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Pending Projects</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("invoices")}
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Invoices</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">Tags</th>
                  <th className="px-5 py-3.5 text-right w-12">
                    <Settings className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-500 dark:text-slate-400">
                      {client.id}
                    </td>

                    {/* Company Name Link */}
                    <td className="px-5 py-3.5 font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="text-left font-semibold hover:text-primary-brand"
                      >
                        {client.companyName}
                      </button>
                    </td>

                    {/* Account Owner with Avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 max-w-xs truncate">
                        <Avatar name={client.accountOwner.name} size="sm" />
                        <span className="text-sky-600 dark:text-sky-400 font-medium truncate">
                          {client.accountOwner.name}
                        </span>
                      </div>
                    </td>

                    {/* Pending Projects */}
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      {client.pendingProjects}
                    </td>

                    {/* Invoices */}
                    <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-200">
                      Tk,{client.invoices.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Tags */}
                    <td className="px-5 py-3.5 text-slate-400">
                      {client.tags.join(", ") || "---"}
                    </td>

                    {/* Quick Row Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          title="View Details"
                          onClick={() => setSelectedClient(client)}
                          className="p-1 rounded text-slate-400 hover:text-primary-brand hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No clients found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Client Modal */}
        <CreateClientModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateClient}
        />

        {/* Client Details Modal */}
        <ClientDetailsModal
          client={selectedClient}
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          onDeleteClient={handleDeleteClient}
        />
      </div>
    </AnimatedContainer>
  );
};

export default Clients;