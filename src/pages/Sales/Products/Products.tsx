import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Wifi,
  Wrench,
  DollarSign,
  Edit2,
  Trash2,
  X,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { COMPANY_CONFIG } from "@/config/companyConfig";

export interface ProductItem {
  id: string;
  code: string;
  name: string;
  category: "Hardware" | "Accessories" | "Service" | "Subscription";
  unitPrice: number;
  costPrice: number;
  stockQty: number;
  description: string;
  warranty: string;
  status: "in_stock" | "low_stock" | "service";
}

const initialProductsData: ProductItem[] = [
  {
    id: "prod-1",
    code: "GPS-TRK-01",
    name: "GPS Tracker Pro X1 (Fleet Commercial Heavy Duty)",
    category: "Hardware",
    unitPrice: 4500,
    costPrice: 2800,
    stockQty: 48,
    description: "IP67 waterproof, engine immobilizer relay, real-time 10s ping interval.",
    warranty: "1 Year Replacement",
    status: "in_stock",
  },
  {
    id: "prod-2",
    code: "GPS-MAG-02",
    name: "Magnetic GPS Tracker (Portable / 10,000mAh Battery)",
    category: "Hardware",
    unitPrice: 3800,
    costPrice: 2300,
    stockQty: 22,
    description: "Strong rare-earth magnet, 30-day battery standby, drop alert sensor.",
    warranty: "1 Year Replacement",
    status: "in_stock",
  },
  {
    id: "prod-3",
    code: "GPS-OBD-03",
    name: "OBD-II Plug & Play GPS Tracker for Sedans & SUVs",
    category: "Hardware",
    unitPrice: 3200,
    costPrice: 1900,
    stockQty: 5,
    description: "Direct OBD port installation, vehicle diagnostic telematics, zero wire cut.",
    warranty: "1 Year Replacement",
    status: "low_stock",
  },
  {
    id: "prod-4",
    code: "GPS-BIKE-04",
    name: "Motorbike Anti-Theft GPS Tracker (Compact)",
    category: "Hardware",
    unitPrice: 2800,
    costPrice: 1600,
    stockQty: 35,
    description: "Ultra-low power sleep mode, vibration alarm, remote engine cutoff.",
    warranty: "1 Year Replacement",
    status: "in_stock",
  },
  {
    id: "prod-5",
    code: "SRV-INST-05",
    name: "Vehicle Electrical Installation & Anti-Theft Wiring",
    category: "Service",
    unitPrice: 800,
    costPrice: 300,
    stockQty: 999,
    description: "Professional hidden wiring, ignition sense, and kill-switch integration.",
    warranty: "6 Months Service Warranty",
    status: "service",
  },
  {
    id: "prod-6",
    code: "SUB-SIM-06",
    name: "Yearly GPS Cloud Tracking Platform + Roaming SIM Package",
    category: "Subscription",
    unitPrice: 2400,
    costPrice: 1200,
    stockQty: 999,
    description: "12-month unlimited live web & mobile app tracking, multi-operator SIM.",
    warranty: "12 Months Dedicated Access",
    status: "service",
  },
  {
    id: "prod-7",
    code: "ACC-FUEL-07",
    name: "Digital Ultrasonic Fuel Sensor Level Telematics",
    category: "Accessories",
    unitPrice: 6500,
    costPrice: 4200,
    stockQty: 8,
    description: "High accuracy fuel monitoring sensor for trucks, generators, and fleet tanks.",
    warranty: "1 Year Replacement",
    status: "low_stock",
  },
];

export default function Products() {
  const [products, setProducts] = useState<ProductItem[]>(initialProductsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formCode, setFormCode] = useState(`GPS-HW-0${products.length + 1}`);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<ProductItem["category"]>("Hardware");
  const [formUnitPrice, setFormUnitPrice] = useState<number>(3500);
  const [formCostPrice, setFormCostPrice] = useState<number>(2000);
  const [formStock, setFormStock] = useState<number>(20);
  const [formDesc, setFormDesc] = useState("");
  const [formWarranty, setFormWarranty] = useState("1 Year Replacement");

  // Stats
  const stats = useMemo(() => {
    const totalInventoryValue = products
      .filter((p) => p.category === "Hardware" || p.category === "Accessories")
      .reduce((sum, p) => sum + p.costPrice * p.stockQty, 0);

    const hardwareInStock = products
      .filter((p) => p.category === "Hardware")
      .reduce((sum, p) => sum + p.stockQty, 0);

    const lowStockCount = products.filter((p) => p.status === "low_stock").length;

    return {
      totalProducts: products.length,
      hardwareInStock,
      totalInventoryValue,
      lowStockCount,
    };
  }, [products]);

  // Filtered
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Product name is required");
      return;
    }

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      code: formCode.trim() || `GPS-PROD-${Date.now().toString().slice(-4)}`,
      name: formName,
      category: formCategory,
      unitPrice: formUnitPrice,
      costPrice: formCostPrice,
      stockQty: formCategory === "Service" || formCategory === "Subscription" ? 999 : formStock,
      description: formDesc,
      warranty: formWarranty,
      status:
        formCategory === "Service" || formCategory === "Subscription"
          ? "service"
          : formStock <= 10
          ? "low_stock"
          : "in_stock",
    };

    setProducts((prev) => [newProd, ...prev]);
    toast.success(`Product ${newProd.name} added to catalog!`);
    setIsAddOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from product catalog?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product removed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary-text">
            Products & Hardware Catalog
          </h1>
          <p className="text-xs text-secondary-text mt-0.5">
            Master price book for GPS trackers, telematics sensors, and SIM subscription packages
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Product / Item
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <AnimatedContainer delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card surface rounded-2xl p-5 border border-sky-200 dark:border-sky-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Catalog Items
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  {stats.totalProducts} Items
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-border/40">
                <Package className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Active hardware models & service packages
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-emerald-200 dark:border-emerald-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Hardware in Stock
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  {stats.hardwareInStock} Units
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-border/40">
                <Cpu className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Physical GPS trackers ready for deployment
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-indigo-200 dark:border-indigo-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Hardware Inventory Value
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  Tk,{stats.totalInventoryValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-border/40">
                <DollarSign className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Total stock procurement asset value
            </div>
          </div>

          <div className="bg-card surface rounded-2xl p-5 border border-amber-200 dark:border-amber-900/50 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">
                  Low Stock Alerts
                </span>
                <span className="text-2xl font-bold tracking-tight text-primary-text mt-1 block">
                  {stats.lowStockCount} Models
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-border/40">
                <AlertTriangle className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-secondary-text">
              Requires re-order from factory supplier
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Filter Toolbar */}
      <AnimatedContainer delay={0.1}>
        <div className="bg-card surface rounded-2xl p-4 border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["all", "Hardware", "Accessories", "Service", "Subscription"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-light-background/60 hover:bg-light-background text-secondary-text hover:text-primary-text border border-border/50"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
            <div className="relative grow max-w-md">
              <Search className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search item code, tracker model, or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-light-background/60 border border-border text-xs text-primary-text placeholder:text-secondary-text focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="text-xs text-secondary-text font-medium">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Products Table */}
      <AnimatedContainer delay={0.15}>
        <div className="bg-card surface rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-light-background/40 text-secondary-text uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Item & Model Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Selling Price</th>
                  <th className="py-3 px-4 text-right">Cost Price</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4">Warranty</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-secondary-text">
                      No products found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-light-background/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                        {p.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-primary-text">{p.name}</div>
                        <div className="text-[11px] text-secondary-text line-clamp-1">
                          {p.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            p.category === "Hardware"
                              ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                              : p.category === "Subscription"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : p.category === "Accessories"
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-primary-text">
                        Tk,{p.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right text-secondary-text">
                        Tk,{p.costPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {p.category === "Service" || p.category === "Subscription" ? (
                          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            Continuous Service
                          </span>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              p.stockQty <= 10
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                            }`}
                          >
                            {p.stockQty} Units
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-secondary-text text-[11px]">
                        {p.warranty}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Remove Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedContainer>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-card surface rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-border/40">
                  <Package className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-primary-text">Add Product / Item</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Product Code *
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductItem["category"])}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  >
                    <option value="Hardware">Hardware (GPS Tracker)</option>
                    <option value="Accessories">Accessories & Sensors</option>
                    <option value="Service">Service & Installation</option>
                    <option value="Subscription">SIM Cloud Subscription</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Item / Model Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. GPS Tracker Pro X2 with Dual SIM"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Selling Price (Tk) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formUnitPrice}
                    onChange={(e) => setFormUnitPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-sky-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Cost Price (Tk) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs font-medium text-secondary-text"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary-text block mb-1.5">
                    Stock Qty *
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={formCategory === "Service" || formCategory === "Subscription"}
                    value={formCategory === "Service" || formCategory === "Subscription" ? "999" : formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold text-primary-text disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Warranty & Terms
                </label>
                <input
                  type="text"
                  value={formWarranty}
                  onChange={(e) => setFormWarranty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary-text block mb-1.5">
                  Technical Specifications / Description
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-primary-text resize-none"
                  placeholder="e.g. Engine cutoff relay, internal backup battery, 4G LTE CAT1..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}