/**
 * Centralized Company Branding & GPS Business Configuration
 * 
 * Edit this file to change company name, GPS product catalog, address,
 * contact numbers, payment bank/bKash accounts, and warranty terms.
 */

export interface GpsProductPreset {
  id: string;
  name: string;
  category: "Hardware" | "Accessories" | "Service" | "Subscription";
  unitPrice: number;
  description: string;
}

export const COMPANY_CONFIG = {
  // Brand Identity
  companyName: "Upskill GPS Tracker Solutions Ltd",
  brandShortName: "Upskill CRM",
  tagline: "GPS Tracking, Telematics & IoT Fleet Solutions",
  logoInitials: "UC",

  // Contact & Physical Location
  address: "House 42, Road 11, Banani, Dhaka-1213, Bangladesh",
  phone: "+880 1700-000000",
  email: "billing@upskillcrm.com",
  supportEmail: "support@upskillcrm.com",
  website: "https://upskillcrm.com",

  // Currency
  currencyCode: "BDT",
  currencySymbol: "Tk,",

  // Payment Channels & Accounts
  paymentAccounts: {
    bkashMerchant: "01712-345678 (Make Payment)",
    nagadMerchant: "01812-345678 (Payment)",
    bankName: "Dutch-Bangla Bank Ltd (DBBL)",
    bankBranch: "Banani Branch, Dhaka",
    accountName: "Upskill Technologies Ltd",
    accountNumber: "110.120.34567",
    routingNumber: "090260481",
  },

  // Standard Warranty & Terms
  invoiceTerms:
    "Standard warranty of 1 year on hardware GPS tracking units. Free replacement for manufacturer defects within 30 days. Monthly SIM cloud tracking subscription active upon delivery.",

  // GPS Product Catalog Presets (Reusable across Invoices, Proposals, Subscriptions)
  productPresets: [
    {
      id: "prod-1",
      name: "GPS Tracker Pro X1 (Fleet Commercial Heavy Duty)",
      category: "Hardware",
      unitPrice: 4500,
      description: "IP67 waterproof, engine immobilizer relay, real-time 10s ping interval.",
    },
    {
      id: "prod-2",
      name: "Magnetic GPS Tracker (Portable / 10,000mAh Battery)",
      category: "Hardware",
      unitPrice: 3800,
      description: "Strong rare-earth magnet, 30-day battery standby, drop alert sensor.",
    },
    {
      id: "prod-3",
      name: "OBD-II Plug & Play GPS Tracker for Sedans & SUVs",
      category: "Hardware",
      unitPrice: 3200,
      description: "Direct OBD port installation, vehicle diagnostic telematics, zero wire cut.",
    },
    {
      id: "prod-4",
      name: "Motorbike Anti-Theft GPS Tracker (Compact)",
      category: "Hardware",
      unitPrice: 2800,
      description: "Ultra-low power sleep mode, vibration alarm, remote engine cutoff.",
    },
    {
      id: "prod-5",
      name: "Vehicle Electrical Installation & Anti-Theft Wiring",
      category: "Service",
      unitPrice: 800,
      description: "Professional hidden wiring, ignition sense, and kill-switch integration.",
    },
    {
      id: "prod-6",
      name: "Yearly GPS Cloud Tracking Platform + Roaming SIM Package",
      category: "Subscription",
      unitPrice: 2400,
      description: "12-month unlimited live web & mobile app tracking, multi-operator SIM.",
    },
    {
      id: "prod-7",
      name: "Digital Ultrasonic Fuel Sensor Level Telematics",
      category: "Accessories",
      unitPrice: 6500,
      description: "High accuracy fuel monitoring sensor for trucks, generators, and fleet tanks.",
    },
  ] as GpsProductPreset[],
};
