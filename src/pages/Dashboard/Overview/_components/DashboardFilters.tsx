import React, { useState } from "react";
import { Filter, UserCheck, Layers } from "lucide-react";
import { CommonFilterComponent, FilterSelectConfig } from "@/common/CommonFilterComponent";

export interface DashboardFiltersProps {
  startDate?: Date;
  endDate?: Date;
  onDateChange?: (range: { from: Date; to?: Date } | undefined) => void;
  onPrevDate?: () => void;
  onNextDate?: () => void;
  stage?: string;
  onStageChange?: (value: string) => void;
  agent?: string;
  onAgentChange?: (value: string) => void;
  source?: string;
  onSourceChange?: (value: string) => void;
  showStage?: boolean;
  staffScope?: { isStaff: boolean; staffName?: string };
}

export function DashboardFilters({
  startDate: propStartDate,
  endDate: propEndDate,
  onDateChange: propOnDateChange,
  onPrevDate: propOnPrevDate,
  onNextDate: propOnNextDate,
  stage: propStage,
  onStageChange: propOnStageChange,
  agent: propAgent,
  onAgentChange: propOnAgentChange,
  source: propSource,
  onSourceChange: propOnSourceChange,
  showStage = true,
  staffScope,
}: DashboardFiltersProps) {
  // Local state fallbacks (uncontrolled mode)
  const [localStartDate, setLocalStartDate] = useState(new Date("2026-06-01"));
  const [localEndDate, setLocalEndDate] = useState(new Date("2026-07-01"));
  const [localStage, setLocalStage] = useState("All Stages");
  const [localAgent, setLocalAgent] = useState("All Sales Reps");
  const [localSource, setLocalSource] = useState("All Sources");

  // Controlled vs Uncontrolled state resolution
  const startDate = propStartDate !== undefined ? propStartDate : localStartDate;
  const endDate = propEndDate !== undefined ? propEndDate : localEndDate;
  const stage = propStage !== undefined ? propStage : localStage;
  const agent = propAgent !== undefined ? propAgent : localAgent;
  const source = propSource !== undefined ? propSource : localSource;

  const handlePrevMonth = () => {
    if (propOnPrevDate) {
      propOnPrevDate();
    } else {
      const newStart = new Date(startDate);
      newStart.setMonth(newStart.getMonth() - 1);
      const newEnd = new Date(endDate);
      newEnd.setMonth(newEnd.getMonth() - 1);
      setLocalStartDate(newStart);
      setLocalEndDate(newEnd);
    }
  };

  const handleNextMonth = () => {
    if (propOnNextDate) {
      propOnNextDate();
    } else {
      const newStart = new Date(startDate);
      newStart.setMonth(newStart.getMonth() + 1);
      const newEnd = new Date(endDate);
      newEnd.setMonth(newEnd.getMonth() + 1);
      setLocalStartDate(newStart);
      setLocalEndDate(newEnd);
    }
  };

  const handleDateChange = (range: { from: Date; to?: Date } | undefined) => {
    if (propOnDateChange) {
      propOnDateChange(range);
    } else {
      if (range?.from) setLocalStartDate(range.from);
      if (range?.to) setLocalEndDate(range.to);
    }
  };

  const handleStageChange = (val: string) => {
    if (propOnStageChange) propOnStageChange(val);
    else setLocalStage(val);
  };

  const handleAgentChange = (val: string) => {
    if (propOnAgentChange) propOnAgentChange(val);
    else setLocalAgent(val);
  };

  const handleSourceChange = (val: string) => {
    if (propOnSourceChange) propOnSourceChange(val);
    else setLocalSource(val);
  };

  // CRM Dropdown Selects configuration
  const selectsConfig: FilterSelectConfig[] = [
    ...(showStage
      ? [
          {
            key: "stage",
            icon: Filter,
            title: "All Stages",
            options: [
              "All Stages",
              "New Leads",
              "Appointment Collected",
              "Demonstrations Done",
              "Proposal Sent",
              "Closed Won",
            ],
            value: stage,
            onChange: handleStageChange,
          },
        ]
      : []),
    {
      key: "agent",
      icon: UserCheck,
      title: staffScope?.isStaff
        ? `${staffScope.staffName || "Your Account"} (Personal View)`
        : "All Sales Reps",
      options: staffScope?.isStaff
        ? [`${staffScope.staffName || "Your Account"} (Personal View)`]
        : [
            "All Sales Reps",
            "Hridoy (Admin)",
            "Sarah Jenkins",
            "Michael Chang",
            "David Miller",
          ],
      value: staffScope?.isStaff
        ? `${staffScope.staffName || "Your Account"} (Personal View)`
        : agent,
      onChange: staffScope?.isStaff ? () => {} : handleAgentChange,
    },
    {
      key: "source",
      icon: Layers,
      title: "All Sources",
      options: [
        "All Sources",
        "Website Inbound",
        "Direct Referral",
        "LinkedIn Campaign",
        "Cold Outreach",
      ],
      value: source,
      onChange: handleSourceChange,
    },
  ];

  return (
    <CommonFilterComponent
      startDate={startDate}
      endDate={endDate}
      onPrevDate={handlePrevMonth}
      onNextDate={handleNextMonth}
      onDateChange={handleDateChange}
      selects={selectsConfig}
    />
  );
}
