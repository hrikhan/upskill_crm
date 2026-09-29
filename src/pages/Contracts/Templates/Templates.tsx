import React, { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import {
  FileText,
  Plus,
  Search,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
  Eye,
  ArrowRight,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ContractTemplate,
  initialContractTemplates,
} from "./contractTemplatesData";
import { ContractTemplateCard } from "./_components/ContractTemplateCard";
import { ViewContractTemplateModal } from "./_components/ViewContractTemplateModal";
import { UseContractTemplateModal } from "./_components/UseContractTemplateModal";
import { CreateContractTemplateModal } from "./_components/CreateContractTemplateModal";

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ContractTemplate[]>(
    initialContractTemplates
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [viewModalTemplate, setViewModalTemplate] =
    useState<ContractTemplate | null>(null);
  const [useModalTemplate, setUseModalTemplate] =
    useState<ContractTemplate | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter types
  const contractTypes = [
    "All",
    "Fleet AMC (Annual)",
    "SLA Telematics Service",
    "Hardware Lease & Maintenance",
    "Custom SLA",
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.templateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.contractType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "All" || tpl.contractType === selectedType;

    return matchesSearch && matchesType;
  });

  // KPI calculations
  const totalTemplates = templates.length;
  const totalSpawned = templates.reduce((acc, t) => acc + t.usageCount, 0);
  const avgRate =
    templates.length > 0
      ? Math.round(
          templates.reduce((acc, t) => acc + t.baseRatePerUnitMonth, 0) /
            templates.length
        )
      : 0;

  // Handlers
  const handleUseTemplate = (template: ContractTemplate) => {
    setUseModalTemplate(template);
  };

  const handleContractCreated = (contractData: {
    title: string;
    clientName: string;
    contactPerson: string;
    contractType: "Fleet AMC (Annual)" | "SLA Telematics Service" | "Hardware Lease & Maintenance" | "Custom SLA";
    unitsCovered: number;
    contractValue: number;
    startDate: string;
    endDate: string;
    autoRenew: boolean;
    templateCode: string;
  }) => {
    // Increment usage count for template
    setTemplates((prev) =>
      prev.map((t) =>
        t.templateCode === contractData.templateCode
          ? { ...t, usageCount: t.usageCount + 1 }
          : t
      )
    );

    toast.success(
      `Service Contract "${contractData.title}" created successfully!`,
      {
        description: `${contractData.unitsCovered} vehicles covered under ${contractData.contractType}. Agreement value: ৳${contractData.contractValue.toLocaleString()}.`,
        action: {
          label: "View Contracts",
          onClick: () => navigate("/admin/contracts/contracts"),
        },
      }
    );
  };

  const handleDuplicateTemplate = (template: ContractTemplate) => {
    const duplicated: ContractTemplate = {
      ...template,
      id: `tpl-ctr-${Date.now()}`,
      templateCode: `${template.templateCode}-COPY`,
      title: `${template.title} (Copy)`,
      usageCount: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setTemplates([duplicated, ...templates]);
    toast.success(`Template ${template.templateCode} duplicated successfully!`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const target = templates.find((t) => t.id === templateId);
    if (!target) return;

    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    toast.info(`Contract template "${target.templateCode}" deleted.`);
  };

  const handleTemplateCreated = (newTemplate: ContractTemplate) => {
    setTemplates([newTemplate, ...templates]);
    toast.success(`New contract template ${newTemplate.templateCode} created!`);
  };

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card surface p-6 rounded-2xl border border-border shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <FileCheck className="w-4 h-4" />
              <span>SLA Standards & Fleet Maintenance Agreements</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-text tracking-tight">
              Service Contract Templates
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
              Standardized Annual Maintenance Contracts (AMC), mission-critical SLAs, hardware lease agreements, and legal clauses.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Contract Template</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Active Legal Models
              </p>
              <h3 className="text-2xl font-bold text-primary-text mt-1">
                {totalTemplates} Templates
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">
                Covering {contractTypes.length - 1} agreement types
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Contracts Executed
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {totalSpawned} Agreements
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Generated from standard templates
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Average AMC Rate
              </p>
              <h3 className="text-2xl font-bold text-primary-text mt-1 font-mono">
                ৳{avgRate}
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Per vehicle / month benchmark
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Uptime Standard
              </p>
              <h3 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                99.5% - 99.9%
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Guaranteed telemetry availability
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card surface p-4 rounded-2xl border border-border shadow-2xs">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts by title, code, SLA, or clause keywords..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-light-background border border-border focus:border-purple-500 text-primary-text focus:outline-hidden text-xs"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-light-background border border-border">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-card text-primary-text shadow-2xs"
                    : "text-secondary-text hover:text-primary-text"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-card text-primary-text shadow-2xs"
                    : "text-secondary-text hover:text-primary-text"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {contractTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedType === type
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-card surface text-secondary-text hover:text-primary-text border border-border hover:bg-light-background"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Contract Templates Display Area */}
        {filteredTemplates.length === 0 ? (
          <div className="p-12 text-center bg-card surface rounded-2xl border border-border">
            <FileText className="w-12 h-12 text-secondary-text/60 mx-auto mb-3" />
            <h3 className="text-base font-bold text-primary-text">
              No contract templates found
            </h3>
            <p className="text-xs text-secondary-text mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords or agreement type filters, or author a new contract template.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-light-background border border-border text-primary-text hover:bg-card transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredTemplates.map((template) => (
              <ContractTemplateCard
                key={template.id}
                template={template}
                onViewDetails={setViewModalTemplate}
                onUseTemplate={handleUseTemplate}
                onDuplicate={handleDuplicateTemplate}
                onDelete={handleDeleteTemplate}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-card surface rounded-2xl border border-border overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-light-background/80 border-b border-border text-secondary-text uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Code & Title</th>
                    <th className="px-4 py-3.5">Agreement Type</th>
                    <th className="px-4 py-3.5">Tenure</th>
                    <th className="px-4 py-3.5">Base Rate</th>
                    <th className="px-4 py-3.5">Dispatch SLA</th>
                    <th className="px-4 py-3.5">Uptime</th>
                    <th className="px-4 py-3.5">Usages</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTemplates.map((tpl) => (
                    <tr
                      key={tpl.id}
                      className="hover:bg-light-background/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          {tpl.templateCode}
                        </div>
                        <div className="font-semibold text-primary-text text-xs mt-0.5 max-w-xs truncate">
                          {tpl.title}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-light-background border border-border text-secondary-text">
                          {tpl.contractType}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-primary-text">
                        {tpl.standardDurationMonths} Mo ({tpl.standardBillingCycle})
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ৳{tpl.baseRatePerUnitMonth} / unit
                      </td>

                      <td className="px-4 py-3.5 text-primary-text">
                        {tpl.slaResponseHours}h On-Site
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 font-semibold text-emerald-700 dark:text-emerald-300 text-[11px]">
                          {tpl.slaUptimeGuarantee}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 font-semibold text-purple-700 dark:text-purple-300 text-[11px]">
                          {tpl.usageCount}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewModalTemplate(tpl)}
                            className="p-1.5 rounded-lg border border-border bg-card hover:bg-light-background text-secondary-text hover:text-primary-text transition cursor-pointer"
                            title="View Agreement"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUseTemplate(tpl)}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] shadow-2xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Use</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        <ViewContractTemplateModal
          isOpen={Boolean(viewModalTemplate)}
          onClose={() => setViewModalTemplate(null)}
          template={viewModalTemplate}
          onUseTemplate={handleUseTemplate}
        />

        <UseContractTemplateModal
          isOpen={Boolean(useModalTemplate)}
          onClose={() => setUseModalTemplate(null)}
          template={useModalTemplate}
          onContractCreated={handleContractCreated}
        />

        <CreateContractTemplateModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onTemplateCreated={handleTemplateCreated}
          existingCount={templates.length}
        />
      </div>
    </CommonWrapper>
  );
};

export default Templates;