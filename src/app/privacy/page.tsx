"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Trash2 } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen font-sans text-white">
      {/* Header */}
      <nav
        className="fixed top-0 z-50 w-full border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="text-xl font-light tracking-widest text-white/70"
          >
            Endura
          </Link>
          <Link
            href="/"
            className="text-sm font-light text-white/30 transition-all duration-500 hover:text-white/50"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <motion.main
        className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          variants={fadeUp}
          className="text-3xl font-light tracking-wide text-white/80 sm:text-4xl"
        >
          Privacy Policy
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-3 text-sm font-light text-white/30"
        >
          Last updated: February 2026
        </motion.p>

        {/* Privacy Shield Banner */}
        <motion.div
          variants={fadeUp}
          className="glass mt-10 p-7 sm:p-8"
          style={{ borderColor: "rgba(196,149,106,0.08)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-amber-300/40" />
            <h2 className="text-lg font-normal text-white/70">
              Privacy Shield
            </h2>
          </div>
          <p className="text-sm font-light leading-relaxed text-white/45">
            Your privacy is not just a policy — it&apos;s the foundation of
            Endura. We built this platform with the understanding that what you
            share is deeply personal. Here&apos;s our promise in plain language:
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Lock,
                title: "Encrypted",
                desc: "All data encrypted at rest and in transit with 256-bit encryption",
              },
              {
                icon: Eye,
                title: "Private",
                desc: "No human ever reads your conversations. AI processing only.",
              },
              {
                icon: Shield,
                title: "No Selling",
                desc: "We never sell, share, or monetize your personal data.",
              },
              {
                icon: Trash2,
                title: "Your Control",
                desc: "Delete all your data anytime with one tap from Settings.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/30" />
                <div>
                  <p className="text-sm font-normal text-white/60">{title}</p>
                  <p className="text-xs font-light text-white/35">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-10 space-y-8 text-sm font-light leading-relaxed text-white/45"
        >
          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              1. What We Collect
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="font-normal text-white/55">Account info:</strong> Email
                address and display name (via Google OAuth or magic link)
              </li>
              <li>
                <strong className="font-normal text-white/55">Onboarding responses:</strong>{" "}
                Your answers to the 16 intake questions — used solely to
                personalize your program
              </li>
              <li>
                <strong className="font-normal text-white/55">Conversations:</strong> Messages
                between you and Dr. Maya — stored to maintain session continuity
              </li>
              <li>
                <strong className="font-normal text-white/55">Progress data:</strong> Daily
                self-reported scores and milestone tracking
              </li>
              <li>
                <strong className="font-normal text-white/55">Payment info:</strong> Processed
                entirely by Stripe — we never see or store your card number
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              2. How We Use Your Data
            </h2>
            <p>
              Your data is used exclusively to provide and improve your coaching
              experience. We use your onboarding answers and conversation history
              to personalize Dr. Maya&apos;s guidance. We do not use your data
              for advertising, marketing to third parties, or AI model training.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              3. Data Storage & Security
            </h2>
            <p>
              All data is stored in Supabase (hosted on AWS) with encryption at
              rest enabled by default. All connections use TLS 1.3. Access to the
              database is restricted to application-level service accounts with
              Row Level Security (RLS) enforcing per-user data isolation.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              4. Third-Party Services
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="font-normal text-white/55">Anthropic (Claude API):</strong>{" "}
                Processes your messages to generate Dr. Maya&apos;s responses. Anthropic
                does not use API data for model training.
              </li>
              <li>
                <strong className="font-normal text-white/55">Stripe:</strong> Handles payment
                processing. Subject to{" "}
                <span className="text-amber-200/40">Stripe&apos;s Privacy Policy</span>.
              </li>
              <li>
                <strong className="font-normal text-white/55">Supabase:</strong> Database and
                authentication provider with SOC 2 compliance.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              5. Session Amnesia
            </h2>
            <p>
              You can delete individual conversations or all your data at any
              time from the Settings page. When you delete data, it is
              permanently removed from our database within 30 days (including
              backups).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              6. Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active. If you
              delete your account, all data is permanently removed. Inactive
              accounts (no login for 12 months) may be flagged for deletion with
              30 days advance notice via email.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              7. Your Rights
            </h2>
            <p>
              You have the right to access, export, or delete your data at any
              time. For data export requests or questions, contact us at{" "}
              <span className="text-amber-200/40">privacy@endura.app</span>.
            </p>
          </section>
        </motion.div>
      </motion.main>
    </div>
  );
}
