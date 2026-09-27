import React, { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  LifeBuoy,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Smartphone,
  User,
  X,
  Send,
} from "lucide-react";
import { COMPANY_CONFIG } from "@/config/companyConfig";

interface SupportTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  contactPerson: string;
  contactPhone: string;
  vehiclePlate: string;
  deviceImei: string;
  subject: string;
  category: "Device Offline" | "Remote Relay / Cutoff" | "SIM Data Depleted" | "Hardware RMA Defect" | "Billing Inquiry";
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedTo: string;
  createdAt: string;
  lastReply: string;
}

const initialTickets: SupportTicket[] = [
  {
    id: "tkt-1",
    ticketNumber: "TKT-8021",
    clientName: "Apex Logistics Ltd",
    contactPerson: "Tanvir Hasan",
    contactPhone: "+880 1812-987654",
    vehiclePlate: "Dhaka Metro-GA-11-2049",
    deviceImei: "867204058291048",
    subject: "Tracker shows offline since last night near Daudkandi Bridge",
    category: "Device Offline",
    priority: "Urgent",
    status: "In Progress",
    assignedTo: "Asif Mahmud (Support Lead)",
    createdAt: "2026-09-27 09:30",
    lastReply: "Technician dispatched to depot to check power wiring.",
  },
  {
    id: "tkt-2",
    ticketNumber: "TKT-8022",
    clientName: "Pathao Express Fleet",
    contactPerson: "Farhan Ahmed",
    contactPhone: "+880 1711-456789",
    vehiclePlate: "Dhaka Metro-TA-14-3820",
    deviceImei: "869104047192837",
    subject: "Relay immobilizer command not stopping engine from mobile app",
    category: "Remote Relay / Cutoff",
    priority: "High",
    status: "Open",
    assignedTo: "Kazi Nayeem (IoT Engineer)",
    createdAt: "2026-09-27 11:15",
    lastReply: "Ticket acknowledged, checking SMS relay gateway response.",
  },
  {
    id: "tkt-3",
    ticketNumber: "TKT-8023",
    clientName: "Walton Distribution Haulers",
    contactPerson: "Engr. Mahmudul Hasan",
    contactPhone: "+880 1912-334455",
    vehiclePlate: "Dhaka Metro-KHA-12-8840",
    deviceImei: "864810294857102",
    subject: "Hardware defective: GPS blue LED blinking rapidly, no satellite fix",
    category: "Hardware RMA Defect",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Asif Mahmud (Support Lead)",
    createdAt: "2026-09-26 14:00",
    lastReply: "Approved for 1-year replacement warranty under RMA-402.",
  },
  {
    id: "tkt-4",
    ticketNumber: "TKT-8024",
    clientName: "Bashundhara ReadyMix Fleet",
    contactPerson: "Tariqul Islam",
    contactPhone: "+880 1733-998877",
    vehiclePlate: "Dhaka Metro-CHA-53-1992",
    deviceImei: "863920194857291",
    subject: "GP IoT SIM card balance expired, unable to send telemetry packets",
    category: "SIM Data Depleted",
    priority: "High",
    status: "Resolved",
    assignedTo: "Billing Desk (Recharge Ops)",
    createdAt: "2026-09-25 10:00",
    lastReply: "Recharged 1GB 30-Day GP IoT bundle. Telemetry online.",
  },
  {
    id: "tkt-5",
    ticketNumber: "TKT-8025",
    clientName: "Shun Shing Edible Oil Bulk",
    contactPerson: "Shahriar Kabir",
    contactPhone: "+880 1611-223344",
    vehiclePlate: "Dhaka Metro-DA-15-7711",
    deviceImei: "865019283746192",
    subject: "Need updated August monthly subscription tax invoice copy",
    category: "Billing Inquiry",
    priority: "Low",
    status: "Closed",
    assignedTo: "Billing Desk",
    createdAt: "2026-09-24 16:30",
    lastReply: "VAT invoice sent to billing@shunshing.com.",
  },
];

const Tickets: React.FC = () => {
  const [tickets, setTasks] = useState<SupportTicket[]>(initialTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // New ticket state
  const [newClient, setNewClient] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newImei, setNewImei] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<SupportTicket["category"]>("Device Offline");
  const [newPriority, setNewPriority] = useState<SupportTicket["priority"]>("Medium");
  const [newAssigned, setNewAssigned] = useState("Asif Mahmud (Support Lead)");

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.deviceImei.includes(searchQuery);
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesCat = categoryFilter === "All" || t.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTkt: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${8020 + tickets.length + 1}`,
      clientName: newClient,
      contactPerson: newContact,
      contactPhone: newPhone,
      vehiclePlate: newPlate,
      deviceImei: newImei || "860000000000000",
      subject: newSubject,
      category: newCategory,
      priority: newPriority,
      status: "Open",
      assignedTo: newAssigned,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      lastReply: "Ticket opened by support center.",
    };
    setTasks([newTkt, ...tickets]);
    setIsCreateModalOpen(false);
    setNewClient("");
    setNewContact("");
    setNewPhone("");
    setNewPlate("");
    setNewImei("");
    setNewSubject("");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;
    setTasks(
      tickets.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, lastReply: replyMessage, status: "In Progress" }
          : t
      )
    );
    setSelectedTicket({ ...selectedTicket, lastReply: replyMessage, status: "In Progress" });
    setReplyMessage("");
  };

  const handleStatusChange = (id: string, newStatus: SupportTicket["status"]) => {
    setTasks(tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <LifeBuoy className="w-4 h-4" />
              <span>Customer Care & Device RMA</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Support Tickets & Technical RMA
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Handle client device offline alarms, remote relay immobilization queries, and warranty replacements.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Open Support Ticket
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Tickets</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length}
              </h3>
              <p className="text-xs text-indigo-600 font-medium mt-1">Requires tech response</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Urgent SOS</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">
                {tickets.filter((t) => t.priority === "Urgent" && t.status !== "Closed").length}
              </h3>
              <p className="text-xs text-rose-600 font-medium mt-1">High priority alarms</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Resolution</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">2.4 Hours</h3>
              <p className="text-xs text-slate-500 mt-1">Field & Control Room SLA</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resolved Rate</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">94.2%</h3>
              <p className="text-xs text-purple-600 font-medium mt-1">Client satisfaction</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket #, client, IMEI, vehicle plate..."
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
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="All">All Issue Categories</option>
              <option value="Device Offline">Device Offline</option>
              <option value="Remote Relay / Cutoff">Remote Relay / Cutoff</option>
              <option value="SIM Data Depleted">SIM Data Depleted</option>
              <option value="Hardware RMA Defect">Hardware RMA Defect</option>
              <option value="Billing Inquiry">Billing Inquiry</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ticket #</th>
                  <th className="py-3.5 px-4">Subject & Issue</th>
                  <th className="py-3.5 px-4">Client & Vehicle</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Assigned Officer</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 text-xs">
                      {t.ticketNumber}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-900">{t.subject}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-indigo-600 font-medium">{t.category}</span>
                        <span className="text-[11px] text-slate-400 font-mono">IMEI: {t.deviceImei}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{t.clientName}</div>
                      <div className="text-xs text-slate-500 font-mono">{t.vehiclePlate}</div>
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
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-800">
                      {t.assignedTo}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          t.status === "Open"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : t.status === "In Progress"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : t.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reply / Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: View & Reply Ticket */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-600">{selectedTicket.ticketNumber}</span>
                  <h3 className="font-bold text-slate-900 text-base">{selectedTicket.subject}</h3>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block">Client:</span>
                  <strong className="text-slate-900">{selectedTicket.clientName}</strong>
                  <p className="text-slate-500">{selectedTicket.contactPerson} ({selectedTicket.contactPhone})</p>
                </div>
                <div>
                  <span className="text-slate-400 block">Vehicle & Device:</span>
                  <strong className="text-slate-900">{selectedTicket.vehiclePlate}</strong>
                  <p className="text-slate-500 font-mono">IMEI: {selectedTicket.deviceImei}</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
                <span className="font-semibold text-indigo-900 block mb-1">Latest Communication / Activity:</span>
                <p className="text-slate-700">{selectedTicket.lastReply}</p>
              </div>

              <form onSubmit={handleSendReply} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Add Technical Response / Note</label>
                  <textarea
                    rows={3}
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Enter technician update, diagnostic result, or message for client..."
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-slate-600">Update Status:</span>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedTicket.id, "Resolved")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200"
                    >
                      Mark Resolved
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedTicket.id, "Closed")}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                    >
                      Close Ticket
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create Ticket */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Open Customer Support Ticket</h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GPS Tracker offline since 2 hours"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Device Offline">Device Offline / No Ping</option>
                      <option value="Remote Relay / Cutoff">Remote Relay / Cutoff</option>
                      <option value="SIM Data Depleted">SIM Data Depleted</option>
                      <option value="Hardware RMA Defect">Hardware RMA Defect</option>
                      <option value="Billing Inquiry">Billing Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Urgent">Urgent (SOS/Theft Risk)</option>
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
                    >
                    </input>
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Device IMEI</label>
                    <input
                      type="text"
                      placeholder="867204058291048"
                      value={newImei}
                      onChange={(e) => setNewImei(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Support Officer</label>
                    <select
                      value={newAssigned}
                      onChange={(e) => setNewAssigned(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Asif Mahmud (Support Lead)">Asif Mahmud (Support Lead)</option>
                      <option value="Kazi Nayeem (IoT Engineer)">Kazi Nayeem (IoT Engineer)</option>
                      <option value="Billing Desk">Billing Desk</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Open Ticket
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

export default Tickets;