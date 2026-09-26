import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";
import { adminRoutes } from "@/routes/AdminRoutes";
import { menuGenerator } from "@/utils/Generator/MenuGenerator";

const routeDescriptions: Record<string, string> = {
  "Overview": "Welcome back to your reseller dashboard.",
  "Dynamic Table": "Manage database records using a powerful dynamic table.",
  "Dynamic Form": "Build and submit validation-ready dynamic forms.",
  "Employees": "Manage staff records, roles, and profiles.",
  "Marketing": "Monitor campaigns, traffic growth, and outreach stats.",
  "System Settings": "Configure system settings, integrations, and preferences.",
  "Help & Support": "Access documentation and raise customer support tickets.",
};

interface DashboardLayoutProps {
  config?: any[];
  basePath?: string;
}

const DashboardLayout = ({
  config = adminRoutes,
  basePath = "/admin",
}: DashboardLayoutProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Dynamically resolve active route name
  const menu = menuGenerator(config, basePath);

  const findActiveItem = (items: any[]): any => {
    for (const item of items) {
      if (item.path === location.pathname) return item;
      if (item.children) {
        const found = findActiveItem(item.children);
        if (found) return found;
      }
    }
    // Fallback: match prefix if not exact match (excluding base paths)
    for (const item of items) {
      if (item.path && item.path !== basePath && location.pathname.startsWith(item.path)) {
        return item;
      }
    }
    return null;
  };

  const activeItem = findActiveItem(menu);
  const title = activeItem ? activeItem.label : "Overview";
  const description = activeItem && routeDescriptions[activeItem.label]
    ? routeDescriptions[activeItem.label]
    : "Welcome back to your reseller dashboard.";

  return (
    <div className="flex h-screen overflow-hidden bg-layout-bg">
      {/* 1. Fixed Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        config={config}
        basePath={basePath}
      />

      {/* Backdrop overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 sm:hidden transition-opacity duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header 
          title={title} 
          description={description} 
          onMenuClick={() => setIsMobileOpen(true)}
          breadcrumbs={<Breadcrumbs config={config} basePath={basePath} className="mb-0 px-0" />}
        />

        <main className="flex-1 px-6 py-6 bg-layout-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
