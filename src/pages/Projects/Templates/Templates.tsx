import React, { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import {
  Folder,
  Plus,
  Search,
  Truck,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ProjectTemplate,
  initialProjectTemplates,
} from "./projectTemplatesData";
import { TemplateCard } from "./_components/TemplateCard";
import { ViewTemplateModal } from "./_components/ViewTemplateModal";
import { UseTemplateModal } from "./_components/UseTemplateModal";
import { CreateTemplateModal } from "./_components/CreateTemplateModal";

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ProjectTemplate[]>(
    initialProjectTemplates
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [viewModalTemplate, setViewModalTemplate] =
    useState<ProjectTemplate | null>(null);
  const [useModalTemplate, setUseModalTemplate] =
    useState<ProjectTemplate | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter logic
  const categories = [
    "All",
    "Commercial Haulers",
    "Motorbike Delivery",
    "Fuel & Telematics",
    "Cold Chain & Temperature",
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.templateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.defaultTrackerModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || tpl.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate top KPIs
  const totalBlueprints = templates.length;
  const totalSpawned = templates.reduce((acc, t) => acc + t.usageCount, 0);
  const avgDuration =
    templates.length > 0
      ? Math.round(
          templates.reduce((acc, t) => acc + t.estimatedTotalDays, 0) /
            templates.length
        )
      : 0;
  const activeHardwareModels = Array.from(
    new Set(templates.map((t) => t.defaultTrackerModel))
  ).length;

  // Handlers
  const handleUseTemplate = (template: ProjectTemplate) => {
    setUseModalTemplate(template);
  };

  const handleProjectCreated = (projectData: {
    projectName: string;
    clientName: string;
    contactPerson: string;
    totalVehicles: number;
    projectLead: string;
    deadline: string;
    budget: number;
    trackerModel: string;
    templateCode: string;
  }) => {
    // Increment usage count for template
    setTemplates((prev) =>
      prev.map((t) =>
        t.templateCode === projectData.templateCode
          ? { ...t, usageCount: t.usageCount + 1 }
          : t
      )
    );

    toast.success(
      `Fleet Project "${projectData.projectName}" created successfully!`,
      {
        description: `${projectData.totalVehicles} units assigned to ${projectData.projectLead}. Estimated budget: ৳${projectData.budget.toLocaleString()}.`,
        action: {
          label: "View Projects",
          onClick: () => navigate("/admin/projects/projects"),
        },
      }
    );
  };

  const handleDuplicateTemplate = (template: ProjectTemplate) => {
    const duplicated: ProjectTemplate = {
      ...template,
      id: `tpl-${Date.now()}`,
      templateCode: `${template.templateCode}-COPY`,
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTemplates([duplicated, ...templates]);
    toast.success(`Template ${template.templateCode} duplicated successfully!`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const target = templates.find((t) => t.id === templateId);
    if (!target) return;

    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    toast.info(`Template "${target.templateCode}" deleted.`);
  };

  const handleTemplateCreated = (newTemplate: ProjectTemplate) => {
    setTemplates([newTemplate, ...templates]);
    toast.success(`New template ${newTemplate.templateCode} created!`);
  };

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card surface p-6 rounded-2xl border border-border shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Folder className="w-4 h-4" />
              <span>Standardized Fleet Blueprints</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-text tracking-tight">
              Fleet Project Templates
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
              Reusable multi-phase installation blueprints, hardware specifications, and labor benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
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
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                Covering {categories.length - 1} fleet sectors
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Folder className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Projects Spawned
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {totalSpawned} Rollouts
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Launched from standard templates
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Avg. Rollout Velocity
              </p>
              <h3 className="text-2xl font-bold text-primary-text mt-1">
                ~{avgDuration} Days
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Standard milestone timeline
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card surface border border-border shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                Hardware Baselines
              </p>
              <h3 className="text-2xl font-bold text-primary-text mt-1">
                {activeHardwareModels} GPS Models
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Concox, Teltonika & SinoTrack
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
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
              placeholder="Search templates by code, vehicle type, or GPS model..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-light-background border border-border focus:border-indigo-500 text-primary-text focus:outline-hidden text-xs"
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-card surface text-secondary-text hover:text-primary-text border border-border hover:bg-light-background"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Display Area */}
        {filteredTemplates.length === 0 ? (
          <div className="p-12 text-center bg-card surface rounded-2xl border border-border">
            <Folder className="w-12 h-12 text-secondary-text/60 mx-auto mb-3" />
            <h3 className="text-base font-bold text-primary-text">
              No project templates found
            </h3>
            <p className="text-xs text-secondary-text mt-1 max-w-sm mx-auto">
              Try adjusting your search query or vehicle sector filters, or create a new template blueprint.
            </p>
            <button
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
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredTemplates.map((template) => (
              <TemplateCard
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
                    <th className="px-5 py-3.5">Code & Template Name</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Target Fleet</th>
                    <th className="px-4 py-3.5">Default GPS</th>
                    <th className="px-4 py-3.5">Duration</th>
                    <th className="px-4 py-3.5">Est. Unit Cost</th>
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
                        <div className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          {tpl.templateCode}
                        </div>
                        <div className="font-semibold text-primary-text text-xs mt-0.5 max-w-xs truncate">
                          {tpl.name}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-light-background border border-border text-secondary-text">
                          {tpl.category}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-primary-text">
                        {tpl.targetVehiclesRange}
                      </td>

                      <td className="px-4 py-3.5 text-secondary-text">
                        {tpl.defaultTrackerModel}
                      </td>

                      <td className="px-4 py-3.5 text-primary-text">
                        {tpl.estimatedTotalDays} Days
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ৳{tpl.estimatedBudgetPerVehicle.toLocaleString()}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-700 dark:text-indigo-300 text-[11px]">
                          {tpl.usageCount}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewModalTemplate(tpl)}
                            className="p-1.5 rounded-lg border border-border bg-card hover:bg-light-background text-secondary-text hover:text-primary-text transition cursor-pointer"
                            title="View Roadmap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUseTemplate(tpl)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] shadow-2xs transition flex items-center gap-1 cursor-pointer"
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
        <ViewTemplateModal
          isOpen={Boolean(viewModalTemplate)}
          onClose={() => setViewModalTemplate(null)}
          template={viewModalTemplate}
          onUseTemplate={handleUseTemplate}
        />

        <UseTemplateModal
          isOpen={Boolean(useModalTemplate)}
          onClose={() => setUseModalTemplate(null)}
          template={useModalTemplate}
          onProjectCreated={handleProjectCreated}
        />

        <CreateTemplateModal
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