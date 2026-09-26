import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  Home,
  Users2,
  Folder,
  ListTodo,
  PhoneCall,
  Wallet,
  Bookmark,
  FileEdit,
  MessageSquare,
  Users,
  BarChart3,
} from "lucide-react";

import Loadable from "@/utils/Loadable";
import { AdminSkeleton } from "@/common/Skeleton/Admin/AdminSkeleton";
import DashboardLayout from "@/Layout/DashboardLayout/DashboardLayout";

// Overview Dashboard
const AdminDashboard = Loadable(
  lazy(() => import("@/pages/Admin/Dashboard/Overview/Overview")),
  AdminSkeleton
);

// Customers
const Clients = Loadable(
  lazy(() => import("@/pages/Admin/Customers/Clients/Clients")),
  AdminSkeleton
);
const ClientUsers = Loadable(
  lazy(() => import("@/pages/Admin/Customers/ClientUsers/ClientUsers")),
  AdminSkeleton
);

// Projects
const Projects = Loadable(
  lazy(() => import("@/pages/Admin/Projects/Projects/Projects")),
  AdminSkeleton
);
const ProjectTemplates = Loadable(
  lazy(() => import("@/pages/Admin/Projects/Templates/Templates")),
  AdminSkeleton
);

// Sales
const Invoices = Loadable(
  lazy(() => import("@/pages/Admin/Sales/Invoices/Invoices")),
  AdminSkeleton
);
const Payments = Loadable(
  lazy(() => import("@/pages/Admin/Sales/Payments/Payments")),
  AdminSkeleton
);
const Estimates = Loadable(
  lazy(() => import("@/pages/Admin/Sales/Estimates/Estimates")),
  AdminSkeleton
);
const Subscriptions = Loadable(
  lazy(() => import("@/pages/Admin/Sales/Subscriptions/Subscriptions")),
  AdminSkeleton
);
const Products = Loadable(
  lazy(() => import("@/pages/Admin/Sales/Products/Products")),
  AdminSkeleton
);
const Expenses = Loadable(
  lazy(() => import("@/pages/Admin/Sales/Expenses/Expenses")),
  AdminSkeleton
);

// Proposals
const Proposals = Loadable(
  lazy(() => import("@/pages/Admin/Proposals/Proposals/Proposals")),
  AdminSkeleton
);
const ProposalTemplates = Loadable(
  lazy(() => import("@/pages/Admin/Proposals/Templates/Templates")),
  AdminSkeleton
);

// Contracts
const Contracts = Loadable(
  lazy(() => import("@/pages/Admin/Contracts/Contracts/Contracts")),
  AdminSkeleton
);
const ContractTemplates = Loadable(
  lazy(() => import("@/pages/Admin/Contracts/Templates/Templates")),
  AdminSkeleton
);

// Support
const Tickets = Loadable(
  lazy(() => import("@/pages/Admin/Support/Tickets/Tickets")),
  AdminSkeleton
);
const Canned = Loadable(
  lazy(() => import("@/pages/Admin/Support/Canned/Canned")),
  AdminSkeleton
);
const Knowledgebase = Loadable(
  lazy(() => import("@/pages/Admin/Support/Knowledgebase/Knowledgebase")),
  AdminSkeleton
);
const Messages = Loadable(
  lazy(() => import("@/pages/Admin/Support/Messages/Messages")),
  AdminSkeleton
);

// Team
const TeamMembers = Loadable(
  lazy(() => import("@/pages/Admin/Team/TeamMembers/TeamMembers")),
  AdminSkeleton
);
const TimeSheets = Loadable(
  lazy(() => import("@/pages/Admin/Team/TimeSheets/TimeSheets")),
  AdminSkeleton
);

// Tasks, Leads & Reports
const Tasks = Loadable(
  lazy(() => import("@/pages/Admin/Tasks/Tasks")),
  AdminSkeleton
);
const Leads = Loadable(
  lazy(() => import("@/pages/Admin/Leads/Leads")),
  AdminSkeleton
);
const Reports = Loadable(
  lazy(() => import("@/pages/Admin/Reports/Reports")),
  AdminSkeleton
);

const AdminDashboardLayout = () => (
  <DashboardLayout config={adminRoutes} basePath="/admin" />
);

export const adminRoutes = [
  {
    path: "/admin",
    element: <AdminDashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        icon: <Home />,
        name: "Dashboard",
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        icon: <Users2 />,
        name: "Customers",
        path: "customers",
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="clients" replace /> },
          { name: "Clients", path: "clients", element: <Clients /> },
          { name: "Client Users", path: "client-users", element: <ClientUsers /> },
        ],
      },
      {
        icon: <Folder />,
        name: "Projects",
        path: "projects",
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="projects" replace /> },
          { name: "Projects", path: "projects", element: <Projects /> },
          { name: "Templates", path: "templates", element: <ProjectTemplates /> },
        ],
      },
      {
        icon: <ListTodo />,
        name: "Tasks",
        path: "tasks",
        element: <Tasks />,
      },
      {
        icon: <PhoneCall />,
        name: "Leads",
        path: "leads",
        element: <Leads />,
      },
      {
        icon: <Wallet />,
        name: "Sales",
        path: "sales",
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="invoices" replace /> },
          { name: "Invoices", path: "invoices", element: <Invoices /> },
          { name: "Payments", path: "payments", element: <Payments /> },
          { name: "Estimates", path: "estimates", element: <Estimates /> },
          { name: "Subscriptions", path: "subscriptions", element: <Subscriptions /> },
          { name: "Products", path: "products", element: <Products /> },
          { name: "Expenses", path: "expenses", element: <Expenses /> },
        ],
      },
      {
        icon: <Bookmark />,
        name: "Proposals",
        path: "proposals",
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="proposals" replace /> },
          { name: "Proposals", path: "proposals", element: <Proposals /> },
          { name: "Templates", path: "templates", element: <ProposalTemplates /> },
        ],
      },
      {
        icon: <FileEdit />,
        name: "Contracts",
        path: "contracts",
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="contracts" replace /> },
          { name: "Contracts", path: "contracts", element: <Contracts /> },
          { name: "Templates", path: "templates", element: <ContractTemplates /> },
        ],
      },
      {
        icon: <MessageSquare />,
        name: "Support",
        path: "support",
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="tickets" replace /> },
          { name: "Tickets", path: "tickets", element: <Tickets /> },
          { name: "Canned", path: "canned", element: <Canned /> },
          { name: "Knowledgebase", path: "knowledgebase", element: <Knowledgebase /> },
          { name: "Messages", path: "messages", element: <Messages /> },
        ],
      },
      {
        icon: <Users />,
        name: "Team",
        path: "team",
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="members" replace /> },
          { name: "Team Members", path: "members", element: <TeamMembers /> },
          { name: "Time Sheets", path: "timesheets", element: <TimeSheets /> },
        ],
      },
      {
        icon: <BarChart3 />,
        name: "Reports",
        path: "reports",
        element: <Reports />,
      },
    ],
  },
];
