"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Shield,
  Lock,
  CreditCard,
  Star,
  Crown,
  Sparkles,
} from "lucide-react";
import FaqItem from "@/components/FaqItem";
import { fadeUp, staggerContainer } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    q: "Can I switch plans?",
    a: "Yes, you can upgrade or downgrade at any time.",
  },
  {
    q: "Is there a free trial?",
    a: "We offer a 7-day money-back guarantee instead. Try Endura risk-free.",
  },
  {
    q: "How does billing work?",
    a: "You'll be billed monthly. Cancel anytime from your settings.",
  },
  {
    q: "Is my payment secure?",
    a: "All payments are processed through Stripe with bank-level encryption.",
  },
];

/* ------------------------------------------------------------------ */
/*  Plan data                                                          */
/* ------------------------------------------------------------------ */

const plans = [
  {
    name: "Pro",
    price: "$14.99",
    period: "/month",
    icon: Sparkles,
    popular: false,
    planKey: "pro",
    features: [
      "AI coaching with Dr. Maya",
      "Personalized multi-week program",
      "Progress tracking & insights",
      "2 sessions per day (30 messages each)",
      "Exercise library",
    ],
  },
  {
    name: "Premium",
    price: "$29.99",
    period: "/month",
    icon: Crown,
    popular: true,
    planKey: "premium",
    features: [
      "Everything in Pro",
      "Unlimited sessions per day",
      "60 messages per session",
      "Deeper advanced programs",
      "Priority response speed",
      "Relationship coaching module",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main pricing page                                                  */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  const handleGetStarted = (planKey: string) => {
    window.location.href = `/login?plan=${planKey}`;
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* HEADER */}
      <section className="relative overflow-hidden px-5 pb-12 pt-20 sm:px-8 sm:pb-16 sm:pt-28">
        <motion.div
          className="relative mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <Check className="h-7 w-7 text-amber-300/40" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-3xl font-light leading-relaxed tracking-wide text-white/80 sm:text-4xl lg:text-5xl"
          >
            Your Program is Ready
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-md text-lg font-light leading-relaxed text-white/40"
          >
            Choose the plan that&apos;s right for your journey
          </motion.p>
        </motion.div>
      </section>

      {/* PRICING CARDS */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <motion.div
          className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2 md:items-start"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className="glass relative flex flex-col p-8 transition-all duration-700 sm:p-10"
              style={
                plan.popular
                  ? { border: "1px solid rgba(196,149,106,0.1)" }
                  : undefined
              }
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-normal uppercase tracking-[0.2em]"
                    style={{
                      background: "rgba(196,149,106,0.12)",
                      border: "1px solid rgba(196,149,106,0.15)",
                      color: "rgba(212,180,140,0.8)",
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <plan.icon className="h-5 w-5 text-amber-300/35" />
                </div>
                <h2 className="text-base font-normal uppercase tracking-[0.2em] text-white/70">
                  {plan.name}
                </h2>
              </div>

              <div className="mt-7 flex items-baseline gap-1">
                <span className="text-4xl font-extralight tracking-tight text-white/80 sm:text-5xl">
                  {plan.price}
                </span>
                <span className="text-base font-light text-white/50">
                  {plan.period}
                </span>
              </div>

              <div className="my-7 h-px bg-white/[0.04]" />

              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/35" />
                    <span className="font-light text-white/45">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleGetStarted(plan.planKey)}
                className={`mt-8 flex items-center justify-center rounded-full px-8 py-4 text-base font-normal tracking-wide transition-all duration-500 ${
                  plan.popular
                    ? "text-amber-200/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(196,149,106,0.08)]"
                    : "text-white/50 hover:bg-white/[0.05]"
                }`}
                style={
                  plan.popular
                    ? {
                        background: "rgba(196,149,106,0.1)",
                        border: "1px solid rgba(196,149,106,0.15)",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }
                }
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <motion.div
          className="mx-auto max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
            {[
              { icon: Shield, label: "Cancel anytime" },
              { icon: CreditCard, label: "100% money-back guarantee" },
              { icon: Lock, label: "256-bit encryption" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm font-light text-white/40"
              >
                <Icon className="h-3.5 w-3.5 text-amber-300/25" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <p className="text-lg font-light text-white/50 sm:text-xl">
            Join 10,000+ men already improving their confidence
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-300/40 text-amber-300/40"
                />
              ))}
            </div>
            <span className="text-sm font-light text-white/60">4.9/5</span>
            <span className="text-sm font-light text-white/50">rating</span>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
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
              Everything you need to know about your plan
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

      {/* BOTTOM CTA */}
      <section className="px-5 py-28 sm:px-8 sm:py-36">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="text-lg font-light text-white/50 sm:text-xl"
          >
            Still unsure? Start with Pro and upgrade anytime.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7">
            <Link
              href="/contact"
              className="text-sm font-light text-amber-200/50 underline underline-offset-4 transition-all duration-500 hover:text-amber-200/70"
            >
              Have questions? Contact us
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.03] px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 text-center">
          <Link
            href="/"
            className="text-lg font-light tracking-widest text-white/35"
          >
            Endura
          </Link>

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

          <div className="space-y-1.5 text-xs font-light text-white/40">
            <p>18+ Only. Not medical advice.</p>
            <p>&copy; {new Date().getFullYear()} Endura. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
