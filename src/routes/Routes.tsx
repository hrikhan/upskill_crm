import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { routesGenerator } from "@/utils/Generator/RoutesGenerator";


import { adminRoutes } from "./AdminRoutes";
import DashboardLayout from "@/Layout/DashboardLayout/DashboardLayout";



import { userRoutes } from "./UserRoutes";



import { publicRoutes } from "./PublicRoutes";


// CORE COMPONENTS (Always included)
const App = lazy(() => import("../App"));
const Login = lazy(() => import("@/pages/Auth/Login"));
const Register = lazy(() => import("@/pages/Auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/Auth/ForgotPassword"));
const Form = lazy(() => import("@/pages/Form"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    ),
    children: [
      
      ...routesGenerator(publicRoutes),
      
      {
        path: "/form",
        element: <Form />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPassword />
      </Suspense>
    ),
  },

  
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div>Loading Dashboard...</div>}>
        <DashboardLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/overview"/>,
      },
      ...routesGenerator(adminRoutes),
    ],
  },
  

  
  {
    path: "/user",
    element: (
      <Suspense fallback={<div>Loading Dashboard...</div>}>
        <DashboardLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/user/overview"/>,
      },
      ...routesGenerator(userRoutes),
    ],
  },
  

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
