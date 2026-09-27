import React, { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileEdit,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { COMPANY_CONFIG } from "@/config/companyConfig";

interface ServiceContract {
  id: string;
  contractNumber: string;
  title: string;
  clientName: string;
  contactPerson: string;
  contractType: "Fleet AMC (Annual)" | "SLA Telematics Service" | "Hardware Lease & Maintenance" | "Custom SLA";
  unitsCovered: number;
  contractValue: number;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  status: "Active" | "Expiring Soon" | "Expired" | "Draft";
}

const initialContracts: ServiceContract[] = [
  {
    id: "ctr-1",
    contractNumber: "CTR-2026-041",
    title: "Annual Fleet Telematics & GPS Maintenance Agreement (64 Trucks)",
    clientName: "Apex Logistics Ltd",
    contactPerson: "Tanvir Hasan",
    contractType: "Fleet AMC (Annual)",
    unitsCovered: 64,
    contractValue: 268800,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    autoRenew: true,
    status: "Active",
  },
  {
    id: "ctr-2",
    contractNumber: "CTR-2026-042",
    title: "Enterprise Delivery Tracking SLA with 99.9% Uptime Guarantee",
    clientName: "Pathao Express Fleet",
    contactPerson: "Farhan Ahmed",
    contractType: "SLA Telematics Service",
    unitsCovered: 110,
    contractValue: 462000,
    startDate: "2026-02-15",
    endDate: "2027-02-14",
    autoRenew: true,
    status: "Active",
  },
  {
    id: "ctr-3",
    contractNumber: "CTR-2026-043",
    title: "Factory Hauler GPS Tracking & Emergency Fuel Monitoring AMC",
    clientName: "Walton Distribution Haulers",
    contactPerson: "Engr. Mahmudul Hasan",
    contractType: "Fleet AMC (Annual)",
    unitsCovered: 85,
    contractValue: 357000,
    startDate: "2025-10-10",
    endDate: "2026-10-09",
    autoRenew: false,
    status: "Expiring Soon",
  },
  {
    id: "ctr-4",
    contractNumber: "CTR-2026-044",
    title: "Oil Tanker Specialized Ultrasonic Sensor Maintenance Agreement",
    clientName: "Shun Shing Edible Oil Bulk",
    contactPerson: "Shahriar Kabir",
    contractType: "Hardware Lease & Maintenance",
    unitsCovered: 35,
    contractValue: 189000,
    startDate: "2026-03-01",
    endDate: "2027-02-28",
    autoRenew: true,
    status: "Active",
  },
  {
    id: "ctr-5",
    contractNumber: "CTR-2026-035",
    title: "Construction ReadyMix Truck Fleet Initial Year AMC",
    clientName: "Bashundhara ReadyMix Fleet",
    contactPerson: "Tariqul Islam",
    contractType: "Fleet AMC (Annual)",
    unitsCovered: 42,
    contractValue: 176400,
    startDate: "2025-08-01",
    endDate: "2026-07-31",
    autoRenew: false,
    status: "Expired",
  },
];

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<ServiceContract[]>(initialContracts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ServiceContract | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newType, setNewType] = useState<ServiceContract["contractType"]>("Fleet AMC (Annual)");
  const [newUnits, setNewUnits] = useState(10);
  const [newValue, setNewValue] = useState(42000);
  const [newStartDate, setNewStartDate] = useState("2026-09-01");
  const [newEndDate, setNewEndDate] = useState("2027-08-31");
  const [newAutoRenew, setNewAutoRenew] = useState(true);

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newCtr: ServiceContract = {
      id: `ctr-${Date.now()}`,
      contractNumber: `CTR-2026-${40 + contracts.length + 1}`,
      title: newTitle,
      clientName: newClient,
      contactPerson: newContact,
      contractType: newType,
      unitsCovered: Number(newUnits),
      contractValue: Number(newValue),
      startDate: newStartDate,
      endDate: newEndDate,
      autoRenew: newAutoRenew,
      status: "Active",
    };
    setContracts([newCtr, ...contracts]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewClient("");
    setNewContact("");
  };

  const totalContractPortfolio = contracts.reduce((acc, c) => acc + c.contractValue, 0);
  const totalFleetCovered = contracts.reduce((acc, c) => acc + c.unitsCovered, 0);

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <FileCheck className="w-4 h-4" />
              <span>Service Level Agreements & Warranties</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Service Contracts & Fleet AMCs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage enterprise Annual Maintenance Contracts, server SLA commitments, and fleet tracking renewals.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Service Contract
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contract Portfolio</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                ৳{totalContractPortfolio.toLocaleString()}
              </h3>
              <p className="text-xs text-indigo-600 font-medium mt-1">Annual signed commitments</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fleet Units Covered</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{totalFleetCovered} Units</h3>
              <p className="text-xs text-slate-500 mt-1">Under guaranteed SLA</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expiring Soon</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">
                {contracts.filter((c) => c.status === "Expiring Soon").length} Contracts
              </h3>
              <p className="text-xs text-amber-600 font-medium mt-1">Renewals within 30 days</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Compliance</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">100%</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">Free device replacement</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by contract #, client, or title..."
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
              <option value="Active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Contract #</th>
                  <th className="py-3.5 px-4">Contract Details & Type</th>
                  <th className="py-3.5 px-4">Client Company</th>
                  <th className="py-3.5 px-4 text-center">Units Covered</th>
                  <th className="py-3.5 px-4 text-right">Value (Tk)</th>
                  <th className="py-3.5 px-4">Period</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 text-xs">
                      {c.contractNumber}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-900">{c.title}</div>
                      <div className="text-xs text-indigo-600 font-medium">{c.contractType}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{c.clientName}</div>
                      <div className="text-xs text-slate-500">{c.contactPerson}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                        {c.unitsCovered} Units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      ৳{c.contractValue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div>{c.startDate} to {c.endDate}</div>
                      {c.autoRenew && (
                        <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                          <RefreshCw className="w-3 h-3" /> Auto-renews
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          c.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : c.status === "Expiring Soon"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedContract(c)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: View Contract */}
        {selectedContract && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">{selectedContract.contractNumber}</h3>
                </div>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedContract.title}</h4>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">{selectedContract.contractType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Service Provider:</span>
                  <strong className="text-slate-900">{COMPANY_CONFIG.companyName}</strong>
                  <p className="text-slate-500">{COMPANY_CONFIG.address}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Contracted Client:</span>
                  <strong className="text-slate-900">{selectedContract.clientName}</strong>
                  <p className="text-slate-500">Contact: {selectedContract.contactPerson}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Fleet Covered</span>
                  <strong className="text-slate-900 text-sm font-bold">{selectedContract.unitsCovered} Units</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Contract Value</span>
                  <strong className="text-indigo-600 text-sm font-bold">৳{selectedContract.contractValue.toLocaleString()}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Duration</span>
                  <strong className="text-slate-900 text-[11px] block mt-0.5">{selectedContract.startDate} to {selectedContract.endDate}</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                <span className="font-semibold block mb-0.5">Scope of Support:</span>
                24/7 Live GPS tracking server uptime, monthly telemetry SIM data packages, on-site technician visit within 24h, and free replacement for defective hardware units.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print Agreement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create Contract */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileEdit className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">New Fleet Service Contract / AMC</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateContract} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Fleet Telematics AMC (15 Units)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Officer</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Hasan"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Fleet AMC (Annual)">Fleet AMC (Annual)</option>
                      <option value="SLA Telematics Service">SLA Telematics</option>
                      <option value="Hardware Lease & Maintenance">Hardware Lease</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Units Covered</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newUnits}
                      onChange={(e) => setNewUnits(Number(e.target.value))}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Value (Tk)</label>
                    <input
                      type="number"
                      required
                      value={newValue}
                      onChange={(e) => setNewValue(Number(e.target.value))}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="autoRenew"
                    checked={newAutoRenew}
                    onChange={(e) => setNewAutoRenew(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <label htmlFor="autoRenew" className="text-xs text-slate-700 font-medium">
                    Auto-renew contract annually unless 30-day notice is given
                  </label>
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
                    Save Contract
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

export default Contracts;