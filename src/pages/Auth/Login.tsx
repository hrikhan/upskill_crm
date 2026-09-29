"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Shield,
  Crown,
  Briefcase,
  CreditCard,
  Building2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/common/ThemeToggle";
import { useAppDispatch } from "@/hooks/useRedux";
import { switchRolePreset } from "@/store/features/AuthSlice/authSlice";

interface DemoAccount {
  id: string;
  preset: "super_admin" | "admin" | "staff_sales" | "staff_billing" | "staff_hr";
  roleTitle: string;
  name: string;
  email: string;
  pass: string;
  icon: React.ReactNode;
}

const demoAccounts: DemoAccount[] = [
  {
    id: "super_admin",
    preset: "super_admin",
    roleTitle: "Super Admin",
    name: "Upskill CRM",
    email: "superadmin@upskillcrm.com",
    pass: "super123",
    icon: <Crown className="w-4 h-4 text-amber-500" />,
  },
  {
    id: "admin",
    preset: "admin",
    roleTitle: "Admin",
    name: "Hridoy Khan",
    email: "admin@upskillcrm.com",
    pass: "admin123",
    icon: <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
  },
  {
    id: "staff_sales",
    preset: "staff_sales",
    roleTitle: "Staff (Sales)",
    name: "Sarah Jenkins",
    email: "sales@upskillcrm.com",
    pass: "staff123",
    icon: <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    id: "staff_billing",
    preset: "staff_billing",
    roleTitle: "Staff (Billing)",
    name: "Rashid Ahmed",
    email: "billing@upskillcrm.com",
    pass: "staff123",
    icon: <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    id: "staff_hr",
    preset: "staff_hr",
    roleTitle: "Staff (HR)",
    name: "Farhana Yasmin",
    email: "hr@upskillcrm.com",
    pass: "staff123",
    icon: <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("superadmin@upskillcrm.com");
  const [password, setPassword] = useState("super123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState<string>("super_admin");

  const handleSelectDemo = (acc: DemoAccount) => {
    setSelectedDemoId(acc.id);
    setEmail(acc.email);
    setPassword(acc.pass);
    toast.info(`Filled credentials for ${acc.roleTitle} (${acc.name})`);
  };

  const handleQuickLogin = (acc: DemoAccount) => {
    setSelectedDemoId(acc.id);
    setEmail(acc.email);
    setPassword(acc.pass);
    setIsSubmitting(true);

    setTimeout(() => {
      dispatch(switchRolePreset(acc.preset));
      setIsSubmitting(false);
      toast.success(`Welcome, ${acc.name}!`);
      navigate("/admin/dashboard");
    }, 500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let target = demoAccounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (!target) {
      if (email.toLowerCase().includes("super")) target = demoAccounts[0];
      else if (email.toLowerCase().includes("admin")) target = demoAccounts[1];
      else if (email.toLowerCase().includes("sales")) target = demoAccounts[2];
      else if (email.toLowerCase().includes("billing")) target = demoAccounts[3];
      else if (email.toLowerCase().includes("hr")) target = demoAccounts[4];
      else target = demoAccounts[0];
    }

    setTimeout(() => {
      dispatch(switchRolePreset(target.preset));
      setIsSubmitting(false);
      toast.success(`Welcome, ${target.name}!`);
      navigate("/admin/dashboard");
    }, 600);
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-primary-background text-primary-text select-none overflow-hidden">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-4 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* Left Column: Fresh Generated GPS Tracker CRM Hero Image */}
      <div className="hidden lg:flex w-[48%] h-screen relative flex-col justify-between p-10 xl:p-14 text-white overflow-hidden shrink-0">
        <img
          src="/gps_crm_hero.jpg"
          alt="GPS Tracker Sales & Pipeline CRM"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-900/60" />

        {/* Brand Header */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
            U
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block leading-none">
              UPSKILL <span className="text-sky-400">CRM</span>
            </span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              GPS Sales, Lead Pipeline & Invoicing CRM
            </span>
          </div>
        </div>

        {/* Bottom Headline */}
        <div className="z-10 max-w-md pb-4">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-sky-300 backdrop-blur-md mb-3">
            Hardware Sales & Monthly Subscriptions
          </div>
          <h2 className="text-2xl xl:text-3xl font-bold text-white tracking-tight leading-snug">
            From Lead Inquiries to Installed Units & Paid Invoices
          </h2>
          <p className="text-sm text-slate-300 mt-2 font-normal leading-relaxed">
            A focused business platform to convert sales inquiries, dispatch GPS devices, and manage monthly recurring client installments.
          </p>
        </div>
      </div>

      {/* Right Column: Fresh, Clean Sign In Form + Demo Logins Below */}
      <div className="w-full lg:w-[52%] h-screen flex flex-col justify-between p-6 sm:p-10 xl:p-14 bg-card surface z-10 overflow-y-auto">
        <div className="hidden lg:block h-2" />

        <div className="max-w-[420px] w-full mx-auto my-auto space-y-6">
          {/* Form Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-text">
              Sign In
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text mt-1">
              Enter your corporate credentials to access your workspace.
            </p>
          </div>

          {/* Primary Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-primary-text block">
                Work Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 h-11 bg-light-background border border-border rounded-xl text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-primary-text">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 h-11 bg-light-background border border-border rounded-xl text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 border-border focus:ring-sky-500 cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="text-xs text-secondary-text cursor-pointer select-none font-medium"
              >
                Remember this device
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-card surface px-3 text-[11px] font-semibold uppercase tracking-wider text-secondary-text absolute">
              Or 1-Click Demo Login
            </span>
          </div>

          {/* Demo Login Cards (BELOW FORM) */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => {
                const isSelected = selectedDemoId === acc.id;

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickLogin(acc)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-50/70 dark:bg-sky-950/40 border-sky-500/80 shadow-xs"
                        : "bg-light-background border-border hover:border-slate-400 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-border flex items-center justify-center shrink-0 mt-0.5">
                      {acc.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary-text block truncate leading-tight">
                          {acc.roleTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-secondary-text block truncate mt-0.5">
                        {acc.name}
                      </span>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium block truncate mt-0.5">
                        Click to login →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-secondary-text text-center lg:text-left pt-4">
          © {new Date().getFullYear()} Upskill CRM • GPS Sales & Invoicing CRM
        </div>
      </div>
    </div>
  );
}
