"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  ArrowRight,
  MessageCircle,
  Target,
  TrendingUp,
  CheckCircle,
  Star,
  Menu,
  X,
} from "lucide-react";
import FaqItem from "@/components/FaqItem";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: "Is my data private and secure?",
    a: "Absolutely. All conversations are encrypted with 256-bit encryption. We never share your data with anyone. You can delete your account and all data at any time.",
  },
  {
    q: "Is this a replacement for a doctor?",
    a: "Endura is a wellness coaching tool, not a medical service. If we detect symptoms that may require medical attention, Dr.\u00a0Maya will recommend you consult a healthcare professional.",
  },
  {
    q: "How long until I see results?",
    a: "Most users report noticeable improvement within 2\u20134 weeks of consistent practice. Your personalized program adapts to your pace.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time with no questions asked.",
  },
  {
    q: "Is this only for premature ejaculation?",
    a: "While ejaculatory control is our primary focus, Dr.\u00a0Maya also helps with performance anxiety, confidence building, and overall sexual wellness.",
  },
];

/* ------------------------------------------------------------------ */
/*  Testimonials data                                                  */
/* ------------------------------------------------------------------ */

const testimonials = [
  {
    quote:
      "After 3 weeks, I noticed a real difference. Dr.\u00a0Maya made me feel comfortable from the very first session. My control score went from 3 to 7.",
    author: "J.M., 28 \u2014 6 weeks in",
  },
  {
    quote:
      "I was skeptical about AI coaching, but the structured program actually works. My confidence has completely changed. Wish I found this sooner.",
    author: "Software developer, 34 \u2014 after 4 weeks",
  },
  {
    quote:
      "Finally something private and effective. No awkward doctor visits, no judgment. The exercises alone were worth it.",
    author: "R.K., 25 \u2014 3 weeks in",
  },
];

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* ============================================================ */}
      {/*  NAVBAR                                                       */}
      {/* ============================================================ */}
      <nav
        className="fixed top-0 z-50 w-full border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-light tracking-widest text-white/70 sm:text-2xl"
          >
            Endura
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-10 md:flex">
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-sm font-light tracking-wide text-white/50 transition-all duration-500 hover:text-white/60"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="text-sm font-light tracking-wide text-white/50 transition-all duration-500 hover:text-white/60"
            >
              About
            </button>
            <Link
              href="/login"
              className="text-sm font-light tracking-wide text-white/50 transition-all duration-500 hover:text-white/60"
            >
              Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/50 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div
            className="border-t border-white/[0.03] px-5 pb-4 pt-2 md:hidden"
            style={{ background: "rgba(8,8,8,0.6)" }}
          >
            <button
              onClick={() => scrollTo("how-it-works")}
              className="block w-full py-3 text-left text-sm font-light tracking-wide text-white/50 transition-all duration-500 hover:text-white/60"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="block w-full py-3 text-left text-sm font-light tracking-wide text-white/50 transition-all duration-500 hover:text-white/60"
            >
              About
            </button>
            <Link
              href="/login"
              className="block py-3 text-sm font-light tracking-wide text-white/50 transition-all duration-500 hover:text-white/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden px-5 pb-32 pt-44 sm:px-8 sm:pb-44 sm:pt-56">
        {/* Warm ambient glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "900px",
            height: "900px",
            background:
              "radial-gradient(circle, rgba(196,149,106,0.06) 0%, rgba(196,149,106,0.025) 40%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-40 -right-20"
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(180,120,60,0.035) 0%, transparent 60%)",
          }}
        />

        <motion.div
          className="relative mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-extralight leading-tight tracking-wide text-white/80 sm:text-6xl lg:text-7xl"
          >
            Take Control of{" "}
            <span className="text-amber-200/80">Your Confidence</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-white/40 sm:text-xl"
          >
            Your private AI therapist for lasting sexual wellness. Evidence-based.
            Judgment-free. Completely confidential.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-14 flex flex-col items-center gap-3">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)] sm:text-lg"
              style={{
                background: "rgba(196,149,106,0.1)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              Take the 3-Minute Assessment
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-xs font-light text-white/40">
              Join 2,000+ men who&apos;ve taken control
            </p>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUp}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          >
            {[
              { icon: Shield, label: "100% Private" },
              { icon: CheckCircle, label: "Therapist-Reviewed" },
              { icon: Lock, label: "256-bit Encrypted" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs font-light text-white/40"
              >
                <Icon className="h-3.5 w-3.5 text-amber-300/30" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                 */}
      {/* ============================================================ */}
      <section
        id="how-it-works"
        className="scroll-mt-20 px-5 py-28 sm:px-8 sm:py-36"
      >
        <motion.div
          className="mx-auto max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="text-3xl font-light tracking-wide leading-relaxed text-white/80 sm:text-4xl lg:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-5 max-w-lg font-light text-white/40">
              Three simple steps to a more confident you
            </p>
          </motion.div>

          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: 1,
                icon: MessageCircle,
                title: "Share Your Goals",
                desc: "Answer a few private questions so we can understand your unique situation.",
              },
              {
                step: 2,
                icon: Target,
                title: "Get Your Personal Program",
                desc: "Dr.\u00a0Maya creates a tailored multi-week plan based on proven techniques.",
              },
              {
                step: 3,
                icon: TrendingUp,
                title: "See Real Results",
                desc: "Track your progress and build lasting confidence with daily guidance.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="glass group relative p-8 transition-all duration-700 hover:shadow-[0_0_60px_rgba(196,149,106,0.04)]"
              >
                {/* Step number */}
                <span className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-normal tracking-widest text-amber-200/80 backdrop-blur-sm"
                  style={{
                    background: "rgba(196,149,106,0.1)",
                    border: "1px solid rgba(196,149,106,0.15)",
                  }}
                >
                  {step}
                </span>
                <div className="mb-5 mt-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  <Icon className="h-6 w-6 text-amber-300/40" />
                </div>
                <h3 className="text-lg font-normal tracking-wide text-white/80">
                  {title}
                </h3>
                <p className="mt-3 font-light leading-relaxed text-white/40">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  MEET DR. MAYA                                                */}
      {/* ============================================================ */}
      <section
        id="about"
        className="relative scroll-mt-20 px-5 py-28 sm:px-8 sm:py-36"
      >
        {/* Subtle warm glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(196,149,106,0.04) 0%, transparent 60%)",
          }}
        />

        <motion.div
          className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row md:gap-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Avatar */}
          <motion.div variants={fadeIn} className="shrink-0">
            <div
              className="flex h-36 w-36 items-center justify-center rounded-full sm:h-44 sm:w-44"
              style={{
                background:
                  "linear-gradient(135deg, rgba(196,149,106,0.08), rgba(196,149,106,0.02))",
                boxShadow:
                  "0 0 80px rgba(196,149,106,0.06), inset 0 0 40px rgba(196,149,106,0.03)",
              }}
            >
              <span className="text-4xl font-light tracking-wide text-amber-200/60 sm:text-5xl">
                DM
              </span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div variants={fadeUp}>
            <p className="text-[11px] font-normal uppercase tracking-widest text-amber-200/70">
              Meet Dr.&nbsp;Maya
            </p>
            <h2 className="mt-4 text-3xl font-light tracking-wide leading-relaxed text-white/80 sm:text-4xl">
              Your Personal Wellness Coach
            </h2>
            <p className="mt-6 max-w-xl font-light leading-relaxed text-white/40">
              Dr.&nbsp;Maya is an AI therapist trained on evidence-based sexual health
              techniques. She provides calm, professional guidance in a completely
              private environment. No judgment. No embarrassment. Just results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Evidence-Based", "Completely Private", "Judgment-Free"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-4 py-1.5 text-xs font-normal tracking-wide text-white/40 backdrop-blur-sm"
                    style={{
                      background: "rgba(196,149,106,0.05)",
                      border: "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                 */}
      {/* ============================================================ */}
      <section className="px-5 py-28 sm:px-8 sm:py-36">
        <motion.div
          className="mx-auto max-w-6xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="text-3xl font-light tracking-wide leading-relaxed text-white/80 sm:text-4xl lg:text-5xl">
              Real Results, Real People
            </h2>
            <p className="mx-auto mt-5 max-w-lg font-light text-white/40">
              87% of users report improved confidence after 4 weeks
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {testimonials.map(({ quote, author }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="glass flex flex-col p-8 sm:p-10"
              >
                {/* Stars */}
                <div className="mb-5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5 fill-amber-300/50 text-amber-300/50"
                    />
                  ))}
                </div>
                <p className="flex-1 font-light italic leading-relaxed text-white/45">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="mt-6 text-sm font-light text-white/50">
                  &mdash; {author}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                          */}
      {/* ============================================================ */}
      <section className="px-5 py-28 sm:px-8 sm:py-36">
        <motion.div
          className="mx-auto max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="text-3xl font-light tracking-wide leading-relaxed text-white/80 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-5 max-w-lg font-light text-white/40">
              Everything you need to know before getting started
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="glass mt-14 px-7 sm:px-10"
          >
            {faqs.map(({ q, a }) => (
              <FaqItem key={q} question={q} answer={a} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  BOTTOM CTA                                                   */}
      {/* ============================================================ */}
      <section className="relative px-5 py-28 sm:px-8 sm:py-36">
        {/* Warm glow behind CTA */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(196,149,106,0.05) 0%, transparent 60%)",
          }}
        />

        <motion.div
          className="relative mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-light tracking-wide leading-relaxed text-white/80 sm:text-4xl lg:text-5xl"
          >
            Ready to Take Control?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-md font-light text-white/40"
          >
            Join 2,000+ men building real confidence with Dr.&nbsp;Maya.
            Your first step starts here.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-12">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)] sm:text-lg"
              style={{
                background: "rgba(196,149,106,0.1)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              Get Your Free Personal Plan
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="border-t border-white/[0.03] px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 text-center">
          {/* Brand */}
          <Link
            href="/"
            className="text-lg font-light tracking-widest text-white/40"
          >
            Endura
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-light text-white/40">
            <Link
              href="/privacy"
              className="transition-all duration-500 hover:text-white/55"
            >
              Privacy Policy
            </Link>
            <span className="hidden text-white/[0.06] sm:inline">|</span>
            <Link
              href="/terms"
              className="transition-all duration-500 hover:text-white/55"
            >
              Terms of Service
            </Link>
            <span className="hidden text-white/[0.06] sm:inline">|</span>
            <Link
              href="/contact"
              className="transition-all duration-500 hover:text-white/55"
            >
              Contact
            </Link>
          </div>

          {/* Disclaimers */}
          <div className="space-y-1.5 text-xs font-light text-white/40">
            <p>18+ Only. Not medical advice.</p>
            <p>&copy; {new Date().getFullYear()} Endura. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
