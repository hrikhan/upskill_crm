import React, { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import {
  Bell,
  Building,
  CheckCircle2,
  CreditCard,
  Database,
  Globe,
  Radio,
  Save,
  Server,
  Shield,
  Smartphone,
  Sliders,
} from "lucide-react";
import { COMPANY_CONFIG } from "@/config/companyConfig";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "payments" | "telematics" | "billing">("general");

  // General Company Settings
  const [companyName, setCompanyName] = useState(COMPANY_CONFIG.companyName);
  const [brandShortName, setBrandShortName] = useState(COMPANY_CONFIG.brandShortName);
  const [tagline, setTagline] = useState(COMPANY_CONFIG.tagline);
  const [address, setAddress] = useState(COMPANY_CONFIG.address);
  const [phone, setPhone] = useState(COMPANY_CONFIG.phone);
  const [email, setEmail] = useState(COMPANY_CONFIG.email);
  const [supportEmail, setSupportEmail] = useState(COMPANY_CONFIG.supportEmail);
  const [website, setWebsite] = useState(COMPANY_CONFIG.website);

  // Payment Accounts
  const [bkashMerchant, setBkashMerchant] = useState(COMPANY_CONFIG.paymentAccounts.bkashMerchant);
  const [nagadMerchant, setNagadMerchant] = useState(COMPANY_CONFIG.paymentAccounts.nagadMerchant);
  const [bankName, setBankName] = useState(COMPANY_CONFIG.paymentAccounts.bankName);
  const [bankBranch, setBankBranch] = useState(COMPANY_CONFIG.paymentAccounts.bankBranch);
  const [accountName, setAccountName] = useState(COMPANY_CONFIG.paymentAccounts.accountName);
  const [accountNumber, setAccountNumber] = useState(COMPANY_CONFIG.paymentAccounts.accountNumber);
  const [routingNumber, setRoutingNumber] = useState(COMPANY_CONFIG.paymentAccounts.routingNumber);

  // Telematics & GPS Server
  const [gpsServerDomain, setGpsServerDomain] = useState("tracking.upskillcrm.com:5023");
  const [pingIntervalMoving, setPingIntervalMoving] = useState(10);
  const [pingIntervalStop, setPingIntervalStop] = useState(180);
  const [smsGatewayProvider, setSmsGatewayProvider] = useState("Greenweb Bangladesh SMS API");
  const [smsApiKey, setSmsApiKey] = useState("gw_live_9948201948201");
  const [overspeedThreshold, setOverspeedThreshold] = useState(80);

  // Billing & Subscriptions
  const [defaultSubscriptionRate, setDefaultSubscriptionRate] = useState(350);
  const [invoiceDueDays, setInvoiceDueDays] = useState(10);
  const [taxPercent, setTaxPercent] = useState(0);
  const [invoiceTerms, setInvoiceTerms] = useState(COMPANY_CONFIG.invoiceTerms);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("System configurations saved successfully!");
  };

  return (
    <CommonWrapper>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Platform & Brand Configuration</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              CRM & Telematics System Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage organization details, bKash & Bank payment credentials, GPS tracking servers, and billing rules.
            </p>
          </div>

          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "general"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building className="w-4 h-4" />
            Company Identity
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "payments"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            bKash & Bank Gateways
          </button>
          <button
            onClick={() => setActiveTab("telematics")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "telematics"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Radio className="w-4 h-4" />
            GPS Server & Telemetry SMS
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "billing"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Database className="w-4 h-4" />
            Billing & Invoicing Rules
          </button>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Tab 1: General Company Identity */}
          {activeTab === "general" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 text-base">Corporate Profile & Branding</h3>
              <p className="text-xs text-slate-500">
                These values are displayed on printed invoices, client quotation proposals, and headers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Registered Legal Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Short Name</label>
                  <input
                    type="text"
                    value={brandShortName}
                    onChange={(e) => setBrandShortName(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline / Mission</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Head Office Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Helpline Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Payments & Gateways */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Mobile Financial Services (MFS)</h3>
                <p className="text-xs text-slate-500">
                  Accounts presented to clients for paying invoices & monthly GPS subscriptions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">bKash Merchant Number</label>
                    <input
                      type="text"
                      value={bkashMerchant}
                      onChange={(e) => setBkashMerchant(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nagad Merchant Number</label>
                    <input
                      type="text"
                      value={nagadMerchant}
                      onChange={(e) => setNagadMerchant(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Primary Corporate Bank Account (EFT / Cheque)</h3>
                <p className="text-xs text-slate-500">Bank deposit info printed on corporate client invoices.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Name</label>
                    <input
                      type="text"
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Title / Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Routing Number</label>
                    <input
                      type="text"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Telematics & GPS Server */}
          {activeTab === "telematics" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 text-base">GPS Telematics Server & SMS Gateway</h3>
              <p className="text-xs text-slate-500">
                Protocols for device pings, SMS relay commands, and overspeed alerts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GPS Telemetry Server Host:Port</label>
                  <input
                    type="text"
                    value={gpsServerDomain}
                    onChange={(e) => setGpsServerDomain(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Moving Ping Interval (Seconds)</label>
                  <input
                    type="number"
                    min={5}
                    value={pingIntervalMoving}
                    onChange={(e) => setPingIntervalMoving(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stop / Parked Ping Interval (Seconds)</label>
                  <input
                    type="number"
                    min={60}
                    value={pingIntervalStop}
                    onChange={(e) => setPingIntervalStop(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SMS Gateway Provider</label>
                  <input
                    type="text"
                    value={smsGatewayProvider}
                    onChange={(e) => setSmsGatewayProvider(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SMS API Token / Key</label>
                  <input
                    type="password"
                    value={smsApiKey}
                    onChange={(e) => setSmsApiKey(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Default Fleet Overspeed Threshold (km/h)</label>
                <input
                  type="number"
                  value={overspeedThreshold}
                  onChange={(e) => setOverspeedThreshold(Number(e.target.value))}
                  className="w-full sm:w-48 text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Tab 4: Billing Rules */}
          {activeTab === "billing" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 text-base">Invoicing Defaults & Standard Terms</h3>
              <p className="text-xs text-slate-500">Global billing formulas, payment terms, and warranty text.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Monthly Rate / Unit (Tk)</label>
                  <input
                    type="number"
                    value={defaultSubscriptionRate}
                    onChange={(e) => setDefaultSubscriptionRate(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Grace Period (Days)</label>
                  <input
                    type="number"
                    value={invoiceDueDays}
                    onChange={(e) => setInvoiceDueDays(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">VAT / Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Default Terms & Warranty Printed on Invoices</label>
                <textarea
                  rows={4}
                  value={invoiceTerms}
                  onChange={(e) => setInvoiceTerms(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save System Settings
            </button>
          </div>
        </form>
      </div>
    </CommonWrapper>
  );
};

export default Settings;