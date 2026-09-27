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
  Crown,
} from "lucide-react";

import Loadable from "@/utils/Loadable";
import { AdminSkeleton } from "@/common/Skeleton/Admin/AdminSkeleton";
import DashboardLayout from "@/Layout/DashboardLayout/DashboardLayout";

// Super Admin Exclusive
const Admins = Loadable(
  lazy(() => import("@/pages/Admins/Admins")),
  AdminSkeleton
);

// Overview Dashboard
const AdminDashboard = Loadable(
  lazy(() => import("@/pages/Dashboard/Overview/Overview")),
  AdminSkeleton
);

// Customers
const Clients = Loadable(
  lazy(() => import("@/pages/Customers/Clients/Clients")),
  AdminSkeleton
);
const ClientUsers = Loadable(
  lazy(() => import("@/pages/Customers/ClientUsers/ClientUsers")),
  AdminSkeleton
);

// Projects
const Projects = Loadable(
  lazy(() => import("@/pages/Projects/Projects/Projects")),
  AdminSkeleton
);
const ProjectTemplates = Loadable(
  lazy(() => import("@/pages/Projects/Templates/Templates")),
  AdminSkeleton
);

// Sales
const Invoices = Loadable(
  lazy(() => import("@/pages/Sales/Invoices/Invoices")),
  AdminSkeleton
);
const Payments = Loadable(
  lazy(() => import("@/pages/Sales/Payments/Payments")),
  AdminSkeleton
);
const Estimates = Loadable(
  lazy(() => import("@/pages/Sales/Estimates/Estimates")),
  AdminSkeleton
);
const Subscriptions = Loadable(
  lazy(() => import("@/pages/Sales/Subscriptions/Subscriptions")),
  AdminSkeleton
);
const Products = Loadable(
  lazy(() => import("@/pages/Sales/Products/Products")),
  AdminSkeleton
);
const Expenses = Loadable(
  lazy(() => import("@/pages/Sales/Expenses/Expenses")),
  AdminSkeleton
);

// Proposals
const Proposals = Loadable(
  lazy(() => import("@/pages/Proposals/Proposals/Proposals")),
  AdminSkeleton
);
const ProposalTemplates = Loadable(
  lazy(() => import("@/pages/Proposals/Templates/Templates")),
  AdminSkeleton
);

// Contracts
const Contracts = Loadable(
  lazy(() => import("@/pages/Contracts/Contracts/Contracts")),
  AdminSkeleton
);
const ContractTemplates = Loadable(
  lazy(() => import("@/pages/Contracts/Templates/Templates")),
  AdminSkeleton
);

// Support
const Tickets = Loadable(
  lazy(() => import("@/pages/Support/Tickets/Tickets")),
  AdminSkeleton
);
const Canned = Loadable(
  lazy(() => import("@/pages/Support/Canned/Canned")),
  AdminSkeleton
);
const Knowledgebase = Loadable(
  lazy(() => import("@/pages/Support/Knowledgebase/Knowledgebase")),
  AdminSkeleton
);
const Messages = Loadable(
  lazy(() => import("@/pages/Support/Messages/Messages")),
  AdminSkeleton
);

// Team & HR
const TeamMembers = Loadable(
  lazy(() => import("@/pages/Team/TeamMembers/TeamMembers")),
  AdminSkeleton
);
const Leaves = Loadable(
  lazy(() => import("@/pages/Team/Leaves/Leaves")),
  AdminSkeleton
);
const TimeSheets = Loadable(
  lazy(() => import("@/pages/Team/TimeSheets/TimeSheets")),
  AdminSkeleton
);

// Tasks, Leads & Reports
const Tasks = Loadable(
  lazy(() => import("@/pages/Tasks/Tasks")),
  AdminSkeleton
);
const Leads = Loadable(
  lazy(() => import("@/pages/Leads/Leads")),
  AdminSkeleton
);
const Reports = Loadable(
  lazy(() => import("@/pages/Reports/Reports")),
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
        icon: <Crown />,
        name: "Admins",
        path: "admins",
        element: <Admins />,
      },
      {
        icon: <Users />,
        name: "HR & Team",
        path: "team",
        element: <Outlet />,
        children: [
          { index: true, element: <Navigate to="members" replace /> },
          { name: "Team Members", path: "members", element: <TeamMembers /> },
          { name: "Leave Requests", path: "leaves", element: <Leaves /> },
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
