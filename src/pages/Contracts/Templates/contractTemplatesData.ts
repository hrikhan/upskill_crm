export interface ContractClause {
  id: string;
  clauseNumber: string;
  heading: string;
  body: string;
  isMandatory: boolean;
}

export interface ContractTemplate {
  id: string;
  templateCode: string;
  title: string;
  contractType: "Fleet AMC (Annual)" | "SLA Telematics Service" | "Hardware Lease & Maintenance" | "Custom SLA";
  description: string;
  standardDurationMonths: number;
  standardBillingCycle: "Monthly Recurring" | "Quarterly" | "Annual Advance";
  baseRatePerUnitMonth: number;
  slaResponseHours: number;
  slaUptimeGuarantee: string;
  status: "Active" | "Draft";
  usageCount: number;
  clauses: ContractClause[];
  includedServices: string[];
  excludedServices: string[];
  paymentTerms: string;
  lastUpdated: string;
}

export const initialContractTemplates: ContractTemplate[] = [
  {
    id: "tpl-ctr-1",
    templateCode: "TPL-AMC-01",
    title: "Standard Annual Fleet AMC & Hardware Maintenance Agreement",
    contractType: "Fleet AMC (Annual)",
    description: "Comprehensive 12-month maintenance contract for commercial transport fleets. Includes on-site emergency repairs, relay harness replacement, SIM renewals, and platform access.",
    standardDurationMonths: 12,
    standardBillingCycle: "Annual Advance",
    baseRatePerUnitMonth: 350,
    slaResponseHours: 8,
    slaUptimeGuarantee: "99.5% Uptime",
    status: "Active",
    usageCount: 14,
    lastUpdated: "2026-08-10",
    paymentTerms: "Annual advance or Net 15 days upon AMC anniversary date",
    includedServices: [
      "24/7 Real-Time Cloud GPS Tracking Web & Mobile Access",
      "Unlimited 4G M2M SIM Data renewals (Grameenphone/Robi)",
      "Free replacement of damaged 40A immobilizer relays",
      "On-site emergency technician visits for disconnected wiring",
      "Quarterly battery & electrical health inspection report",
    ],
    excludedServices: [
      "Physical device total loss or theft without police GD report",
      "Damage caused by vehicle fire, engine submergence, or flood",
      "Tampering or wire cutting by unauthorized third-party technicians",
    ],
    clauses: [
      {
        id: "c1-1",
        clauseNumber: "1.0",
        heading: "Scope of Telematics Maintenance",
        body: "The Service Provider undertakes to provide continuous GPS fleet tracking telematics server access, proactive device heartbeat monitoring, and hardware field servicing for the contracted vehicles.",
        isMandatory: true,
      },
      {
        id: "c1-2",
        clauseNumber: "2.0",
        heading: "Technician Dispatch & SLA",
        body: "Upon formal receipt of an offline unit support ticket, the Service Provider shall dispatch a certified field technician to the designated client depot within 8 business hours.",
        isMandatory: true,
      },
      {
        id: "c1-3",
        clauseNumber: "3.0",
        heading: "Device Warranty & Relay Replacement",
        body: "All genuine Concox and Teltonika GPS hardware units under this AMC are guaranteed against manufacturing defects. Damaged relays and blown fuses shall be replaced without additional labor charges.",
        isMandatory: true,
      },
      {
        id: "c1-4",
        clauseNumber: "4.0",
        heading: "Payment Terms & Invoice Settlement",
        body: "Invoices shall be raised annually or quarterly as specified in the schedule. The Client agrees to clear all billing within fifteen (15) calendar days from receipt of invoice via Bank Transfer or bKash Merchant.",
        isMandatory: true,
      },
    ],
  },
  {
    id: "tpl-ctr-2",
    templateCode: "TPL-SLA-02",
    title: "Mission-Critical Enterprise SLA with 99.9% Uptime Guarantee",
    contractType: "SLA Telematics Service",
    description: "High-priority agreement for courier distribution, cash-in-transit, and refrigerated pharmaceutical logistics. Includes 4-hour on-site dispatch and dedicated account engineer.",
    standardDurationMonths: 12,
    standardBillingCycle: "Monthly Recurring",
    baseRatePerUnitMonth: 450,
    slaResponseHours: 4,
    slaUptimeGuarantee: "99.9% Uptime",
    status: "Active",
    usageCount: 9,
    lastUpdated: "2026-08-25",
    paymentTerms: "Monthly recurring billing due on the 5th of each calendar month",
    includedServices: [
      "Dedicated Enterprise Account Engineer & Priority Support Hotline",
      "Rapid 4-hour on-site depot dispatch for critical offline alarms",
      "99.9% Platform & Cloud Telematics Server Uptime SLA",
      "Custom Webhook & REST API integration to client ERP/WMS",
      "Monthly geofence deviation and driver speeding safety audit",
    ],
    excludedServices: [
      "Downtime resulting from national telecommunication network blackouts",
      "Tampering by driver where anti-tamper security seal is broken",
    ],
    clauses: [
      {
        id: "c2-1",
        clauseNumber: "1.0",
        heading: "High-Priority SLA Commitment",
        body: "The Service Provider guarantees 99.9% platform availability. In the event of system downtime exceeding 0.1% in any billing month, the Client shall receive a 5% credit on that month's service fee.",
        isMandatory: true,
      },
      {
        id: "c2-2",
        clauseNumber: "2.0",
        heading: "Rapid Field Response (4-Hour Window)",
        body: "Critical alerts involving anti-hijack relay failure or total device disconnect will be addressed on-site within 4 hours within Dhaka and Chittagong metropolitan bounds.",
        isMandatory: true,
      },
      {
        id: "c2-3",
        clauseNumber: "3.0",
        heading: "API Access & Data Security",
        body: "The Service Provider grants the Client non-exclusive API access to retrieve raw telemetry pings. All GPS location logs shall be encrypted at rest and stored for a minimum of 24 months.",
        isMandatory: true,
      },
    ],
  },
  {
    id: "tpl-ctr-3",
    templateCode: "TPL-LEASE-03",
    title: "Zero-Capex Hardware Lease & Comprehensive Maintenance",
    contractType: "Hardware Lease & Maintenance",
    description: "Turnkey hardware subscription where the GPS units remain the property of the Service Provider. Low upfront cost for the client, with full hardware lifetime warranty.",
    standardDurationMonths: 24,
    standardBillingCycle: "Monthly Recurring",
    baseRatePerUnitMonth: 550,
    slaResponseHours: 12,
    slaUptimeGuarantee: "99.0% Uptime",
    status: "Active",
    usageCount: 6,
    lastUpdated: "2026-09-01",
    paymentTerms: "Monthly advance subscription with 1-month refundable security deposit",
    includedServices: [
      "Zero upfront capital expenditure for GPS tracking hardware",
      "Full hardware replacement guarantee for device failures",
      "Continuous SIM connectivity & server access included",
      "Free de-installation and re-installation upon vehicle replacement",
    ],
    excludedServices: [
      "Client failure to return leased hardware upon contract termination",
      "Deliberate physical destruction of GPS casing or internal antenna",
    ],
    clauses: [
      {
        id: "c3-1",
        clauseNumber: "1.0",
        heading: "Title & Ownership of Leased Equipment",
        body: "All GPS tracker units, sensors, and wiring harnesses remain the exclusive personal property of the Service Provider throughout the lease tenure.",
        isMandatory: true,
      },
      {
        id: "c3-2",
        clauseNumber: "2.0",
        heading: "Early Termination & Hardware Handback",
        body: "Upon contract expiration or termination, the Client shall allow the Service Provider's technicians peaceful access to de-install and recover all leased devices within 14 days.",
        isMandatory: true,
      },
      {
        id: "c3-3",
        clauseNumber: "3.0",
        heading: "Security Deposit Terms",
        body: "The initial security deposit of one month's fee per unit will be credited back or refunded in full upon safe return of the leased equipment.",
        isMandatory: true,
      },
    ],
  },
  {
    id: "tpl-ctr-4",
    templateCode: "TPL-FUEL-04",
    title: "Specialized Oil Tanker & Ultrasonic Fuel Sensor AMC",
    contractType: "Custom SLA",
    description: "Customized technical SLA for petroleum bulk carriers, ready-mix concrete fleets, and long-haul trucks equipped with precision fuel level rods and anti-theft alarms.",
    standardDurationMonths: 12,
    standardBillingCycle: "Quarterly",
    baseRatePerUnitMonth: 650,
    slaResponseHours: 6,
    slaUptimeGuarantee: "99.5% Uptime",
    status: "Active",
    usageCount: 4,
    lastUpdated: "2026-09-12",
    paymentTerms: "Quarterly advance payments due at start of each calendar quarter",
    includedServices: [
      "Biannual digital liter recalibration and sensor rod cleaning",
      "Rapid fuel drop & anti-siphoning theft alert monitoring",
      "Flame-proof conduit piping inspection and safety compliance check",
      "Trip-by-trip fuel consumption vs mileage efficiency analytics",
    ],
    excludedServices: [
      "Fuel contamination resulting from chemical solvent transport",
      "Mechanical damage to fuel tank exterior caused by road collisions",
    ],
    clauses: [
      {
        id: "c4-1",
        clauseNumber: "1.0",
        heading: "Fuel Measurement Accuracy Benchmark",
        body: "The Service Provider guarantees fuel level measurement accuracy within ±1.5% of total tank capacity under standard operating temperatures (20°C to 40°C).",
        isMandatory: true,
      },
      {
        id: "c4-2",
        clauseNumber: "2.0",
        heading: "Theft Alert Notification Protocol",
        body: "Sudden drops in fuel volume exceeding 15 liters while vehicle ignition is OFF shall trigger an automated SMS notification to the Client's security supervisor within 60 seconds.",
        isMandatory: true,
      },
      {
        id: "c4-3",
        clauseNumber: "3.0",
        heading: "Hazardous Materials & Explosive Atmosphere Safety",
        body: "All technicians performing fuel sensor calibration are certified for hazardous petroleum depot work and must adhere to client refinery safety protocols.",
        isMandatory: true,
      },
    ],
  },
];
