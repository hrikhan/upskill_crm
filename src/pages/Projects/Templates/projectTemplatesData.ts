export interface TemplateTask {
  id: string;
  title: string;
  roleRequired: "Lead Engineer" | "Field Wiring Tech" | "Calibration Specialist" | "QA Tech" | "Operations";
  mandatory: boolean;
  estimatedHours: number;
}

export interface TemplatePhase {
  id: string;
  phaseNumber: number;
  name: string;
  estimatedDays: number;
  tasks: TemplateTask[];
}

export interface TemplateHardwareItem {
  itemName: string;
  quantityPerVehicle: number;
  isMandatory: boolean;
}

export interface ProjectTemplate {
  id: string;
  templateCode: string;
  name: string;
  category: "Commercial Haulers" | "Motorbike Delivery" | "Fuel & Telematics" | "Cold Chain & Temperature" | "Personal & Executive";
  description: string;
  targetVehiclesRange: string;
  defaultTrackerModel: string;
  estimatedDaysPerVehicle: number;
  estimatedTotalDays: number;
  estimatedBudgetPerVehicle: number;
  status: "Active" | "Draft";
  phases: TemplatePhase[];
  requiredHardware: TemplateHardwareItem[];
  usageCount: number;
  createdAt: string;
}

export const initialProjectTemplates: ProjectTemplate[] = [
  {
    id: "tpl-1",
    templateCode: "TPL-FLT-01",
    name: "Commercial Covered Vans Telematics & Remote Engine Cutoff",
    category: "Commercial Haulers",
    description: "Standardized multi-vehicle rollout for distribution fleets, featuring 12V/24V concealed wiring, anti-tamper ignition detection, and remote immobilizer relay.",
    targetVehiclesRange: "10 - 50 Covered Vans",
    defaultTrackerModel: "Concox GT06N Pro",
    estimatedDaysPerVehicle: 1.2,
    estimatedTotalDays: 14,
    estimatedBudgetPerVehicle: 5200,
    status: "Active",
    usageCount: 8,
    createdAt: "2026-08-01",
    requiredHardware: [
      { itemName: "Concox GT06N Pro Tracker Unit", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "12V 40A Engine Immobilizer Relay Harness", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "SOS Panic Emergency Button", quantityPerVehicle: 1, isMandatory: false },
      { itemName: "4G M2M Data SIM (Grameenphone/Robi)", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "Flame-Retardant Heat Shrink Tube & Fuse Kit", quantityPerVehicle: 1, isMandatory: true },
    ],
    phases: [
      {
        id: "p1-1",
        phaseNumber: 1,
        name: "Phase 1: Fleet Scheduling & Electrical Audit",
        estimatedDays: 2,
        tasks: [
          { id: "t1-1", title: "Site survey and vehicle availability roster with client dispatch", roleRequired: "Lead Engineer", mandatory: true, estimatedHours: 4 },
          { id: "t1-2", title: "Battery health and 12V/24V alternator baseline check", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 6 },
        ],
      },
      {
        id: "p1-2",
        phaseNumber: 2,
        name: "Phase 2: Hardware Staging & IMEI Provisioning",
        estimatedDays: 2,
        tasks: [
          { id: "t1-3", title: "IMEI barcode scanning & SIM APN profile configuration", roleRequired: "QA Tech", mandatory: true, estimatedHours: 8 },
          { id: "t1-4", title: "Firmware flashing to enterprise telematics server endpoint", roleRequired: "Lead Engineer", mandatory: true, estimatedHours: 4 },
        ],
      },
      {
        id: "p1-3",
        phaseNumber: 3,
        name: "Phase 3: Concealed Installation & Relay Wiring",
        estimatedDays: 7,
        tasks: [
          { id: "t1-5", title: "Concealed dashboard bracket mounting behind instrument cluster", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 16 },
          { id: "t1-6", title: "Fuel pump / Starter relay series cut with ignition sense wire", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 20 },
          { id: "t1-7", title: "SOS panic button routing to hidden driver compartment", roleRequired: "Field Wiring Tech", mandatory: false, estimatedHours: 8 },
        ],
      },
      {
        id: "p1-4",
        phaseNumber: 4,
        name: "Phase 4: Live Calibration, Portal Activation & Handover",
        estimatedDays: 3,
        tasks: [
          { id: "t1-8", title: "Live GPS test drive: ignition on/off, geofence trigger & remote engine kill", roleRequired: "QA Tech", mandatory: true, estimatedHours: 8 },
          { id: "t1-9", title: "Client dispatch manager portal orientation & user credentials setup", roleRequired: "Operations", mandatory: true, estimatedHours: 4 },
        ],
      },
    ],
  },
  {
    id: "tpl-2",
    templateCode: "TPL-BIKE-02",
    name: "E-Commerce Last-Mile Bike Fleet Fast Deployment",
    category: "Motorbike Delivery",
    description: "Rapid deployment procedure for courier motorbikes and parcel delivery fleets. Emphasizes IP65 waterproof housing, low parasitic battery drain, and real-time tracking.",
    targetVehiclesRange: "50 - 200 Motorbikes",
    defaultTrackerModel: "SinoTrack ST-901 Mini",
    estimatedDaysPerVehicle: 0.5,
    estimatedTotalDays: 10,
    estimatedBudgetPerVehicle: 3200,
    status: "Active",
    usageCount: 5,
    createdAt: "2026-08-15",
    requiredHardware: [
      { itemName: "SinoTrack ST-901 Mini Waterproof GPS", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "Micro 12V Solid-State Cutoff Relay", quantityPerVehicle: 1, isMandatory: false },
      { itemName: "Waterproof Inline Fuse Holder (3A)", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "Low-Power 4G Micro IoT SIM", quantityPerVehicle: 1, isMandatory: true },
    ],
    phases: [
      {
        id: "p2-1",
        phaseNumber: 1,
        name: "Phase 1: Hub Staging & Batch Provisioning",
        estimatedDays: 2,
        tasks: [
          { id: "t2-1", title: "Batch IMEI provisioning and sleep-mode power configuration", roleRequired: "Lead Engineer", mandatory: true, estimatedHours: 8 },
          { id: "t2-2", title: "Delivery hub shift coordination (installations during shift handovers)", roleRequired: "Operations", mandatory: true, estimatedHours: 4 },
        ],
      },
      {
        id: "p2-2",
        phaseNumber: 2,
        name: "Phase 2: High-Velocity Under-Seat Wiring",
        estimatedDays: 6,
        tasks: [
          { id: "t2-3", title: "Battery terminal hookup and waterproof harness concealment", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 24 },
          { id: "t2-4", title: "Vibration / Tow-away alert calibration", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 12 },
        ],
      },
      {
        id: "p2-3",
        phaseNumber: 3,
        name: "Phase 3: Webhook API Integration & Fleet Verification",
        estimatedDays: 2,
        tasks: [
          { id: "t2-5", title: "Connect fleet GPS stream to client courier dispatch platform", roleRequired: "Lead Engineer", mandatory: true, estimatedHours: 6 },
          { id: "t2-6", title: "Sign-off sheet verification with fleet hub supervisor", roleRequired: "Operations", mandatory: true, estimatedHours: 4 },
        ],
      },
    ],
  },
  {
    id: "tpl-3",
    templateCode: "TPL-FUEL-03",
    name: "Bulk Oil Haulers & Tankers Ultrasonic Fuel Telematics",
    category: "Fuel & Telematics",
    description: "Specialized precision installation for petroleum tankers and highway heavy haulers. Includes ultrasonic/capacitive fuel level probe, anti-siphoning alerts, and liter calibration.",
    targetVehiclesRange: "10 - 30 Tankers / Trucks",
    defaultTrackerModel: "Capacitive Fuel Sensor + Teltonika FMB125",
    estimatedDaysPerVehicle: 2.5,
    estimatedTotalDays: 21,
    estimatedBudgetPerVehicle: 14500,
    status: "Active",
    usageCount: 3,
    createdAt: "2026-08-20",
    requiredHardware: [
      { itemName: "Teltonika FMB125 Advanced Fleet Telematics", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "1000mm Capacitive / Ultrasonic Fuel Level Rod", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "RS232-to-RS485 Telematics Interface Cable", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "Explosion-Proof Conduit Piping & Safety Flange", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "High-Gain External GPS/GLONASS Antenna", quantityPerVehicle: 1, isMandatory: true },
    ],
    phases: [
      {
        id: "p3-1",
        phaseNumber: 1,
        name: "Phase 1: Tank Dimensioning & Mechanical Prep",
        estimatedDays: 3,
        tasks: [
          { id: "t3-1", title: "Physical fuel tank depth, volume, and baffle plate structural inspection", roleRequired: "Lead Engineer", mandatory: true, estimatedHours: 8 },
          { id: "t3-2", title: "Drilling sensor hole with safety cold-cutting tool & flange mounting", roleRequired: "Calibration Specialist", mandatory: true, estimatedHours: 12 },
        ],
      },
      {
        id: "p3-2",
        phaseNumber: 2,
        name: "Phase 2: Heavy-Duty Wiring & Flame-Proof Conduits",
        estimatedDays: 6,
        tasks: [
          { id: "t3-3", title: "Route sensor RS232 cable inside chassis conduit to cabin", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 16 },
          { id: "t3-4", title: "Teltonika FMB125 power harness connection to master battery switch", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 10 },
        ],
      },
      {
        id: "p3-3",
        phaseNumber: 3,
        name: "Phase 3: 10-Step Liter-by-Liter Fuel Calibration",
        estimatedDays: 8,
        tasks: [
          { id: "t3-5", title: "Stepwise fuel pumping (50L increments) with digital liter calibration table", roleRequired: "Calibration Specialist", mandatory: true, estimatedHours: 24 },
          { id: "t3-6", title: "Generate calibration curve chart (Voltage vs Liters) and flash to tracker", roleRequired: "Calibration Specialist", mandatory: true, estimatedHours: 12 },
        ],
      },
      {
        id: "p3-4",
        phaseNumber: 4,
        name: "Phase 4: Anti-Theft Threshold Tuning & Handover",
        estimatedDays: 4,
        tasks: [
          { id: "t3-7", title: "Configure rapid-drop alert triggers (SMS & email on >10L sudden loss)", roleRequired: "Lead Engineer", mandatory: true, estimatedHours: 8 },
          { id: "t3-8", title: "Executive fuel analytics dashboard training for transport manager", roleRequired: "Operations", mandatory: true, estimatedHours: 6 },
        ],
      },
    ],
  },
  {
    id: "tpl-4",
    templateCode: "TPL-COLD-04",
    name: "Cold Chain Reefer Van Dual Temperature & Door Sensor Rollout",
    category: "Cold Chain & Temperature",
    description: "Designed for pharmaceutical, ice-cream, and frozen dairy logistics. Features BLE wireless temperature probes, reefer compressor power sense, and door breach detection.",
    targetVehiclesRange: "5 - 25 Reefer Vans",
    defaultTrackerModel: "Teltonika FMB920 + BLE Sensors",
    estimatedDaysPerVehicle: 1.5,
    estimatedTotalDays: 12,
    estimatedBudgetPerVehicle: 8800,
    status: "Active",
    usageCount: 2,
    createdAt: "2026-09-01",
    requiredHardware: [
      { itemName: "Teltonika FMB920 Bluetooth Fleet Tracker", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "2x Wireless BLE Temperature & Humidity Sensors", quantityPerVehicle: 2, isMandatory: true },
      { itemName: "Magnetic Reefer Door Open/Close Switch", quantityPerVehicle: 1, isMandatory: true },
      { itemName: "Backup 800mAh Internal Li-ion Battery", quantityPerVehicle: 1, isMandatory: true },
    ],
    phases: [
      {
        id: "p4-1",
        phaseNumber: 1,
        name: "Phase 1: Reefer Thermal Profiling & Sensor Placement",
        estimatedDays: 2,
        tasks: [
          { id: "t4-1", title: "Compartment temperature map (front cooling zone vs rear door zone)", roleRequired: "Lead Engineer", mandatory: true, estimatedHours: 6 },
          { id: "t4-2", title: "Mount BLE sensor nodes with thermal isolation brackets", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 8 },
        ],
      },
      {
        id: "p4-2",
        phaseNumber: 2,
        name: "Phase 2: Cabin Telematics & Door Breach Wiring",
        estimatedDays: 5,
        tasks: [
          { id: "t4-3", title: "Install FMB920 GPS unit and bind Bluetooth BLE sensors", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 12 },
          { id: "t4-4", title: "Wire magnetic reed switch to digital input for door open detection", roleRequired: "Field Wiring Tech", mandatory: true, estimatedHours: 8 },
        ],
      },
      {
        id: "p4-3",
        phaseNumber: 3,
        name: "Phase 3: Excursion Alarm Rule Setup & Validation",
        estimatedDays: 3,
        tasks: [
          { id: "t4-4", title: "Set temperature boundaries (-20°C to -15°C for frozen; +2°C to +8°C for pharma)", roleRequired: "QA Tech", mandatory: true, estimatedHours: 6 },
          { id: "t4-5", title: "Simulated door breach test and SMS escalation rule verification", roleRequired: "QA Tech", mandatory: true, estimatedHours: 6 },
        ],
      },
      {
        id: "p4-4",
        phaseNumber: 4,
        name: "Phase 4: Compliance Certification & Training",
        estimatedDays: 2,
        tasks: [
          { id: "t4-6", title: "Generate initial 48-hour continuous temperature logging audit report", roleRequired: "Operations", mandatory: true, estimatedHours: 6 },
          { id: "t4-7", title: "Client quality assurance team briefing & calibration certificate issue", roleRequired: "Lead Engineer", mandatory: true, estimatedHours: 4 },
        ],
      },
    ],
  },
];
