import React from "react";
import { StatsCard } from "@/common/StatsCard";

export function DashboardStats() {
  const stats = [
    {
      title: "Gross sales",
      value: "$ 33,180.00",
      trendText: "+Tk3,3180.00 (+100%)",
      trendType: "positive" as const,
    },
    {
      title: "Refunds",
      value: "$ 800.00",
      trendText: "+$ 800.00 (+100%)",
      trendType: "negative" as const,
    },
    {
      title: "Discounts",
      value: "$ 1.40",
      trendText: "+$ 1.40 (+100%)",
      trendType: "negative" as const,
    },
    {
      title: "Net sales",
      value: "$ 18,221",
      trendText: "+$ 37378_60 (+100%)",
      trendType: "positive" as const,
    },
    {
      title: "Gross profit",
      value: "$ 914.40",
      trendText: "+$ 914.40 (+100%)",
      trendType: "positive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => (
        <StatsCard
          key={idx}
          title={stat.title}
          value={stat.value}
          trendText={stat.trendText}
          trendType={stat.trendType}
        />
      ))}
    </div>
  );
}
