import React, { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  ListTodo,
  MapPin,
  Plus,
  Search,
  Truck,
  User,
  Wrench,
  X,
  AlertTriangle,
} from "lucide-react";
import { COMPANY_CONFIG } from "@/config/companyConfig";

interface FieldTask {
  id: string;
  taskCode: string;
  title: string;
  taskType: "New Installation" | "Troubleshooting" | "Device Relocation" | "Fuel Sensor Calibration" | "SIM Card Replacement";
  clientName: string;
  vehiclePlate: string;
  location: string;
  assignedTechnician: string;
  technicianPhone: string;
  scheduledDate: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  deviceModel: string;
}

const initialTasks: FieldTask[] = [
  {
    id: "task-1",
    taskCode: "TSK-2026-101",
    title: "Install Concox GT06N + Relay on 3 Delivery Vans",
    taskType: "New Installation",
    clientName: "Apex Logistics Ltd",
    vehiclePlate: "Dhaka Metro-GA-11-2049",
    location: "Tejgaon Truck Depot, Bay 4",
    assignedTechnician: "Md. Rubel Hossain",
    technicianPhone: "+880 1712-445566",
    scheduledDate: "2026-09-28",
    priority: "High",
    status: "In Progress",
    deviceModel: "Concox GT06N Pro",
  },
  {
    id: "task-2",
    taskCode: "TSK-2026-102",
    title: "Offline Device Diagnosis & Antenna Check",
    taskType: "Troubleshooting",
    clientName: "Shun Shing Edible Oil Bulk",
    vehiclePlate: "Dhaka Metro-DA-15-7711",
    location: "Narayanganj Godnail Terminal Yard",
    assignedTechnician: "Jahangir Alam",
    technicianPhone: "+880 1819-332211",
    scheduledDate: "2026-09-27",
    priority: "Urgent",
    status: "Pending",
    deviceModel: "Teltonika FMB920 Fleet",
  },
  {
    id: "task-3",
    taskCode: "TSK-2026-103",
    title: "Fuel Ultrasonic Sensor Calibration",
    taskType: "Fuel Sensor Calibration",
    clientName: "Pathao Express Fleet",
    vehiclePlate: "Dhaka Metro-TA-14-3820",
    location: "Gazipur Chowrasta Depot",
    assignedTechnician: "Md. Rubel Hossain",
    technicianPhone: "+880 1712-445566",
    scheduledDate: "2026-09-29",
    priority: "Medium",
    status: "Pending",
    deviceModel: "Capacitive Fuel Rod (100cm)",
  },
  {
    id: "task-4",
    taskCode: "TSK-2026-104",
    title: "De-install from Old Microbus and Relocate to New HiAce",
    taskType: "Device Relocation",
    clientName: "Walton Distribution Haulers",
    vehiclePlate: "Dhaka Metro-KHA-12-8840",
    location: "Kalyanpur Bus Stand Workshop",
    assignedTechnician: "Tanvir Ahmed (Senior Tech)",
    technicianPhone: "+880 1911-554433",
    scheduledDate: "2026-09-26",
    priority: "High",
    status: "Completed",
    deviceModel: "Concox GT06N Pro",
  },
  {
    id: "task-5",
    taskCode: "TSK-2026-105",
    title: "Swap Inactive TeleTalk SIM with Grameenphone IoT SIM",
    taskType: "SIM Card Replacement",
    clientName: "Bashundhara ReadyMix Fleet",
    vehiclePlate: "Dhaka Metro-CHA-53-1992",
    location: "Bashundhara R/A Plant Site",
    assignedTechnician: "Jahangir Alam",
    technicianPhone: "+880 1819-332211",
    scheduledDate: "2026-09-25",
    priority: "Low",
    status: "Completed",
    deviceModel: "SinoTrack ST-901 Mini",
  },
];

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<FieldTask[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<FieldTask["taskType"]>("New Installation");
  const [newClient, setNewClient] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newTechnician, setNewTechnician] = useState("Md. Rubel Hossain");
  const [newDate, setNewDate] = useState("");
  const [newPriority, setNewPriority] = useState<FieldTask["priority"]>("Medium");
  const [newDevice, setNewDevice] = useState(COMPANY_CONFIG.productPresets[0]?.name || "Concox GT06N Pro");

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.taskCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedTechnician.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesType = typeFilter === "All" || t.taskType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: FieldTask = {
      id: `task-${Date.now()}`,
      taskCode: `TSK-2026-${tasks.length + 101}`,
      title: newTitle,
      taskType: newType,
      clientName: newClient,
      vehiclePlate: newPlate,
      location: newLocation,
      assignedTechnician: newTechnician,
      technicianPhone: newTechnician.includes("Rubel") ? "+880 1712-445566" : "+880 1819-332211",
      scheduledDate: newDate || new Date().toISOString().split("T")[0],
      priority: newPriority,
      status: "Pending",
      deviceModel: newDevice,
    };
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewClient("");
    setNewPlate("");
    setNewLocation("");
  };

  const handleToggleStatus = (id: string, currentStatus: FieldTask["status"]) => {
    const nextStatus: FieldTask["status"] =
      currentStatus === "Pending"
        ? "In Progress"
        : currentStatus === "In Progress"
        ? "Completed"
        : "Pending";
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
  };

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <ListTodo className="w-4 h-4" />
              <span>Fleet Operations & Maintenance</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Field Installation & Support Tasks
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Dispatch technicians for GPS tracker wiring, fuel calibrations, and emergency device repairs.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Schedule Field Task
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Scheduled</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{tasks.length} Tasks</h3>
              <p className="text-xs text-indigo-600 font-medium mt-1">Field operations queue</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Progress</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">
                {tasks.filter((t) => t.status === "In Progress").length} Dispatched
              </h3>
              <p className="text-xs text-slate-500 mt-1">Technicians on-site</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Assignment</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">
                {tasks.filter((t) => t.status === "Pending").length} Pending
              </h3>
              <p className="text-xs text-slate-500 mt-1">Awaiting dispatch</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed This Week</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                {tasks.filter((t) => t.status === "Completed").length} Finished
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">Verified working devices</p>
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
              placeholder="Search by task #, vehicle plate, client, technician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="All">All Task Types</option>
              <option value="New Installation">New Installation</option>
              <option value="Troubleshooting">Troubleshooting</option>
              <option value="Device Relocation">Device Relocation</option>
              <option value="Fuel Sensor Calibration">Fuel Calibration</option>
              <option value="SIM Card Replacement">SIM Swap</option>
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Task Code</th>
                  <th className="py-3.5 px-4">Task & Device</th>
                  <th className="py-3.5 px-4">Client & Vehicle</th>
                  <th className="py-3.5 px-4">Field Location</th>
                  <th className="py-3.5 px-4">Technician</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600 text-xs">
                      {t.taskCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{t.title}</div>
                      <div className="text-xs text-indigo-600 font-medium">{t.deviceModel}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{t.taskType}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{t.clientName}</div>
                      <div className="text-xs text-slate-500 font-mono">{t.vehiclePlate}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate" title={t.location}>{t.location}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {t.scheduledDate}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 text-xs">{t.assignedTechnician}</div>
                      <div className="text-xs text-slate-500">{t.technicianPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                          t.priority === "Urgent"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : t.priority === "High"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(t.id, t.status)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          t.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : t.status === "In Progress"
                            ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to cycle status: Pending -> In Progress -> Completed"
                      >
                        {t.status === "Completed" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {t.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(t.id, t.status)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {t.status === "Completed" ? "Re-open" : "Next Stage"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Schedule Field Task */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Schedule Field Installation / Repair</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Install 2x Concox GT06N on Covered Vans"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Task Category</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="New Installation">New Installation</option>
                      <option value="Troubleshooting">Troubleshooting / Offline</option>
                      <option value="Device Relocation">Device Relocation</option>
                      <option value="Fuel Sensor Calibration">Fuel Sensor Calibration</option>
                      <option value="SIM Card Replacement">SIM Card Replacement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Urgent">Urgent (SOS/Critical)</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Client Company</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Logistics Ltd"
                      value={newClient}
                      onChange={(e) => setNewClient(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle License Plate</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhaka Metro-GA-11-2049"
                      value={newPlate}
                      onChange={(e) => setNewPlate(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Field Technician</label>
                    <select
                      value={newTechnician}
                      onChange={(e) => setNewTechnician(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Md. Rubel Hossain">Md. Rubel Hossain (Field Tech)</option>
                      <option value="Jahangir Alam">Jahangir Alam (Senior Tech)</option>
                      <option value="Tanvir Ahmed">Tanvir Ahmed (Depot Lead)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Installation Site / Workshop Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tejgaon Truck Depot, Bay 4, Dhaka"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
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
                    Dispatch Task
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

export default Tasks;