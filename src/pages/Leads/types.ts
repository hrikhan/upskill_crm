export type LeadStage =
  | "New"
  | "Appointment collected"
  | "Demonstrations Done"
  | "Need Followup"
  | "Proposal Sent"
  | "Implemented";

export interface Lead {
  id: string;
  name: string;
  subtitle?: string;
  company?: string;
  value: number; // e.g. 4500
  telephone: string;
  email: string;
  createdDate: string;
  contactedStatus: string;
  category: string; // e.g. "website", "social", "referral"
  stage: LeadStage;
  assignedTo?: string;
  notes?: string;
}

export interface StageConfig {
  id: LeadStage;
  title: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
}

export const STAGE_CONFIGS: StageConfig[] = [
  {
    id: "New",
    title: "New",
    borderColor: "#f43f5e", // Rose
    badgeBg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    textColor: "text-rose-500",
  },
  {
    id: "Appointment collected",
    title: "Appointment collected",
    borderColor: "#f97316", // Orange
    badgeBg: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    textColor: "text-orange-500",
  },
  {
    id: "Demonstrations Done",
    title: "Demonstrations Done",
    borderColor: "#0ea5e9", // Sky Blue
    badgeBg: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
    textColor: "text-sky-500",
  },
  {
    id: "Need Followup",
    title: "Need Followup",
    borderColor: "#8b5cf6", // Purple/Indigo
    badgeBg: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
    textColor: "text-purple-500",
  },
  {
    id: "Proposal Sent",
    title: "Proposal Sent",
    borderColor: "#84cc16", // Lime
    badgeBg: "bg-lime-50 text-lime-700 dark:bg-lime-950/40 dark:text-lime-400",
    textColor: "text-lime-500",
  },
  {
    id: "Implemented",
    title: "Implemented",
    borderColor: "#14b8a6", // Teal
    badgeBg: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    textColor: "text-teal-500",
  },
];
