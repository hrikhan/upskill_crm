"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme.tsx";
import { ThemeToggle } from "@/common/ThemeToggle";
import Logo from "@/common/Logo";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("johndheere@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme("light");
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Welcome back! Login successful.");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col gap-10 items-center justify-center bg-white dark:bg-slate-950 p-4 select-none relative">
      {/* Top Navigation Controls */}
      <div className="absolute top-3 left-0 right-0 w-full">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div onClick={() => navigate("/")} className="cursor-pointer w-52 transition-transform hover:scale-105 active:scale-95">
            <Logo />
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Title Centered Above the Card */}
      <h1 className="text-3xl font-medium text-[#2b353d] dark:text-slate-100 tracking-wide text-center w-full">
        Login
      </h1>

      {/* Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[488px] bg-[#f6f9ff] dark:bg-slate-900 rounded-xl p-8 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-slate-100/50 dark:border-slate-800/50 flex flex-col gap-3"
      >
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
          {/* Email Input */}
          <div className="flex flex-col gap-2 px-4 w-full">
            <label className="text-sm font-medium text-[#2b353d] dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent! focus:bg-transparent! border-b border-border/80 px-3 py-2.5 text-sm text-primary-text focus:border-[#337bff] focus:outline-none transition-colors cursor-pointer"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2 px-4 w-full relative">
            <label className="text-sm font-medium text-[#2b353d] dark:text-slate-300">
              password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent! focus:bg-transparent! border-b border-border/80 px-3 py-2.5 pr-10 text-sm text-primary-text focus:border-[#337bff] focus:outline-none transition-colors cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 bottom-3 text-secondary-text hover:text-[#337bff] transition-colors"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>

          {/* Actions Group (Forgot password and Submit button) */}
          <div className="flex flex-col gap-10 px-4 w-full mt-4">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-[#1c73e0] text-sm font-medium hover:underline cursor-pointer self-start"
            >
              Forgot password
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-brand-gradient text-white font-medium text-sm rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </form>

        {/* Bottom Registration Link */}
        <p className="text-center text-sm text-secondary-text mt-4">
          Don’t have account ?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#1c73e0] font-semibold hover:underline cursor-pointer"
          >
            Register Now
          </span>
        </p>
      </motion.div>
    </div>
  );
}
