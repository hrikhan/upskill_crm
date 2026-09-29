export interface ProposalTemplateLineItem {
  id: string;
  type: "hardware" | "installation" | "subscription" | "accessory" | "service";
  name: string;
  description: string;
  defaultUnitPrice: number;
  defaultQuantityPerVehicle: number;
  isOptional: boolean;
}

export interface ProposalTemplateScopeItem {
  phase: string;
  title: string;
  deliverables: string[];
}

export interface ProposalTemplate {
  id: string;
  templateCode: string;
  title: string;
  category:
    | "Enterprise Fleet"
    | "Cold Chain"
    | "Fuel Telematics"
    | "Plug & Play"
    | "Heavy Asset"
    | "Video Telematics";
  targetAudience: string;
  description: string;
  validityDays: number;
  defaultPaymentTerms: string;
  standardDiscountPercent: number;
  status: "Active" | "Draft";
  usageCount: number;
  estimatedPerVehicleCost: number;
  recommendedFleetSize: string;
  turnaroundTime: string;
  items: ProposalTemplateLineItem[];
  scopeOfWork: ProposalTemplateScopeItem[];
  termsAndConditions: string[];
  includedPerks: string[];
  lastUpdated: string;
}

export const initialProposalTemplates: ProposalTemplate[] = [
  {
    id: "tpl-prop-1",
    templateCode: "TPL-PROP-01",
    title: "Commercial Fleet Heavy Duty GPS & Remote Immobilizer Package",
    category: "Enterprise Fleet",
    targetAudience: "Logistics companies, freight forwarders, delivery vans & corporate car fleets",
    description:
      "Full turnkey vehicle tracking solution featuring rugged IP65 GPS telematics hardware, remote ignition cut-off relay, automated driver geo-fence alerts, and 12-month cloud server subscription.",
    validityDays: 30,
    defaultPaymentTerms: "50% advance on PO confirmation, 50% upon physical deployment & client portal signoff",
    standardDiscountPercent: 10,
    status: "Active",
    usageCount: 28,
    estimatedPerVehicleCost: 6500,
    recommendedFleetSize: "10 - 150 Vehicles",
    turnaroundTime: "2-3 Business Days",
    lastUpdated: "2026-09-15",
    includedPerks: [
      "iOS & Android Mobile App Access for Dispatchers",
      "Unlimited Web Portal Logins & Sub-Account RBAC",
      "Real-Time Speed & Geofence SMS/Push Notifications",
      "1-Year Direct Hardware Replacement Warranty",
      "Dedicated Technical Account Manager",
    ],
    items: [
      {
        id: "i-101",
        type: "hardware",
        name: "Teltonika FMB920 Fleet GPS Tracker (4G / 2G Fallback)",
        description: "High-gain internal GNSS/GSM antennas, internal backup battery, crash detection sensor, and BLE connectivity.",
        defaultUnitPrice: 3800,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-102",
        type: "accessory",
        name: "12V/24V 40A Heavy-Duty Automotive Engine Relay",
        description: "Remote anti-theft ignition kill-switch harness for emergency vehicle shutdown from mobile app or web portal.",
        defaultUnitPrice: 600,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-103",
        type: "installation",
        name: "Concealed Dashboard Wiring & Certified On-Site Technician Installation",
        description: "Tamper-resistant covert installation inside dashboard compartment with vehicle fuse box integration.",
        defaultUnitPrice: 900,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-104",
        type: "subscription",
        name: "Annual Upskill Cloud Platform License & 4G M2M SIM Connectivity",
        description: "12 months live tracking server telemetry, 10-second ping interval, 90-day trip playback history, and Robi/GP data renewal.",
        defaultUnitPrice: 1200,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-105",
        type: "accessory",
        name: "Driver SOS Panic Emergency Push Button",
        description: "Concealed push button near steering console that sends instant high-priority emergency alerts to dispatcher control center.",
        defaultUnitPrice: 500,
        defaultQuantityPerVehicle: 1,
        isOptional: true,
      },
    ],
    scopeOfWork: [
      {
        phase: "Phase 1",
        title: "Site Vehicle Audit & Depot Scheduling",
        deliverables: [
          "Physical inspection of vehicle battery health & alternator voltage.",
          "Coordination with client fleet manager for scheduled depot downtime.",
        ],
      },
      {
        phase: "Phase 2",
        title: "Covert Hardware Installation & Wiring",
        deliverables: [
          "Concealed placement of GPS unit under dashboard to prevent tampering.",
          "Wiring of ignition line, power harness, and relay immobilizer.",
        ],
      },
      {
        phase: "Phase 3",
        title: "Satellite Calibration & Software Provisioning",
        deliverables: [
          "Signal verification on Upskill CRM live telematics server.",
          "Platform user account setup, fleet grouping, and manager orientation training.",
        ],
      },
    ],
    termsAndConditions: [
      "Hardware warranty covers manufacturing defects for a period of 12 calendar months from installation date.",
      "SIM data bandwidth is strictly managed by Upskill CRM for M2M tracking data; voice and consumer services are disabled.",
      "Client is responsible for providing accessible vehicle parking with reasonable space for field technicians during installation.",
      "Proposals are valid for 30 calendar days from the date of issue. Prices quoted in BDT excluding VAT unless stated.",
    ],
  },
  {
    id: "tpl-prop-2",
    templateCode: "TPL-PROP-02",
    title: "Cold-Chain Pharma & Perishable Food Temperature Telematics",
    category: "Cold Chain",
    targetAudience: "Pharmaceutical distributors, cold storage reefer vans, dairy & meat logistics",
    description:
      "Automated temperature compliance & vehicle tracking package with wireless BLE thermal sensors, instant cold-chain breach alerts, and downloadable DGDA-compliant audit reports.",
    validityDays: 30,
    defaultPaymentTerms: "50% advance on PO confirmation, 50% upon calibration & sensor signoff",
    standardDiscountPercent: 8,
    status: "Active",
    usageCount: 16,
    estimatedPerVehicleCost: 11500,
    recommendedFleetSize: "5 - 60 Vehicles",
    turnaroundTime: "3-5 Business Days",
    lastUpdated: "2026-09-18",
    includedPerks: [
      "Automated SMS & WhatsApp Alerts on Temperature Excursions",
      "DGDA / WHO Good Distribution Practice (GDP) Compliance PDF Logs",
      "Wireless BLE Temperature Sensor Battery Life: 3+ Years",
      "2-Year Warranty on Master GPS & BLE Thermal Nodes",
      "Free Cloud Data Storage for 365 Days Historical Playback",
    ],
    items: [
      {
        id: "i-201",
        type: "hardware",
        name: "Teltonika FMB120 Advanced Telematics Hub (RS232/RS485/BLE)",
        description: "Industrial multi-interface tracker with high precision GPS receiver and Bluetooth 4.0 LE gateway.",
        defaultUnitPrice: 4800,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-202",
        type: "accessory",
        name: "EN12830 Certified Wireless BLE Temperature & Humidity Sensor",
        description: "Hermetically sealed IP67 wireless sensor puck (-40°C to +85°C) mounted inside refrigeration chamber.",
        defaultUnitPrice: 3200,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-203",
        type: "accessory",
        name: "Secondary Reefer Door Magnetic Open/Close Sensor",
        description: "Monitors cargo door openings in real-time to alert dispatchers of unauthorized temperature loss.",
        defaultUnitPrice: 1000,
        defaultQuantityPerVehicle: 1,
        isOptional: true,
      },
      {
        id: "i-204",
        type: "installation",
        name: "Reefer Box Sensor Calibration & Certified Sensor Testing",
        description: "Multi-point temperature cross-calibration, mounting inside cold cargo zone, and baseline heat test.",
        defaultUnitPrice: 1500,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-205",
        type: "subscription",
        name: "Cold-Chain Telematics Enterprise Cloud & Automated Compliance Tier",
        description: "Includes high-frequency 5-second thermal logging, temperature graph reports, and instant SMS alerts.",
        defaultUnitPrice: 1800,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
    ],
    scopeOfWork: [
      {
        phase: "Phase 1",
        title: "Cold Compartment Thermal Mapping & Sensor Placement",
        deliverables: [
          "Determine optimal sensor mounting coordinates away from direct evaporator airflow.",
          "Inspect insulated wiring passages to maintain airtight seal.",
        ],
      },
      {
        phase: "Phase 2",
        title: "BLE Node Pairing & Live Calibration",
        deliverables: [
          "Pair BLE temperature MAC addresses with master tracking unit.",
          "Run 2-hour benchmark temperature cycle matching calibrated master reference thermometer.",
        ],
      },
      {
        phase: "Phase 3",
        title: "Quality Audit Verification & Dispatch Alerts",
        deliverables: [
          "Configure upper/lower temperature excursion thresholds (e.g. 2°C to 8°C).",
          "Automate daily morning summary email to QA & Fleet Manager.",
        ],
      },
    ],
    termsAndConditions: [
      "Sensors carry calibration certificates valid for 12 months; re-calibration services available annually.",
      "Installation includes internal refrigeration box seal integrity guarantee.",
      "Customer must provide refrigeration units in running condition for benchmark verification.",
    ],
  },
  {
    id: "tpl-prop-3",
    templateCode: "TPL-PROP-03",
    title: "Heavy Haulage Fuel Level & Ultrasonic Anti-Theft Telematics Package",
    category: "Fuel Telematics",
    targetAudience: "Prime movers, dump trucks, excavators, ready-mix concrete fleets & generators",
    description:
      "High-precision fuel telematics featuring digital capacitive fuel probes, live fuel level reporting (99% accuracy), refueling receipts, anti-theft drain alarms, and mileage fuel efficiency analytics.",
    validityDays: 30,
    defaultPaymentTerms: "50% advance on PO confirmation, 50% upon fuel tank calibration & live signoff",
    standardDiscountPercent: 12,
    status: "Active",
    usageCount: 22,
    estimatedPerVehicleCost: 15500,
    recommendedFleetSize: "10 - 80 Vehicles",
    turnaroundTime: "3-4 Business Days",
    lastUpdated: "2026-09-20",
    includedPerks: [
      "99% Precision Capacitive Fuel Sensor with Real-Time Liter Readings",
      "Instant SMS Siren on Sudden Fuel Drop / Midnight Fuel Theft",
      "Fuel Consumption vs Mileage (Km/L) Anomaly Detection",
      "Refueling Station Audit & Purchase Slip Match Reports",
      "Free 2nd Sensor Recalibration within 60 Days",
    ],
    items: [
      {
        id: "i-301",
        type: "hardware",
        name: "Concox X3 Heavy Transport GPS Tracker (RS485 Dual Bus)",
        description: "Heavy-duty surge-protected GPS tracker supporting digital fuel sensors and rugged CAN bus.",
        defaultUnitPrice: 4500,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-302",
        type: "hardware",
        name: "High-Precision Capacitive Fuel Level Rod Sensor (700mm - 1000mm)",
        description: "Digital RS485 fuel sensor cut to vehicle tank depth with 1mm resolution, vibration & wave dampening.",
        defaultUnitPrice: 7000,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-303",
        type: "installation",
        name: "Fuel Tank Drilling, Flange Mounting & Multi-Step 20L Calibration",
        description: "Explosion-safe pneumatic drilling, metal gasket sealing, and precision 10-step full-to-empty liter table mapping.",
        defaultUnitPrice: 2500,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-304",
        type: "subscription",
        name: "Advanced Fuel & Mileage Telematics Cloud Subscription (Annual)",
        description: "Calculates fuel refill volume, drain theft volume, hourly generator consumption, and route-wise fuel loss.",
        defaultUnitPrice: 1500,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-305",
        type: "accessory",
        name: "Fuel Tank Cap Magnetic Anti-Tamper Sensor",
        description: "Sends instant trigger alert if fuel tank cap is opened outside authorized petrol pump geo-fence zones.",
        defaultUnitPrice: 1200,
        defaultQuantityPerVehicle: 1,
        isOptional: true,
      },
    ],
    scopeOfWork: [
      {
        phase: "Phase 1",
        title: "Tank Geometry Assessment & Sensor Cut-to-Fit",
        deliverables: [
          "Measure fuel tank height and calculate baffle baffle clearance.",
          "Trim capacitive aluminum tube and program internal calibration offsets.",
        ],
      },
      {
        phase: "Phase 2",
        title: "Tank Installation & Anti-Leak Gasket Sealing",
        deliverables: [
          "Drill top tank aperture with non-spark tooling and seal with fuel-resistant O-ring flange.",
          "Run heavy conduit cable along vehicle chassis away from exhaust pipe heat.",
        ],
      },
      {
        phase: "Phase 3",
        title: "Precision Calibration & Fuel Dip Table Configuration",
        deliverables: [
          "Perform 10-point volumetric calibration filling 20L increments to map non-linear tank contours.",
          "Upload calibration curve to Upskill CRM server and test instant siphon alert trigger.",
        ],
      },
    ],
    termsAndConditions: [
      "Client must provide a fuel tanker or fuel access to perform 10-point liter calibration during installation.",
      "Fuel probe includes 1-year replacement warranty against diesel degradation or electronics failure.",
      "Workmanship warranty guarantees zero fuel leakage around sensor flange for 2 years.",
    ],
  },
  {
    id: "tpl-prop-4",
    templateCode: "TPL-PROP-04",
    title: "Corporate Sedan OBD-II Plug & Play Zero-Wiring Tracking Fleet",
    category: "Plug & Play",
    targetAudience: "Executive carpools, luxury car rental agencies, bank lease vehicles & passenger cars",
    description:
      "Instant deployment vehicle tracking solution connecting directly into the vehicle's onboard OBD-II diagnostic port. Zero wire cutting guarantees original factory warranty preservation.",
    validityDays: 30,
    defaultPaymentTerms: "100% advance on device dispatch or Net 15 days for established corporate clients",
    standardDiscountPercent: 5,
    status: "Active",
    usageCount: 34,
    estimatedPerVehicleCost: 4600,
    recommendedFleetSize: "5 - 200 Cars",
    turnaroundTime: "Same Day / 24 Hours",
    lastUpdated: "2026-09-22",
    includedPerks: [
      "Zero Wire Splicing — Retains 100% Vehicle Manufacturer Warranty",
      "Instant 30-Second Plug & Play Setup by Driver or Staff",
      "Vehicle Battery Voltage & Basic DTC Engine Trouble Code Reporting",
      "Harsh Braking, Rapid Acceleration & Cornering Driving Scorecards",
      "Easily Portable Between Leased Vehicles",
    ],
    items: [
      {
        id: "i-401",
        type: "hardware",
        name: "Concox WeTrack2 / Jimi IoT 4G OBD-II GPS Tracker",
        description: "Compact plug-and-play telematics dongle with internal 4G LTE antenna, vibration alarm, and power-off alert.",
        defaultUnitPrice: 3200,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-402",
        type: "subscription",
        name: "Annual Upskill Cloud Software & M2M SIM Connectivity",
        description: "12-month cloud server access, trip logs, automated mileage calculations, and real-time live map.",
        defaultUnitPrice: 1200,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-403",
        type: "accessory",
        name: "OBD-II 16-Pin Flexible Concealed Extension Ribbon Cable",
        description: "Allows the dongle to be tucked deeply behind the dashboard panel so it remains hidden from passenger view.",
        defaultUnitPrice: 400,
        defaultQuantityPerVehicle: 1,
        isOptional: true,
      },
      {
        id: "i-404",
        type: "service",
        name: "Pre-Configured SIM Provisioning & Corporate Portal Setup",
        description: "Devices ship plug-and-play ready with SIM cards active, IMEI numbers tagged, and vehicle names loaded.",
        defaultUnitPrice: 200,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
    ],
    scopeOfWork: [
      {
        phase: "Phase 1",
        title: "Device Pre-Configuration & Account Setup",
        deliverables: [
          "Batch IMEI registration and M2M SIM ICCID linking on Upskill CRM telematics cloud.",
          "Apply corporate fleet labels, driver IDs, and default geofence parameters.",
        ],
      },
      {
        phase: "Phase 2",
        title: "Dispatch or Express On-Site Dropoff",
        deliverables: [
          "Courier delivery of sealed units or on-site handoff to administrative officer.",
          "Driver onboarding PDF manual and portal login credentials distribution.",
        ],
      },
    ],
    termsAndConditions: [
      "Compatible with all 1996+ OBD-II compliant passenger vehicles and light commercial vehicles.",
      "12-month manufacturer replacement warranty against electronic hardware fault.",
      "In the event of vehicle return/lease expiration, device can be transferred to new car without re-licensing charge.",
    ],
  },
  {
    id: "tpl-prop-5",
    templateCode: "TPL-PROP-05",
    title: "Heavy Equipment & Magnetic Waterproof Asset Security System",
    category: "Heavy Asset",
    targetAudience: "Construction sites, excavators, heavy machinery, diesel generators, sea shipping containers",
    description:
      "Battery-powered standalone GPS tracker with ultra-powerful neodymium industrial magnets, IP67 waterproof enclosure, and 10,000mAh rechargeable lithium battery yielding up to 3 years standby.",
    validityDays: 45,
    defaultPaymentTerms: "50% advance on PO confirmation, 50% upon delivery",
    standardDiscountPercent: 10,
    status: "Active",
    usageCount: 19,
    estimatedPerVehicleCost: 6800,
    recommendedFleetSize: "3 - 50 Assets",
    turnaroundTime: "1-2 Business Days",
    lastUpdated: "2026-09-12",
    includedPerks: [
      "10,000mAh Massive Rechargeable Li-Ion Battery (Up to 3 Years Standby)",
      "Drop-Sensor / Removal Tamper Alarm via Built-In Light Detector",
      "Industrial Neodymium Magnets for 50Kg Magnetic Pull Force",
      "IPX5 / IP67 Ruggedized Dust and Water Immersion Resistance",
      "Voice Monitor & Listening Microphone Capability",
    ],
    items: [
      {
        id: "i-501",
        type: "hardware",
        name: "Concox AT4 10,000mAh Industrial Magnetic Standby GPS Tracker",
        description: "Heavy-duty standalone asset tracker with dual GNSS positioning, vibration sensor, and light-sensitive tamper alert.",
        defaultUnitPrice: 5200,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-502",
        type: "subscription",
        name: "Annual Low-Power Asset Telematics Cloud License & SIM",
        description: "Optimized server schedule for periodic wake-up location pinging, deep sleep power management, and geofence boundary guard.",
        defaultUnitPrice: 1200,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-503",
        type: "accessory",
        name: "Heavy-Gauge Steel Welded Security Mounting Bracket",
        description: "Custom steel cage for bolt-on installation on construction machinery where magnetic mounting is inaccessible.",
        defaultUnitPrice: 600,
        defaultQuantityPerVehicle: 1,
        isOptional: true,
      },
      {
        id: "i-504",
        type: "service",
        name: "Asset Deployment & Magnetic Placement Consultation",
        description: "On-site equipment survey to install units in protected cavities that maintain satellite visibility while hidden from thieves.",
        defaultUnitPrice: 400,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
    ],
    scopeOfWork: [
      {
        phase: "Phase 1",
        title: "Asset Inspection & Power Profile Selection",
        deliverables: [
          "Select telemetry schedule: Real-time emergency recovery mode vs. 1-ping-per-day long standby mode.",
          "Identify unexposed structural steel surfaces on heavy machinery for magnetic attachment.",
        ],
      },
      {
        phase: "Phase 2",
        title: "Tamper Sensor Testing & Geofence Protection",
        deliverables: [
          "Test light sensor disassembly alert — triggers immediate SMS notification if unit is pried off metal base.",
          "Draw construction site geofence perimeter to alert on unauthorized machinery removal.",
        ],
      },
    ],
    termsAndConditions: [
      "Battery life depends on selected ping intervals (e.g. 1 location per day = 1000 days; continuous live tracking = 30 days).",
      "1-year comprehensive replacement warranty.",
      "Charger and 5V USB charging cable included with each device.",
    ],
  },
  {
    id: "tpl-prop-6",
    templateCode: "TPL-PROP-06",
    title: "AI Dual Dashcam DMS/ADAS Live Video Streaming Fleet Solution",
    category: "Video Telematics",
    targetAudience: "VIP transport, intercity bus fleets, cash-in-transit, hazardous fuel tankers & high-value cargo",
    description:
      "All-in-one 4G AI Dashcam system featuring simultaneous road-facing Full HD video recording, cabin-facing infrared AI driver monitoring (drowsiness, yawning, mobile phone distraction), and live remote video streaming.",
    validityDays: 30,
    defaultPaymentTerms: "50% advance on PO confirmation, 50% upon camera calibration signoff",
    standardDiscountPercent: 15,
    status: "Active",
    usageCount: 11,
    estimatedPerVehicleCost: 19500,
    recommendedFleetSize: "5 - 40 Vehicles",
    turnaroundTime: "4-6 Business Days",
    lastUpdated: "2026-09-25",
    includedPerks: [
      "1080P Full HD Front Road Camera + 720P Cabin Inward IR Night Vision Camera",
      "AI DMS: Driver Drowsiness, Yawning & Distraction Real-Time Audio Alarms",
      "Live Remote 4G Video Streaming & 2-Way Intercom via Dispatch Dashboard",
      "Automatic Cloud Event Video Upload on Harsh Braking, Crash, or Tampering",
      "128GB High-Endurance SanDisk Surveillance MicroSD Card Included",
    ],
    items: [
      {
        id: "i-601",
        type: "hardware",
        name: "Jimi IoT JC400 4G AI Dual Dashcam (DMS & ADAS Telematics Hub)",
        description: "Integrated dual camera with 4G LTE Wi-Fi hotspot, GPS tracking, 6-axis G-sensor, and tamper-proof SIM/SD cover lock.",
        defaultUnitPrice: 14500,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-602",
        type: "accessory",
        name: "128GB High-Endurance Class 10 Surveillance MicroSD Card",
        description: "Continuous loop recording rated for 20,000+ hours in extreme high vehicle dashboard temperatures.",
        defaultUnitPrice: 1200,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-603",
        type: "accessory",
        name: "External SOS Emergency Button & Remote Voice Siren",
        description: "Driver panic trigger and in-cabin voice siren alert when driver fatigue or lane departure is detected.",
        defaultUnitPrice: 800,
        defaultQuantityPerVehicle: 1,
        isOptional: true,
      },
      {
        id: "i-604",
        type: "installation",
        name: "Windshield Mounting, Concealed Pillar Wiring & DMS AI Angle Calibration",
        description: "Concealed A-pillar wiring, fuse box direct power tap, and driver eye-level AI facial calibration.",
        defaultUnitPrice: 1500,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
      {
        id: "i-605",
        type: "subscription",
        name: "Annual Video Telematics Enterprise Cloud & High-Bandwidth 4G SIM",
        description: "Includes live streaming server access, 10 hours monthly live video stream allowance, and 30-day cloud event storage.",
        defaultUnitPrice: 2500,
        defaultQuantityPerVehicle: 1,
        isOptional: false,
      },
    ],
    scopeOfWork: [
      {
        phase: "Phase 1",
        title: "Windshield Positioning & Wiring",
        deliverables: [
          "Affix industrial 3M VHB windshield mount behind rearview mirror to preserve driver sightlines.",
          "Conceal power cables through roof liner and A-pillar down to constant battery & ACC ignition fuse taps.",
        ],
      },
      {
        phase: "Phase 2",
        title: "AI Driver Monitor (DMS) Facial Calibration",
        deliverables: [
          "Calibrate infrared cabin camera angle to capture driver head tilt, eye closure, and facial position.",
          "Simulate eye closure test to confirm audio beep warning triggers within 2.0 seconds.",
        ],
      },
      {
        phase: "Phase 3",
        title: "Live Stream Verification & Cloud Evidence Lock",
        deliverables: [
          "Verify two-way audio communication and live 1080P stream on dispatcher control console.",
          "Instruct fleet supervisor on downloading crash-locked video clips for insurance and dispute evidence.",
        ],
      },
    ],
    termsAndConditions: [
      "Cameras feature 1-year direct replacement warranty; MicroSD cards carry 2-year manufacturer endurance warranty.",
      "Live streaming bandwidth is capped at 10 hours/month per vehicle; additional video data packages available upon request.",
      "Client is responsible for adhering to local transport audio/video recording disclosure laws.",
    ],
  },
];
