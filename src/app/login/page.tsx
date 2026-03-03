"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError("");
      setLoading(false);
      setEmailSent(email);
      setResendCooldown(60);
    }
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0 || !emailSent) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: emailSent,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setResendCooldown(60);
    setLoading(false);
  }, [resendCooldown, emailSent]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 font-sans text-white">
      <motion.div
        className="w-full max-w-sm"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <Link
            href="/"
            className="text-2xl font-light tracking-widest text-white/70"
          >
            Endura
          </Link>
          <p className="mt-3 text-sm font-light text-white/35">
            Sign in to continue your journey
          </p>
        </motion.div>

        {/* Google OAuth */}
        <motion.div variants={fadeUp}>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-base font-normal tracking-wide text-white/70 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.06)] disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          className="my-8 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-white/[0.04]" />
          <span className="text-xs font-light text-white/50">or</span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </motion.div>

        {/* Email magic link */}
        {emailSent ? (
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center text-center"
          >
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.12)",
              }}
            >
              <CheckCircle className="h-7 w-7 text-emerald-400/60" />
            </div>
            <p className="text-sm font-light text-white/60">
              Magic link sent to
            </p>
            <p className="mt-1 text-sm font-normal text-white/80">
              {emailSent}
            </p>
            <p className="mt-3 text-xs font-light text-white/50">
              Check your inbox and spam folder
            </p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className="mt-4 text-sm font-light text-amber-200/50 transition-all duration-500 hover:text-amber-200/70 disabled:text-white/40 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend link"}
            </button>
            <button
              onClick={() => { setEmailSent(""); setError(""); }}
              className="mt-2 text-xs font-light text-white/50 transition-all hover:text-white/60"
            >
              Use a different email
            </button>
          </motion.div>
        ) : (
          <motion.form variants={fadeUp} onSubmit={handleEmailLogin}>
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-500"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <Mail className="h-5 w-5 text-white/50" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full bg-transparent text-sm font-light text-white/70 outline-none placeholder:text-white/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)] disabled:opacity-50"
              style={{
                background: "rgba(196,149,106,0.1)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              Send Magic Link
            </button>
          </motion.form>
        )}

        {error && (
          <p className="mt-4 text-center text-sm font-light text-red-400/60">
            {error}
          </p>
        )}

        {/* Trust signals */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-xs font-light text-white/50">
            <Shield className="h-3.5 w-3.5 text-amber-300/25" />
            <span>100% Private</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-light text-white/50">
            <Lock className="h-3.5 w-3.5 text-amber-300/25" />
            <span>256-bit Encrypted</span>
          </div>
        </motion.div>

        {/* Back to home */}
        <motion.div variants={fadeUp} className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-light text-white/50 transition-all duration-500 hover:text-white/60"
          >
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
