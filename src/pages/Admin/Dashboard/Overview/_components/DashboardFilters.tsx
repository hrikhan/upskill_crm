
import React, { useState } from "react";
import { Clock, Store, Users } from "lucide-react";
import { CommonFilterComponent, FilterSelectConfig } from "@/common/CommonFilterComponent";

export interface DashboardFiltersProps {
  startDate?: Date;
  endDate?: Date;
  onDateChange?: (range: { from: Date; to?: Date } | undefined) => void;
  onPrevDate?: () => void;
  onNextDate?: () => void;
  days?: string;
  onDaysChange?: (value: string) => void;
  store?: string;
  onStoreChange?: (value: string) => void;
  employees?: string;
  onEmployeesChange?: (value: string) => void;
}

export function DashboardFilters({
  startDate: propStartDate,
  endDate: propEndDate,
  onDateChange: propOnDateChange,
  onPrevDate: propOnPrevDate,
  onNextDate: propOnNextDate,
  days: propDays,
  onDaysChange: propOnDaysChange,
  store: propStore,
  onStoreChange: propOnStoreChange,
  employees: propEmployees,
  onEmployeesChange: propOnEmployeesChange,
}: DashboardFiltersProps) {
  // Local state fallbacks (uncontrolled mode)
  const [localStartDate, setLocalStartDate] = useState(new Date("2026-06-03"));
  const [localEndDate, setLocalEndDate] = useState(new Date("2026-07-02"));
  const [localDays, setLocalDays] = useState("All days");
  const [localStore, setLocalStore] = useState("Softvence");
  const [localEmployees, setLocalEmployees] = useState("All employees");

  // Controlled vs Uncontrolled state resolution
  const startDate = propStartDate !== undefined ? propStartDate : localStartDate;
  const endDate = propEndDate !== undefined ? propEndDate : localEndDate;
  const days = propDays !== undefined ? propDays : localDays;
  const store = propStore !== undefined ? propStore : localStore;
  const employees = propEmployees !== undefined ? propEmployees : localEmployees;

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

  const handleDaysChange = (val: string) => {
    if (propOnDaysChange) propOnDaysChange(val);
    else setLocalDays(val);
  };

  const handleStoreChange = (val: string) => {
    if (propOnStoreChange) propOnStoreChange(val);
    else setLocalStore(val);
  };

  const handleEmployeesChange = (val: string) => {
    if (propOnEmployeesChange) propOnEmployeesChange(val);
    else setLocalEmployees(val);
  };

  // Configuration for dropdown selectors
  const selectsConfig: FilterSelectConfig[] = [
    {
      key: "days",
      icon: Clock,
      title: "All days",
      options: ["All days", "Weekdays", "Weekends"],
      value: days,
      onChange: handleDaysChange,
    },
    {
      key: "store",
      icon: Store,
      title: "Softvence",
      options: ["Softvence", "Store 2", "Store 3"],
      value: store,
      onChange: handleStoreChange,
    },
    {
      key: "employees",
      icon: Users,
      title: "All employees",
      options: ["All employees", "Managers", "Cashiers"],
      value: employees,
      onChange: handleEmployeesChange,
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
