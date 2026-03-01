"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Shield } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

const SUPPORT_EMAIL = "support@endura-app.com";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen font-sans text-white">
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
        className="mx-auto max-w-2xl px-5 pt-32 pb-20 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <MessageCircle className="h-7 w-7 text-amber-300/40" />
          </div>
          <h1 className="text-3xl font-light tracking-wide text-white/80 sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-base font-light text-white/40">
            Have a question or need help? We&apos;re here for you.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="glass p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-5 w-5 text-amber-300/40" />
            <h2 className="text-base font-normal tracking-wide text-white/70">
              Email Us
            </h2>
          </div>

          <p className="text-sm font-light leading-relaxed text-white/40 mb-6">
            For support, questions, or feedback — reach out and we&apos;ll get
            back to you within 24 hours.
          </p>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)]"
            style={{
              background: "rgba(196,149,106,0.1)",
              border: "1px solid rgba(196,149,106,0.15)",
            }}
          >
            <Mail className="h-4 w-4" />
            {SUPPORT_EMAIL}
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8">
          <div className="flex items-center justify-center gap-2 text-xs font-light text-white/40">
            <Shield className="h-3.5 w-3.5 text-amber-300/20" />
            <span>All communications are private &amp; confidential</span>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
