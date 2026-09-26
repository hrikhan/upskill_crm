
import AnimatedContainer from "@/common/AnimatedContainer";
import { DashboardFilters } from "./_components/DashboardFilters";
import { DashboardStats } from "./_components/DashboardStats";
import { DashboardChart } from "./_components/DashboardChart";
import { TopSellingSection } from "./_components/TopSellingSection";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <AnimatedContainer delay={0.1}>
        <div
          className="flex flex-col gap-6 p-8 rounded-2xl w-full bg-card surface shadow-all"
        >
          <DashboardFilters />
          <DashboardStats />

          <div
            className="mt-2 p-6 border rounded-xl border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-white to-[#EAF1FF] dark:from-[#0f172a] dark:to-[#020617]"
          >
            <DashboardChart />
          </div>
          <TopSellingSection />
        </div>
      </AnimatedContainer>
    </div>
  );
}
