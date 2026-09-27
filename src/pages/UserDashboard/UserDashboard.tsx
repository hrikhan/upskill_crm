import React, { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import {
  Car,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  LifeBuoy,
  PhoneCall,
  Search,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  Wifi,
  X,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { COMPANY_CONFIG } from "@/config/companyConfig";

interface Vehicle {
  id: string;
  plateNumber: string;
  vehicleType: string;
  model: string;
  imei: string;
  simNumber: string;
  driverName: string;
  driverPhone: string;
  status: "Online" | "Idle" | "Offline";
  speed: string;
  ignition: "ON" | "OFF";
  lastPing: string;
  location: string;
}

interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  description: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  status: "Paid" | "Partially Paid" | "Unpaid";
}

const mockVehicles: Vehicle[] = [
  {
    id: "veh-1",
    plateNumber: "Dhaka Metro-GA-11-2049",
    vehicleType: "Covered Van (3-Ton)",
    model: "Concox GT06N Pro",
    imei: "867204058291048",
    simNumber: "+880 1711-234567",
    driverName: "Abul Kashem",
    driverPhone: "+880 1812-987654",
    status: "Online",
    speed: "54 km/h",
    ignition: "ON",
    lastPing: "Just now (12s ago)",
    location: "Dhaka-Chittagong Hwy, Daudkandi Bypass",
  },
  {
    id: "veh-2",
    plateNumber: "Dhaka Metro-TA-14-3820",
    vehicleType: "Prime Mover 40ft",
    model: "Teltonika FMB920 Fleet",
    imei: "869104047192837",
    simNumber: "+880 1711-345678",
    driverName: "Mohammad Rafiq",
    driverPhone: "+880 1723-456789",
    status: "Online",
    speed: "42 km/h",
    ignition: "ON",
    lastPing: "1 min ago",
    location: "Chittagong Port Gate 4, Barik Building",
  },
  {
    id: "veh-3",
    plateNumber: "Dhaka Metro-KHA-12-8840",
    vehicleType: "Toyota HiAce Microbus",
    model: "Concox GT06N Pro",
    imei: "864810294857102",
    simNumber: "+880 1711-456789",
    driverName: "Kabir Hossain",
    driverPhone: "+880 1934-567890",
    status: "Idle",
    speed: "0 km/h",
    ignition: "OFF",
    lastPing: "3 mins ago",
    location: "Tejgaon Industrial Area, Dhaka Depot",
  },
  {
    id: "veh-4",
    plateNumber: "Dhaka Metro-CHA-53-1992",
    vehicleType: "Pickup (1.5-Ton)",
    model: "SinoTrack ST-901 Mini",
    imei: "863920194857291",
    simNumber: "+880 1711-567890",
    driverName: "Sohel Rana",
    driverPhone: "+880 1645-678901",
    status: "Online",
    speed: "35 km/h",
    ignition: "ON",
    lastPing: "Just now (4s ago)",
    location: "Gazipur Chowrasta, Joydebpur Road",
  },
  {
    id: "veh-5",
    plateNumber: "Dhaka Metro-DA-15-7711",
    vehicleType: "Oil Tanker (9000L)",
    model: "Teltonika FMB920 Fleet",
    imei: "865019283746192",
    simNumber: "+880 1711-678901",
    driverName: "Abdul Mannan",
    driverPhone: "+880 1556-789012",
    status: "Offline",
    speed: "0 km/h",
    ignition: "OFF",
    lastPing: "2 hours ago",
    location: "Narayanganj Godnail Terminal Yard",
  },
];

const mockClientInvoices: ClientInvoice[] = [
  {
    id: "inv-c-1",
    invoiceNumber: "INV-2026-008",
    date: "2026-09-01",
    dueDate: "2026-09-10",
    description: "Monthly GPS Tracking Cloud Platform Service (5 Active Fleet Units)",
    amount: 1750,
    paidAmount: 1750,
    dueAmount: 0,
    status: "Paid",
  },
  {
    id: "inv-c-2",
    invoiceNumber: "INV-2026-004",
    date: "2026-08-01",
    dueDate: "2026-08-10",
    description: "Monthly GPS Tracking Cloud Platform Service (5 Active Fleet Units)",
    amount: 1750,
    paidAmount: 1750,
    dueAmount: 0,
    status: "Paid",
  },
  {
    id: "inv-c-3",
    invoiceNumber: "INV-2026-001",
    date: "2026-07-15",
    dueDate: "2026-07-25",
    description: "Hardware Procurement (5x Concox GT06N Pro) + Field On-site Installation",
    amount: 25000,
    paidAmount: 25000,
    dueAmount: 0,
    status: "Paid",
  },
];

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"vehicles" | "invoices" | "payment_methods">("vehicles");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(null);

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketVehicle, setTicketVehicle] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const filteredVehicles = mockVehicles.filter((v) => {
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.imei.includes(searchQuery) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setIsTicketModalOpen(false);
      setTicketSubject("");
      setTicketVehicle("");
      setTicketMessage("");
    }, 1500);
  };

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Welcome & Identity Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-2">
                <Shield className="w-4 h-4" />
                <span>Verified Client Enterprise Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Apex Logistics & Transport Ltd
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
                Managing 5 Live GPS Fleet Tracking Units | Account Officer: Tanvir Hasan
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Cloud GPS Server: Online
                </span>
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
                  <Clock className="w-3.5 h-3.5 text-indigo-300" /> Next Renewal: 10 Oct 2026
                </span>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-md transition-all active:scale-95"
              >
                <LifeBuoy className="w-4 h-4" />
                Support / Emergency
              </button>
              <a
                href={`tel:${COMPANY_CONFIG.phone}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                24/7 Helpline
              </a>
            </div>
          </div>
        </div>

        {/* Quick KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tracked Fleet</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">5 Vehicles</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">100% active contracts</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Car className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active / Moving</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">3 Online</h3>
              <p className="text-xs text-slate-500 mt-1">1 Idle • 1 Offline</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Wifi className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Plan</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">৳1,750 <span className="text-xs font-normal text-slate-500">/mo</span></h3>
              <p className="text-xs text-indigo-600 font-medium mt-1">350 Tk × 5 devices</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account Due Balance</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">৳0.00</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> All invoices cleared
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "vehicles"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Car className="w-4 h-4" />
            Tracked Vehicles ({mockVehicles.length})
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "invoices"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            Invoices & Payment Receipts ({mockClientInvoices.length})
          </button>
          <button
            onClick={() => setActiveTab("payment_methods")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "payment_methods"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Payment Channel Details
          </button>
        </div>

        {/* Tab 1: Tracked Vehicles */}
        {activeTab === "vehicles" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by license plate, driver, IMEI, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2">
                {["All", "Online", "Idle", "Offline"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      statusFilter === s
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Vehicle / Plate</th>
                      <th className="py-3.5 px-4">Hardware & SIM</th>
                      <th className="py-3.5 px-4">Driver & Contact</th>
                      <th className="py-3.5 px-4">Live Status</th>
                      <th className="py-3.5 px-4">Current Location</th>
                      <th className="py-3.5 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{vehicle.plateNumber}</div>
                          <div className="text-xs text-slate-500">{vehicle.vehicleType}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-xs font-medium text-slate-800">{vehicle.model}</div>
                          <div className="text-xs text-slate-500 font-mono">IMEI: {vehicle.imei}</div>
                          <div className="text-xs text-indigo-600 font-mono">{vehicle.simNumber}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{vehicle.driverName}</div>
                          <div className="text-xs text-slate-500">{vehicle.driverPhone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                vehicle.status === "Online"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : vehicle.status === "Idle"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  vehicle.status === "Online"
                                    ? "bg-emerald-500 animate-pulse"
                                    : vehicle.status === "Idle"
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                              />
                              {vehicle.status}
                            </span>
                            <span className="text-xs font-medium text-slate-600">{vehicle.speed}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{vehicle.lastPing}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-xs text-slate-700 truncate" title={vehicle.location}>
                            {vehicle.location}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => {
                              setTicketVehicle(vehicle.plateNumber);
                              setIsTicketModalOpen(true);
                            }}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            Report Issue
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Invoices & Receipts */}
        {activeTab === "invoices" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Billing History & Official Receipts</h3>
                <p className="text-xs text-slate-500">Download or view all issued sales and monthly tracking invoices</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Invoice #</th>
                    <th className="py-3.5 px-4">Billing Period / Details</th>
                    <th className="py-3.5 px-4">Date Issued</th>
                    <th className="py-3.5 px-4 text-right">Amount (Tk)</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockClientInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-indigo-600 font-mono">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="text-xs font-medium text-slate-900">{inv.description}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">{inv.date}</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                        ৳{inv.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Paid
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Payment Channel Details */}
        {activeTab === "payment_methods" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-pink-600">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center font-bold">
                  bK
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">bKash Merchant Payment</h3>
                  <p className="text-xs text-slate-500">Instant automatic payment verification</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Merchant Number:</span>
                  <span className="font-mono font-bold text-slate-900">{COMPANY_CONFIG.paymentAccounts.bkashMerchant}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Payment Reference:</span>
                  <span className="font-mono font-bold text-indigo-600">APEX-LOGISTICS</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Counter Number:</span>
                  <span className="font-mono font-bold text-slate-900">1</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Dial *247# or open bKash App &gt; Make Payment &gt; Enter Merchant number &gt; Enter Amount &gt; Use your company ID as reference.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold">
                  Bank
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Bank EFT / Cheque Deposit</h3>
                  <p className="text-xs text-slate-500">{COMPANY_CONFIG.paymentAccounts.bankName}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Account Name:</span>
                  <span className="font-bold text-slate-900">{COMPANY_CONFIG.paymentAccounts.accountName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Account Number:</span>
                  <span className="font-mono font-bold text-slate-900">{COMPANY_CONFIG.paymentAccounts.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Branch:</span>
                  <span className="text-slate-900">{COMPANY_CONFIG.paymentAccounts.bankBranch}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Routing Number:</span>
                  <span className="font-mono text-slate-900">{COMPANY_CONFIG.paymentAccounts.routingNumber}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Submit Ticket */}
        {isTicketModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Submit GPS Support Request</h3>
                </div>
                <button
                  onClick={() => setIsTicketModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {ticketSubmitted ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-slate-900">Request Dispatched!</h4>
                  <p className="text-xs text-slate-500">Our control room technical team has been notified.</p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                    <select
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      required
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select an issue type...</option>
                      <option value="Device Offline / Signal Lost">Device Offline / Signal Lost</option>
                      <option value="Ignition Acc State Mismatch">Ignition Acc State Mismatch</option>
                      <option value="Device Relocation Request">Device Relocation Request</option>
                      <option value="SIM Card Balance / Data Recharge">SIM Card Balance / Data Recharge</option>
                      <option value="Billing / Invoice Query">Billing / Invoice Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Affected Vehicle</label>
                    <select
                      value={ticketVehicle}
                      onChange={(e) => setTicketVehicle(e.target.value)}
                      required
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select vehicle...</option>
                      {mockVehicles.map((v) => (
                        <option key={v.id} value={v.plateNumber}>
                          {v.plateNumber} ({v.model})
                        </option>
                      ))}
                      <option value="Entire Fleet">Entire Fleet / Multiple</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Details / Location Note</label>
                    <textarea
                      rows={3}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Describe what happened or where the vehicle is currently parked..."
                      required
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsTicketModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send to Tech Support
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal: Invoice Preview */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    {COMPANY_CONFIG.logoInitials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{COMPANY_CONFIG.companyName}</h3>
                    <p className="text-[11px] text-slate-500">Official Payment Receipt & Billing Voucher</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Billed To:</span>
                  <strong className="text-slate-900">Apex Logistics & Transport Ltd</strong>
                  <p className="text-slate-500">Attn: Tanvir Hasan (Account Officer)</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block mb-0.5">Receipt Voucher #:</span>
                  <strong className="text-indigo-600 font-mono">{selectedInvoice.invoiceNumber}</strong>
                  <p className="text-slate-500">Date: {selectedInvoice.date}</p>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Total (Tk)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 text-slate-800 font-medium">{selectedInvoice.description}</td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        ৳{selectedInvoice.amount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Full Amount Cleared via bKash Merchant
                </span>
                <span className="font-bold text-emerald-900">
                  Total Paid: ৳{selectedInvoice.paidAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download / Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CommonWrapper>
  );
};

export default UserDashboard;
