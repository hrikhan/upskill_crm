"use client";

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme.tsx";
import { ThemeToggle } from "@/common/ThemeToggle";
import Logo from "@/common/Logo";

// Reusable Step Indicators Component
function StepIndicators({ step }: { step: "email" | "otp" | "reset" }) {
  return (
    <div className="flex gap-3 justify-center items-center w-full">
      <div className={`h-1 rounded-full w-8 transition-colors ${step === "email" ? "bg-primary-text dark:bg-slate-300" : "bg-slate-200 dark:bg-slate-800"}`} />
      <div className={`h-1 rounded-full w-8 transition-colors ${step === "otp" ? "bg-primary-text dark:bg-slate-300" : "bg-slate-200 dark:bg-slate-800"}`} />
      <div className={`h-1 rounded-full w-8 transition-colors ${step === "reset" ? "bg-primary-text dark:bg-slate-300" : "bg-slate-200 dark:bg-slate-800"}`} />
    </div>
  );
}

// Helper to compute step-specific header details
const getStepDetails = (step: "email" | "otp" | "reset") => {
  switch (step) {
    case "email":
      return {
        imageSrc: "/Claps.svg",
        altText: "Envelope Icon",
        title: "Forget Password",
        description: "Enter your email address or mobile number to receive a verification code and reset your password."
      };
    case "otp":
      return {
        imageSrc: "/Claps.svg",
        altText: "Envelope Icon",
        title: "Enter OTP",
        description: "Enter the OTP code we just sent you on your registered Email/Phone number"
      };
    case "reset":
      return {
        imageSrc: "/Lock-locked.svg",
        altText: "Lock Icon",
        title: "Reset Password",
        description: "Create a new strong password. Make sure it is at least 8 characters long and contains letters and numbers."
      };
  }
};

// Reusable Step Header Component
function StepHeader({ step }: { step: "email" | "otp" | "reset" }) {
  const { imageSrc, altText, title, description } = getStepDetails(step);
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="relative w-[110px] h-[110px] shrink-0 bg-brand-purple/20 rounded-2xl flex items-center justify-center">
        <img
          src={imageSrc}
          alt={altText}
          className="object-contain p-2 w-full h-full"
        />
      </div>
      <h2 className="font-semibold text-3xl text-primary-text dark:text-white tracking-wide">
        {title}
      </h2>
      <p className="text-secondary-text text-sm">
        {description}
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme("light");
  }, []);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.info("OTP sent to your registered Email/Phone.");
      setStep("otp");
    }, 1200);
  };

  const handleForgotOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("OTP verified!");
      setStep("reset");
    }, 1200);
  };

  const handleForgotResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Password reset successfully! Please log in.");
      navigate("/login");
    }, 1500);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.charAt(val.length - 1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Focus next input
    if (val !== "" && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleBack = () => {
    if (step === "email") {
      navigate("/login");
    } else if (step === "otp") {
      setStep("email");
    } else {
      setStep("otp");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col gap-10 items-center justify-center bg-white! dark:bg-slate-950 p-4 select-none relative">
      {/* Top Navigation Controls */}
      <div className="absolute top-3 left-0 right-0 w-full">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div onClick={() => navigate("/")} className="cursor-pointer w-52 transition-transform hover:scale-105 active:scale-95">
            <Logo />
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Unified Card Wrapper */}
      <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-xl p-8 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center gap-8">
        {/* Step Indicators */}
        <StepIndicators step={step} />

        {/* Step Header (Dynamic Title, Description, and Icon) */}
        <StepHeader step={step} />

        <AnimatePresence mode="wait">
          {/* STEP 1: EMAIL OR PHONE */}
          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <form onSubmit={handleForgotEmailSubmit} className="flex flex-col gap-5 w-full">
                {/* Email/Mobile field */}
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-brand-blue w-full transition-all">
                  <input
                    type="text"
                    required
                    placeholder="Email I’D/ Mobile Number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full text-sm text-primary-text outline-none bg-transparent! focus:bg-transparent! cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-brand-gradient text-white font-medium text-sm rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : "Continue"}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col gap-6"
            >
              <form onSubmit={handleForgotOtpSubmit} className="flex flex-col gap-6 w-full">
                {/* 5 digit OTP inputs */}
                <div className="flex justify-center gap-2 w-full">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      required
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      value={digit}
                      maxLength={1}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-[56px] h-[56px] rounded-xl text-center text-2xl font-bold text-primary-text border border-transparent focus:border-brand-blue bg-slate-100! dark:bg-slate-800! focus:bg-slate-100! dark:focus:bg-slate-800! outline-none transition-all cursor-pointer"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-brand-gradient text-white font-medium text-sm rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : "Reset Password"}
                </button>
              </form>

              {/* Resend link */}
              <p className="text-sm text-secondary-text text-center w-full">
                Didn’t get OTP?{" "}
                <span
                  onClick={() => toast.success("OTP code resent successfully!")}
                  className="text-brand-blue font-semibold hover:underline cursor-pointer"
                >
                  Resend OTP
                </span>
              </p>
            </motion.div>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === "reset" && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <form onSubmit={handleForgotResetSubmit} className="flex flex-col gap-4 w-full">
                {/* New Password */}
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 flex items-center justify-between border border-transparent focus-within:border-brand-blue w-full transition-all relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full text-sm text-primary-text outline-none bg-transparent! focus:bg-transparent! pr-10 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-secondary-text hover:text-brand-blue transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>

                {/* Confirm New Password */}
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 flex items-center justify-between border border-transparent focus-within:border-brand-blue w-full transition-all relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full text-sm text-primary-text outline-none bg-transparent! focus:bg-transparent! pr-10 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-secondary-text hover:text-brand-blue transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-brand-gradient text-white font-medium text-sm rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back button wrapper positioned below the card */}
      <button
        onClick={handleBack}
        className="flex gap-2 items-center text-sm font-medium text-primary-text dark:text-slate-300 hover:text-brand-blue cursor-pointer transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>
    </div>
  );
}
