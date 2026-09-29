import React, { useState, useEffect } from "react";
import {
  X,
  Truck,
  Sparkles,
  Calculator,
  Send,
  Building,
  User,
  Phone,
  Mail,
  Percent,
  Calendar,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { ProposalTemplate, ProposalTemplateLineItem } from "../proposalTemplatesData";

export interface GeneratedProposalData {
  templateCode: string;
  proposalTitle: string;
  clientName: string;
  contactPerson: string;
  phone: string;
  email: string;
  salesRep: string;
  fleetUnits: number;
  date: string;
  validUntil: string;
  discountPercent: number;
  items: Array<{
    name: string;
    type: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }>;
  grossAmount: number;
  discountAmount: number;
  netTotal: number;
  notes: string;
}

interface UseProposalTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ProposalTemplate | null;
  onProposalCreated: (data: GeneratedProposalData) => void;
}

export const UseProposalTemplateModal: React.FC<UseProposalTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onProposalCreated,
}) => {
  const [clientName, setClientName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [salesRep, setSalesRep] = useState("Hridoy Khan (Admin)");
  const [fleetUnits, setFleetUnits] = useState(25);
  const [proposalDate, setProposalDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [validityDays, setValidityDays] = useState(30);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [enabledOptionalIds, setEnabledOptionalIds] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (template) {
      setClientName("");
      setContactPerson("");
      setPhone("");
      setEmail("");
      setSalesRep("Hridoy Khan (Admin)");
      setFleetUnits(25);
      setProposalDate(new Date().toISOString().split("T")[0]);
      setValidityDays(template.validityDays || 30);
      setDiscountPercent(template.standardDiscountPercent || 10);
      setNotes(`Quotation prepared according to ${template.title} specifications. Payment terms: ${template.defaultPaymentTerms}.`);
      
      const optDefaults: Record<string, boolean> = {};
      template.items.forEach((item) => {
        if (item.isOptional) {
          optDefaults[item.id] = false;
        }
      });
      setEnabledOptionalIds(optDefaults);
    }
  }, [template]);

  if (!isOpen || !template) return null;

  // Calculate Valid Until Date
  const startDateObj = new Date(proposalDate || new Date());
  const validUntilObj = new Date(startDateObj);
  validUntilObj.setDate(validUntilObj.getDate() + Number(validityDays || 30));
  const validUntilFormatted = validUntilObj.toISOString().split("T")[0];

  // Filter active items
  const activeItems = template.items.filter((item) => {
    if (!item.isOptional) return true;
    return !!enabledOptionalIds[item.id];
  });

  // Calculate line items with actual multiplied quantities
  const calculatedItems = activeItems.map((item) => {
    const totalQty = item.defaultQuantityPerVehicle * fleetUnits;
    const totalAmount = totalQty * item.defaultUnitPrice;
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      unitPrice: item.defaultUnitPrice,
      quantity: totalQty,
      total: totalAmount,
    };
  });

  // Categorized subtotals
  const hardwareSubtotal = calculatedItems
    .filter((i) => i.type === "hardware" || i.type === "accessory")
    .reduce((sum, i) => sum + i.total, 0);

  const servicesSubtotal = calculatedItems
    .filter((i) => i.type === "installation" || i.type === "service")
    .reduce((sum, i) => sum + i.total, 0);

  const subscriptionSubtotal = calculatedItems
    .filter((i) => i.type === "subscription")
    .reduce((sum, i) => sum + i.total, 0);

  const grossTotal = hardwareSubtotal + servicesSubtotal + subscriptionSubtotal;
  const discountAmount = Math.round((grossTotal * discountPercent) / 100);
  const netTotal = grossTotal - discountAmount;

  const toggleOptionalItem = (id: string) => {
    setEnabledOptionalIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const proposalTitle = `${clientName.trim()} - ${fleetUnits} Units ${template.title}`;

    onProposalCreated({
      templateCode: template.templateCode,
      proposalTitle,
      clientName: clientName.trim(),
      contactPerson: contactPerson.trim() || "Fleet Director",
      phone: phone.trim() || "017XXXXXXXX",
      email: email.trim() || `${clientName.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
      salesRep,
      fleetUnits: Number(fleetUnits),
      date: proposalDate,
      validUntil: validUntilFormatted,
      discountPercent: Number(discountPercent),
      items: calculatedItems.map((i) => ({
        name: i.name,
        type: i.type,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        total: i.total,
      })),
      grossAmount: grossTotal,
      discountAmount,
      netTotal,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-card surface border border-border rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-light-background/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary-text">
                  {template.templateCode}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {template.category}
                </span>
              </div>
              <h2 className="text-base font-bold text-primary-text line-clamp-1 mt-0.5">
                Generate Proposal from Template
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-secondary-text hover:text-primary-text hover:bg-card border border-border/60 transition cursor-pointer"
            title="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* Target Client Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-sky-500" />
              1. Client & Account Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Company / Organization Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Acme Transport Logistics Ltd"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-light-background border border-border focus:border-sky-500 text-primary-text focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Contact Person & Designation
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Mahfuzur Rahman (General Manager)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-light-background border border-border focus:border-sky-500 text-primary-text focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-light-background border border-border focus:border-sky-500 text-primary-text focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Official Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="fleet@acme-logistics.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-light-background border border-border focus:border-sky-500 text-primary-text focus:outline-hidden text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fleet Scale & Schedule Parameters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-500" />
              2. Fleet Scale & Commercial Parameters
            </h4>

            <div className="p-4 rounded-xl bg-light-background border border-border space-y-4">
              {/* Fleet Units Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-primary-text flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    Fleet Quantity to Equip
                  </span>
                  <span className="font-mono text-sm font-bold text-sky-600 dark:text-sky-400">
                    {fleetUnits} Vehicles
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="150"
                    value={fleetUnits}
                    onChange={(e) => setFleetUnits(Math.max(1, Number(e.target.value)))}
                    className="flex-1 accent-sky-600 cursor-pointer h-2 bg-card rounded-lg"
                  />
                  <input
                    type="number"
                    min="1"
                    value={fleetUnits}
                    onChange={(e) => setFleetUnits(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2.5 py-1.5 rounded-lg bg-card border border-border text-center font-mono font-bold text-xs text-primary-text"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-secondary-text mt-1">
                  <span>1 Unit (Solo Pilot)</span>
                  <span>Recommended: {template.recommendedFleetSize}</span>
                  <span>150+ Units</span>
                </div>
              </div>

              {/* Proposal Date, Validity, Discount, Sales Rep */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60">
                <div>
                  <label className="block text-[11px] font-medium text-secondary-text mb-1">
                    Proposal Date
                  </label>
                  <input
                    type="date"
                    value={proposalDate}
                    onChange={(e) => setProposalDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-secondary-text mb-1">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    min="7"
                    max="90"
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text"
                  />
                  <span className="text-[10px] text-secondary-text mt-0.5 block">
                    Valid till: {validUntilFormatted}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-secondary-text mb-1">
                    Volume Discount %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full pl-2.5 pr-6 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text"
                    />
                    <Percent className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary-text" />
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    -৳{discountAmount.toLocaleString()} saving
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-secondary-text mb-1">
                    Sales Representative
                  </label>
                  <select
                    value={salesRep}
                    onChange={(e) => setSalesRep(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-card border border-border text-xs text-primary-text"
                  >
                    <option value="Hridoy Khan (Admin)">Hridoy Khan (Admin)</option>
                    <option value="Sarah Jenkins (Sales)">Sarah Jenkins (Sales)</option>
                    <option value="Tariqul Islam (Ops)">Tariqul Islam (Ops)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Line Items Calculation Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                3. Calculated Line Items ({fleetUnits} Vehicles)
              </span>
              <span className="text-[11px] text-secondary-text lowercase">
                Check optional items to include
              </span>
            </h4>

            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-light-background/80 border-b border-border text-secondary-text font-semibold">
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3 text-center">Unit Rate</th>
                    <th className="py-2 px-3 text-center">Total Qty</th>
                    <th className="py-2 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {template.items.map((item) => {
                    const isSelected = item.isOptional
                      ? !!enabledOptionalIds[item.id]
                      : true;
                    const lineQty = item.defaultQuantityPerVehicle * fleetUnits;
                    const lineTotal = lineQty * item.defaultUnitPrice;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isSelected
                            ? "hover:bg-light-background/30"
                            : "opacity-50 bg-light-background/10"
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="flex items-start gap-2">
                            {item.isOptional ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleOptionalItem(item.id)}
                                className="mt-0.5 accent-sky-600 rounded cursor-pointer"
                              />
                            ) : (
                              <span className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex items-center justify-center">
                                ✓
                              </span>
                            )}
                            <div>
                              <p className="font-semibold text-primary-text">
                                {item.name}
                                {item.isOptional && (
                                  <span className="ml-2 text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                                    (Optional Addon)
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-secondary-text">
                                {item.defaultQuantityPerVehicle} per vehicle
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-secondary-text">
                          ৳{item.defaultUnitPrice.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-primary-text">
                          {isSelected ? lineQty : 0}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-primary-text">
                          ৳{(isSelected ? lineTotal : 0).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Proposal Quotation Summary Card */}
          <div className="p-4 rounded-xl bg-card border-2 border-sky-500/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs text-secondary-text">
              <p>
                <strong className="text-primary-text">Hardware & Accessories:</strong>{" "}
                ৳{hardwareSubtotal.toLocaleString()}
              </p>
              <p>
                <strong className="text-primary-text">Installation & Deployment:</strong>{" "}
                ৳{servicesSubtotal.toLocaleString()}
              </p>
              <p>
                <strong className="text-primary-text">1st-Year Cloud Subscriptions:</strong>{" "}
                ৳{subscriptionSubtotal.toLocaleString()}
              </p>
              {discountAmount > 0 && (
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Volume Discount ({discountPercent}%): -৳{discountAmount.toLocaleString()}
                </p>
              )}
            </div>

            <div className="text-right sm:border-l sm:border-border sm:pl-6">
              <span className="text-[11px] uppercase tracking-wider text-secondary-text font-bold block">
                Net Proposal Total
              </span>
              <span className="font-mono text-2xl font-extrabold text-sky-600 dark:text-sky-400 block mt-0.5">
                ৳{netTotal.toLocaleString()}
              </span>
              <span className="text-[10px] text-secondary-text">
                (৳{Math.round(netTotal / fleetUnits).toLocaleString()} per vehicle turnkey)
              </span>
            </div>
          </div>

          {/* Notes & Commercial Terms */}
          <div>
            <label className="block text-xs font-medium text-secondary-text mb-1">
              Proposal Notes & Commercial Terms
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-light-background border border-border focus:border-sky-500 text-primary-text focus:outline-hidden text-xs resize-none"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-light-background/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-secondary-text hover:text-primary-text hover:bg-card border border-border/80 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!clientName.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Generate Official Proposal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
