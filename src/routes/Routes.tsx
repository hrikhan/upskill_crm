import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { routesGenerator } from "@/utils/Generator/RoutesGenerator";

import { adminRoutes } from "./AdminRoutes";
import { userRoutes } from "./UserRoutes";
import Skeleton from "@/common/Skeleton";

// Auth card placeholder skeleton
const AuthSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-primary-bg">
    <div className="w-full max-w-md p-8 rounded-xl bg-[#0b0f15] border border-white/10 space-y-6 animate-pulse">
      <Skeleton className="h-8 w-40 mx-auto bg-white/10" />
      <Skeleton className="h-4 w-56 mx-auto bg-white/10" />
      <div className="space-y-4 pt-4">
        <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
        <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
        <Skeleton className="h-10 w-full bg-primary-brand/30 rounded-lg" />
      </div>
    </div>
  </div>
);

// Core pages
const Home = lazy(() => import("@/pages/Public/Home/Home"));
const Login = lazy(() => import("@/pages/Auth/Login"));
const Register = lazy(() => import("@/pages/Auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/Auth/ForgotPassword"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const routes = createBrowserRouter([
  // Home page without public layout
  {
    path: "/",
    element: (
      <Suspense fallback={<AuthSkeleton />}>
        <Home />
      </Suspense>
    ),
  },

  // Auth routes
  {
    path: "/login",
    element: (
      <Suspense fallback={<AuthSkeleton />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<AuthSkeleton />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<AuthSkeleton />}>
        <ForgotPassword />
      </Suspense>
    ),
  },

  // Admin and User routes matching the module route structure
  ...routesGenerator(adminRoutes),
  ...routesGenerator(userRoutes),

  // Catch-all route
  {
    path: "*",
    element: (
      <Suspense fallback={<AuthSkeleton />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default routes;
