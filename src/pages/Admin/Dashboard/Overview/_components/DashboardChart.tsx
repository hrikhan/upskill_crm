
import React, { useState } from "react";
import { FilterSelect } from "@/common/FilterSelect";
import ReusableChart, { ChartType } from "@/common/ReusableChart";

export function DashboardChart() {
  const [chartType, setChartType] = useState<ChartType>("Area");

  // Data from Jun 03 to Jun 24 (stacked segment values matching design screenshot)
  const data = [
    { label: "Jun 03", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 04", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 05", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 06", value: 4100, grey: 0, green: 2500, blue: 1600, red: 0 },
    { label: "Jun 07", value: 1500, grey: 0, green: 0, blue: 1500, red: 0 },
    { label: "Jun 08", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 09", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 10", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 11", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 12", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 13", value: 3900, grey: 0, green: 3000, blue: 900, red: 0 },
    { label: "Jun 14", value: 6100, grey: 3500, green: 1500, blue: 700, red: 400 },
    { label: "Jun 15", value: 15700, grey: 9500, green: 5000, blue: 700, red: 500 },
    { label: "Jun 16", value: 700, grey: 0, green: 700, blue: 0, red: 0 },
    { label: "Jun 17", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 18", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 19", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 20", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 21", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 22", value: 20000, grey: 10000, green: 6000, blue: 3000, red: 1000 },
    { label: "Jun 23", value: 0, grey: 0, green: 0, blue: 0, red: 0 },
    { label: "Jun 24", value: 2500, grey: 2500, green: 0, blue: 0, red: 0 },
  ];

  // Bar configurations for stacked bar mode
  const bars = [
    { dataKey: "grey", name: "Cost of Goods", color: "#8188A2", opacity: 0.65 },
    { dataKey: "green", name: "Gross Profit", color: "#169E7B" },
    { dataKey: "blue", name: "Net Sales", color: "#3b82f6" },
    { dataKey: "red", name: "Refunds", color: "#DA4352" },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Filter Row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <FilterSelect
          title="Gross sales"
          options={["Gross sales", "Net sales", "Refunds"]}
          variant="outline"
          className="w-44"
        />
        <div className="flex items-center gap-3">
          <FilterSelect
            title={chartType}
            options={["Area", "Line", "Bar"]}
            variant="outline"
            className="w-32"
            value={chartType}
            onChange={(v) => setChartType(v as ChartType)}
          />
          <FilterSelect
            title="Days"
            options={["Days", "Weeks", "Months"]}
            variant="outline"
            className="w-32"
          />
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[460px] select-none min-w-0">
        <ReusableChart chartType={chartType} data={data} bars={bars} />
      </div>
    </div>
  );
}
