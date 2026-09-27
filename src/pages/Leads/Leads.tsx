import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  Download,
  Upload,
  TrendingUp,
  UserCheck,
  Archive,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Lead, LeadStage } from "./types";
import { LeadsKpiSummary } from "./_components/LeadsKpiSummary";
import { LeadsKanbanBoard } from "./_components/LeadsKanbanBoard";
import { LeadsTableView } from "./_components/LeadsTableView";
import { CreateLeadModal } from "./_components/CreateLeadModal";
import { LeadDetailsModal } from "./_components/LeadDetailsModal";

// Initial Demo Leads matching screenshot & GPS use-case
const initialLeadsData: Lead[] = [
  {
    id: "lead-1",
    name: "Maruf Ahmed",
    subtitle: "Maruf Ahmd",
    company: "Apex Tech",
    value: 0,
    telephone: "235",
    email: "maruf@apex.com",
    createdDate: "01-11-2026",
    contactedStatus: "---",
    category: "website",
    stage: "Demonstrations Done",
    notes: "Demonstration completed for fleet monitoring software and engine cutoff.",
  },
  {
    id: "lead-2",
    name: "hhh",
    subtitle: "kjsdkfkjdsfsd lsdflsdf",
    company: "kjsdkfkjdsfsd lsdflsdf",
    value: 0,
    telephone: "---",
    email: "---",
    createdDate: "09-27-2026",
    contactedStatus: "---",
    category: "website",
    stage: "Appointment collected",
    notes: "Follow up call scheduled for tomorrow 11:00 AM.",
  },
  {
    id: "lead-3",
    name: "Tariqul Islam",
    subtitle: "Dhaka Freight Forwarding",
    company: "Dhaka Freight Ltd",
    value: 45000,
    telephone: "01711223344",
    email: "tariqul@dhakafreight.com",
    createdDate: "09-20-2026",
    contactedStatus: "Contacted",
    category: "direct",
    stage: "Implemented",
    notes: "12 GPS units installed with active monthly tracking package.",
  },
  {
    id: "lead-4",
    name: "Tanvir Hasan",
    subtitle: "Prime Express Courier",
    company: "Prime Express",
    value: 18000,
    telephone: "01822334455",
    email: "tanvir@primecourier.com",
    createdDate: "09-25-2026",
    contactedStatus: "Interested",
    category: "facebook",
    stage: "Proposal Sent",
    notes: "Sent proposal for 4 delivery vans with real-time temperature tracking.",
  },
  {
    id: "lead-5",
    name: "Rashidul Karim",
    subtitle: "Karim Transporters",
    company: "Karim Cargo",
    value: 8500,
    telephone: "01933445566",
    email: "karim@karimtrans.com",
    createdDate: "09-26-2026",
    contactedStatus: "Call Back",
    category: "referral",
    stage: "Need Followup",
    notes: "Interested in OBD plug-and-play GPS trackers.",
  },
  {
    id: "lead-6",
    name: "Hasan Mahmud",
    subtitle: "Bike Ride Delivery",
    company: "Hasan Bikes",
    value: 3500,
    telephone: "01644556677",
    email: "hasan@delivery.com",
    createdDate: "09-27-2026",
    contactedStatus: "New Inbound",
    category: "website",
    stage: "New",
    notes: "Inquired about motorcycle GPS tracker with mobile app alert.",
  },
];

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeadsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStage, setCreateModalDefaultStage] = useState<LeadStage>("New");
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<Lead | null>(null);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.subtitle && lead.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lead.telephone.includes(searchQuery) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Stage filter
      const matchesStage =
        !selectedStageFilter || lead.stage === selectedStageFilter;

      return matchesSearch && matchesStage;
    });
  }, [leads, searchQuery, selectedStageFilter]);

  // Handle Drag and Drop Stage Movement
  const handleMoveLeadStage = (leadId: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          if (lead.stage !== newStage) {
            toast.success(`Moved "${lead.name}" to ${newStage}`, {
              description: `Pipeline stage updated successfully.`,
            });
          }
          return { ...lead, stage: newStage };
        }
        return lead;
      })
    );
  };

  // Open Create Lead Modal
  const handleOpenCreateModal = (defaultStage: LeadStage = "New") => {
    setCreateModalDefaultStage(defaultStage);
    setIsCreateModalOpen(true);
  };

  // Add New Lead
  const handleCreateLead = (
    newLeadData: Omit<Lead, "id" | "createdDate" | "contactedStatus">
  ) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now().toString().slice(-4)}`,
      createdDate: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      contactedStatus: "New",
    };

    setLeads((prev) => [newLead, ...prev]);
    toast.success(`Lead "${newLead.name}" created successfully!`);
  };

  // 1-Click Convert to Client
  const handleConvertToClient = (lead: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, stage: "Implemented" } : l))
    );
    toast.success(`"${lead.name}" converted to Client!`, {
      description: `Client record created and lead marked as Implemented.`,
    });
  };

  // Update Notes
  const handleSaveNotes = (id: string, notes: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, notes } : l))
    );
    toast.success("Follow-up notes updated.");
  };

  // Update Stage directly from details modal
  const handleUpdateStage = (id: string, newStage: LeadStage) => {
    handleMoveLeadStage(id, newStage);
    if (selectedLeadDetails && selectedLeadDetails.id === id) {
      setSelectedLeadDetails((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
  };

  // Delete Lead
  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    toast.error("Lead deleted from pipeline.");
  };

  return (
    <AnimatedContainer>
      <div className="space-y-5">
        {/* Top Header Row matching screenshot */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Leads
            </h1>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              APP &gt; LEADS
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

            {/* Quick Action Icons matching demo */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                title="Kanban Board View"
                onClick={() => setViewMode("kanban")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "kanban"
                    ? "bg-primary-brand text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Table List View"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-primary-brand text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Secondary Toolbar Buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                title="Export Leads"
                onClick={() => toast.info("Exporting leads data...")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Import Leads"
                onClick={() => toast.info("Open import dialog...")}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Reset Filters"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStageFilter(null);
                  toast.success("Filters reset");
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Floating Plus Button matching demo */}
            <button
              type="button"
              title="Add New Lead"
              onClick={() => handleOpenCreateModal("New")}
              className="w-9 h-9 rounded-full bg-primary-brand hover:bg-primary-brand/90 text-white flex items-center justify-center shadow-md hover:shadow-primary-brand/30 transition-all hover:scale-105 active:scale-95 cursor-pointer ml-1"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 6 Stage KPI Metric Cards matching demo */}
        <LeadsKpiSummary
          leads={leads}
          selectedStage={selectedStageFilter}
          onSelectStageFilter={setSelectedStageFilter}
        />

        {/* Selected Filter Indicator */}
        {selectedStageFilter && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-brand/10 text-primary-brand rounded-xl text-xs font-semibold w-fit">
            <span>Filtered by: {selectedStageFilter}</span>
            <button
              onClick={() => setSelectedStageFilter(null)}
              className="hover:underline text-[11px]"
            >
              Clear
            </button>
          </div>
        )}

        {/* Main Leads View: Drag & Drop Kanban or Table */}
        {viewMode === "kanban" ? (
          <LeadsKanbanBoard
            leads={filteredLeads}
            onMoveLeadStage={handleMoveLeadStage}
            onOpenCreateModal={handleOpenCreateModal}
            onViewDetails={setSelectedLeadDetails}
            onConvertToClient={handleConvertToClient}
            onDeleteLead={handleDeleteLead}
          />
        ) : (
          <LeadsTableView
            leads={filteredLeads}
            onViewDetails={setSelectedLeadDetails}
            onConvertToClient={handleConvertToClient}
            onDeleteLead={handleDeleteLead}
          />
        )}

        {/* Create Lead Modal */}
        <CreateLeadModal
          isOpen={isCreateModalOpen}
          defaultStage={createModalDefaultStage}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateLead}
        />

        {/* Lead Details & Follow-up Modal */}
        <LeadDetailsModal
          lead={selectedLeadDetails}
          isOpen={!!selectedLeadDetails}
          onClose={() => setSelectedLeadDetails(null)}
          onConvertToClient={handleConvertToClient}
          onUpdateStage={handleUpdateStage}
          onSaveNotes={handleSaveNotes}
        />
      </div>
    </AnimatedContainer>
  );
};

export default Leads;