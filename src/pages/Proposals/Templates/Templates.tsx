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
  CheckCircle2,
  DollarSign,
  Truck,
  Bookmark,
  Layers,
  Copy,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ProposalTemplate,
  initialProposalTemplates,
} from "./proposalTemplatesData";
import { ProposalTemplateCard } from "./_components/ProposalTemplateCard";
import { ViewProposalTemplateModal } from "./_components/ViewProposalTemplateModal";
import {
  UseProposalTemplateModal,
  GeneratedProposalData,
} from "./_components/UseProposalTemplateModal";
import { CreateProposalTemplateModal } from "./_components/CreateProposalTemplateModal";

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ProposalTemplate[]>(
    initialProposalTemplates
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [viewModalTemplate, setViewModalTemplate] =
    useState<ProposalTemplate | null>(null);
  const [useModalTemplate, setUseModalTemplate] =
    useState<ProposalTemplate | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Categories list
  const categories = [
    "All",
    "Enterprise Fleet",
    "Cold Chain",
    "Fuel Telematics",
    "Plug & Play",
    "Heavy Asset",
    "Video Telematics",
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      tpl.title.toLowerCase().includes(query) ||
      tpl.templateCode.toLowerCase().includes(query) ||
      tpl.category.toLowerCase().includes(query) ||
      tpl.description.toLowerCase().includes(query) ||
      tpl.targetAudience.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" || tpl.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // KPI calculations
  const totalBlueprints = templates.length;
  const totalSpawned = templates.reduce((acc, t) => acc + t.usageCount, 0);
  const avgCost =
    templates.length > 0
      ? Math.round(
          templates.reduce((acc, t) => acc + t.estimatedPerVehicleCost, 0) /
            templates.length
        )
      : 0;

  // Handlers
  const handleUseTemplate = (template: ProposalTemplate) => {
    setUseModalTemplate(template);
  };

  const handleProposalCreated = (data: GeneratedProposalData) => {
    // Increment usage count for template
    setTemplates((prev) =>
      prev.map((t) =>
        t.templateCode === data.templateCode
          ? { ...t, usageCount: t.usageCount + 1 }
          : t
      )
    );

    toast.success(`Proposal for "${data.clientName}" created successfully!`, {
      description: `${data.fleetUnits} vehicles quoted under ${data.templateCode}. Net proposal value: ৳${data.netTotal.toLocaleString()}.`,
      action: {
        label: "View Proposals",
        onClick: () => navigate("/admin/proposals/proposals"),
      },
    });
  };

  const handleDuplicateTemplate = (template: ProposalTemplate) => {
    const duplicated: ProposalTemplate = {
      ...template,
      id: `tpl-prop-${Date.now()}`,
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
    toast.info(`Proposal template "${target.templateCode}" deleted.`);
  };

  const handleTemplateCreated = (newTemplate: ProposalTemplate) => {
    setTemplates([newTemplate, ...templates]);
    toast.success(`New proposal template ${newTemplate.templateCode} created!`);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Enterprise Fleet":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800";
      case "Cold Chain":
        return "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
      case "Fuel Telematics":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Plug & Play":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Heavy Asset":
        return "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "Video Telematics":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-200 dark:border-slate-800";
    }
  };

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card surface p-6 rounded-2xl border border-border shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Bookmark className="w-4 h-4" />
              <span>Standardized Telematics Quotations & Bill of Materials</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-text tracking-tight">
              Proposal Templates
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
              Standardized quotation packages, turnkey hardware bundles, sensor calibration tiers, and commercial SLA terms.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Proposal Template</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Active Blueprints
              </p>
              <h3 className="text-2xl font-bold text-primary-text mt-1">
                {totalBlueprints} Templates
              </h3>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-1">
                Covering {categories.length - 1} solution verticals
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Proposals Generated
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {totalSpawned} Proposals
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Issued to prospective clients
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Average Package Rate
              </p>
              <h3 className="text-2xl font-bold text-primary-text mt-1 font-mono">
                ৳{avgCost.toLocaleString()}
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Per vehicle hardware + license
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Standard Turnaround
              </p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                24h - 72h
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                From quotation to deployment
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
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
              placeholder="Search templates by code, vertical, hardware model, or target client..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-light-background border border-border focus:border-sky-500 text-primary-text focus:outline-hidden text-xs"
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
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === category
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-card surface text-secondary-text hover:text-primary-text border border-border hover:bg-light-background"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Proposal Templates Display Area */}
        {filteredTemplates.length === 0 ? (
          <div className="p-12 text-center bg-card surface rounded-2xl border border-border">
            <FileText className="w-12 h-12 text-secondary-text/60 mx-auto mb-3" />
            <h3 className="text-base font-bold text-primary-text">
              No proposal templates found
            </h3>
            <p className="text-xs text-secondary-text mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or solution category filters, or create a brand new proposal blueprint.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-light-background border border-border text-primary-text hover:bg-card transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <ProposalTemplateCard
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
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-light-background/80 border-b border-border text-secondary-text font-semibold">
                    <th className="py-3 px-4">Template Code & Title</th>
                    <th className="py-3 px-3">Vertical</th>
                    <th className="py-3 px-3">Fleet Scale</th>
                    <th className="py-3 px-3 text-right">Est. Unit Rate</th>
                    <th className="py-3 px-3 text-center">Items</th>
                    <th className="py-3 px-3 text-center">Issued</th>
                    <th className="py-3 px-3 text-center">Validity</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTemplates.map((tpl) => (
                    <tr
                      key={tpl.id}
                      className="hover:bg-light-background/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-light-background border border-border/80 text-primary-text">
                            {tpl.templateCode}
                          </span>
                          <div>
                            <p className="font-bold text-primary-text hover:text-sky-600 transition-colors">
                              {tpl.title}
                            </p>
                            <p className="text-[11px] text-secondary-text line-clamp-1">
                              {tpl.targetAudience}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getCategoryBadgeClass(
                            tpl.category
                          )}`}
                        >
                          {tpl.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-secondary-text font-medium">
                        {tpl.recommendedFleetSize}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-primary-text">
                        ৳{tpl.estimatedPerVehicleCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-secondary-text">
                        {tpl.items.length} components
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px]">
                          {tpl.usageCount}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-secondary-text">
                        {tpl.validityDays} Days
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewModalTemplate(tpl)}
                            title="Preview Template"
                            className="p-1.5 rounded-lg hover:bg-light-background text-secondary-text hover:text-primary-text transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateTemplate(tpl)}
                            title="Duplicate Template"
                            className="p-1.5 rounded-lg hover:bg-light-background text-secondary-text hover:text-primary-text transition cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTemplate(tpl.id)}
                            title="Delete Template"
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-secondary-text hover:text-red-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUseTemplate(tpl)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-2xs transition active:scale-95 cursor-pointer ml-1"
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
        <ViewProposalTemplateModal
          isOpen={!!viewModalTemplate}
          onClose={() => setViewModalTemplate(null)}
          template={viewModalTemplate}
          onUseTemplate={handleUseTemplate}
        />

        <UseProposalTemplateModal
          isOpen={!!useModalTemplate}
          onClose={() => setUseModalTemplate(null)}
          template={useModalTemplate}
          onProposalCreated={handleProposalCreated}
        />

        <CreateProposalTemplateModal
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