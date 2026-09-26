import { lazy } from "react";
import { Outlet } from "react-router-dom";
import {
  ChartPie,
  FileText,
  List,
  Package,
  Users,
  User,
  Network,
  Headphones,
} from "lucide-react";
import { IoSettingsOutline } from "react-icons/io5";

import Loadable from "@/utils/Loadable";
import { AdminSkeleton } from "@/common/Skeleton/Admin/AdminSkeleton";

const AdminDashboard = Loadable(
  lazy(() => import("@/pages/Admin/Dashboard/Overview/Overview")),
  AdminSkeleton
);
const Settings = Loadable(
  lazy(() => import("@/pages/Admin/Settings/Settings")),
  AdminSkeleton
);

const DummyPage = AdminDashboard;

export const adminRoutes = [
  {
    group: "Main Menu",
    items: [
      {
        icon: <ChartPie />,
        name: "Overview",
        path: "overview",
        element: <AdminDashboard />,
      },
      {
        icon: <FileText />,
        name: "Reports",
        path: "reports",
        element: <Outlet />,
        children: [
          { name: "All Reports", path: "all", element: <DummyPage /> }
        ],
      },
      {
        icon: <List />,
        name: "Items",
        path: "items",
        element: <Outlet />,
        children: [
          { name: "All Items", path: "all", element: <DummyPage /> }
        ],
      },
      {
        icon: <Package />,
        name: "Inventory",
        path: "inventory",
        element: <Outlet />,
        children: [
          { name: "Current Inventory", path: "current", element: <DummyPage /> }
        ],
      },
      {
        icon: <Users />,
        name: "Employees",
        path: "employees",
        element: <Outlet />,
        children: [
          { name: "All Employees", path: "all", element: <DummyPage /> }
        ],
      },
      {
        icon: <User />,
        name: "Customers",
        path: "customers",
        element: <DummyPage />,
      },
      {
        icon: <Network />,
        name: "Integrations",
        path: "integrations",
        element: <Outlet />,
        children: [
          { name: "Active Integrations", path: "active", element: <DummyPage /> }
        ],
      },
      {
        icon: <Headphones />,
        name: "Help",
        path: "help",
        element: <Outlet />,
        children: [
          { name: "Support Center", path: "support", element: <DummyPage /> }
        ],
      },
      {
        icon: <IoSettingsOutline className="size-6" />,
        name: "settings",
        path: "settings",
        element: <Settings />,
      },
    ],
  },
];
