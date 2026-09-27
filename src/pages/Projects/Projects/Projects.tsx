import React, { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Folder,
  Plus,
  Search,
  Truck,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { COMPANY_CONFIG } from "@/config/companyConfig";

interface FleetProject {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  contactPerson: string;
  totalVehicles: number;
  installedVehicles: number;
  projectLead: string;
  startDate: string;
  deadline: string;
  budget: number;
  status: "In Progress" | "Planning" | "Completed" | "On Hold";
  trackerModel: string;
}

const initialProjects: FleetProject[] = [
  {
    id: "proj-1",
    projectCode: "PRJ-2026-01",
    projectName: "Apex Logistics 50 Covered Vans Deployment Phase 1",
    clientName: "Apex Logistics Ltd",
    contactPerson: "Tanvir Hasan",
    totalVehicles: 50,
    installedVehicles: 38,
    projectLead: "Engr. Nayeem (Deployment Lead)",
    startDate: "2026-09-01",
    deadline: "2026-10-15",
    budget: 250000,
    status: "In Progress",
    trackerModel: "Concox GT06N Pro",
  },
  {
    id: "proj-2",
    projectCode: "PRJ-2026-02",
    projectName: "Pathao Express 100 Delivery Bikes GPS & Relay Onboarding",
    clientName: "Pathao Express Fleet",
    contactPerson: "Farhan Ahmed",
    totalVehicles: 100,
    installedVehicles: 100,
    projectLead: "Md. Rubel Hossain (Field Lead)",
    startDate: "2026-08-10",
    deadline: "2026-09-20",
    budget: 420000,
    status: "Completed",
    trackerModel: "SinoTrack ST-901 Mini",
  },
  {
    id: "proj-3",
    projectCode: "PRJ-2026-03",
    projectName: "Walton Distribution 30 Factory Haulers Telematics Upgrade",
    clientName: "Walton Distribution Haulers",
    contactPerson: "Engr. Mahmudul Hasan",
    totalVehicles: 30,
    installedVehicles: 12,
    projectLead: "Engr. Nayeem (Deployment Lead)",
    startDate: "2026-09-15",
    deadline: "2026-10-30",
    budget: 180000,
    status: "In Progress",
    trackerModel: "Teltonika FMB920 Fleet",
  },
  {
    id: "proj-4",
    projectCode: "PRJ-2026-04",
    projectName: "Shun Shing Bulk Oil Tankers Ultrasonic Fuel Monitoring",
    clientName: "Shun Shing Edible Oil Bulk",
    contactPerson: "Shahriar Kabir",
    totalVehicles: 25,
    installedVehicles: 5,
    projectLead: "Jahangir Alam (Senior Tech)",
    startDate: "2026-09-20",
    deadline: "2026-11-10",
    budget: 225000,
    status: "Planning",
    trackerModel: "Capacitive Fuel Rod + GT06N",
  },
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<FleetProject[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newTotal, setNewTotal] = useState(20);
  const [newLead, setNewLead] = useState("Engr. Nayeem (Deployment Lead)");
  const [newDeadline, setNewDeadline] = useState("2026-11-30");
  const [newBudget, setNewBudget] = useState(100000);
  const [newModel, setNewModel] = useState(COMPANY_CONFIG.productPresets[0]?.name || "Concox GT06N Pro");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj: FleetProject = {
      id: `proj-${Date.now()}`,
      projectCode: `PRJ-2026-${projects.length + 1 < 10 ? `0${projects.length + 1}` : projects.length + 1}`,
      projectName: newName,
      clientName: newClient,
      contactPerson: newContact,
      totalVehicles: Number(newTotal),
      installedVehicles: 0,
      projectLead: newLead,
      startDate: new Date().toISOString().split("T")[0],
      deadline: newDeadline,
      budget: Number(newBudget),
      status: "Planning",
      trackerModel: newModel,
    };
    setProjects([newProj, ...projects]);
    setIsModalOpen(false);
    setNewName("");
    setNewClient("");
    setNewContact("");
  };

  const totalVehiclesContracted = projects.reduce((acc, p) => acc + p.totalVehicles, 0);
  const totalVehiclesInstalled = projects.reduce((acc, p) => acc + p.installedVehicles, 0);
  const totalDeploymentBudget = projects.reduce((acc, p) => acc + p.budget, 0);

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <Folder className="w-4 h-4" />
              <span>Enterprise Rollouts & Installations</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Fleet Deployment Projects
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track large-scale GPS tracker hardware installations, fleet onboarding phases, and milestones.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Fleet Rollout
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Deployments</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{projects.length} Projects</h3>
              <p className="text-xs text-indigo-600 font-medium mt-1">Multi-vehicle rollouts</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Folder className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Installation Progress</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                {totalVehiclesInstalled} / {totalVehiclesContracted}
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                {((totalVehiclesInstalled / totalVehiclesContracted) * 100).toFixed(0)}% Fleet Installed
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Project Value</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ৳{totalDeploymentBudget.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Hardware & labor revenue</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fully Deployed</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                {projects.filter((p) => p.status === "Completed").length} Finished
              </h3>
              <p className="text-xs text-slate-500 mt-1">Ready for monthly billing</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, code, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Projects Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p) => {
            const percentage = Math.round((p.installedVehicles / p.totalVehicles) * 100);
            return (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600">{p.projectCode}</span>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">{p.projectName}</h3>
                    <p className="text-xs text-slate-500">Client: {p.clientName} ({p.contactPerson})</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : p.status === "In Progress"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">
                      Installation Progress ({p.installedVehicles} / {p.totalVehicles} Vehicles)
                    </span>
                    <span className="font-bold text-slate-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage === 100 ? "bg-emerald-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Hardware Model:</span>
                    <strong className="text-slate-800">{p.trackerModel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Project Budget:</span>
                    <strong className="text-indigo-600">৳{p.budget.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Deployment Lead:</span>
                    <span className="text-slate-700">{p.projectLead}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Target Completion:</span>
                    <span className="text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {p.deadline}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: New Fleet Rollout */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">New Fleet Deployment Project</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Haulers 40 Truck GPS Installation"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Client Company</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Haulers Ltd"
                      value={newClient}
                      onChange={(e) => setNewClient(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Officer</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rafiqul Islam"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Total Vehicles</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newTotal}
                      onChange={(e) => setNewTotal(Number(e.target.value))}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Total Budget (Tk)</label>
                    <input
                      type="number"
                      required
                      value={newBudget}
                      onChange={(e) => setNewBudget(Number(e.target.value))}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Deadline</label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hardware Model</label>
                  <select
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {COMPANY_CONFIG.productPresets.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} (৳{p.unitPrice.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Launch Rollout
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CommonWrapper>
  );
};

export default Projects;