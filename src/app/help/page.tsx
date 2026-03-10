"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, Mail, BookOpen, MessageCircle, Shield } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useState } from "react";

const SUPPORT_EMAIL = "endura288@gmail.com";

const FAQ_ITEMS = [
  {
    question: "What is Endura?",
    answer:
      "Endura is an AI-powered sexual health coaching app for men. It provides guided pelvic floor exercises, breathing techniques, and personalized coaching from Dr. Maya, your private AI health coach.",
  },
  {
    question: "Is Dr. Maya a real doctor?",
    answer:
      "No. Dr. Maya is an AI coach powered by advanced language models. She provides educational wellness guidance, not medical advice. Always consult a licensed healthcare professional for medical concerns.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "Subscriptions are managed through the App Store. Go to Settings > Apple ID > Subscriptions on your iPhone, find Endura, and tap Cancel Subscription. You'll keep access until the end of your billing period.",
  },
  {
    question: "How do I restore my purchases?",
    answer:
      "Open Endura > Settings > Restore Purchases. This will recover any active subscriptions linked to your Apple ID.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Your conversations with Dr. Maya and all personal data are private and encrypted. We never sell your data to third parties. You can delete your account and all associated data at any time from Settings.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Go to Settings > Delete Account. This permanently removes your account, all conversations, exercise history, and personal data. This action cannot be undone.",
  },
  {
    question: "What exercises does Endura offer?",
    answer:
      "Endura offers 10 tiers of exercises including kegel and pelvic floor training, breathing techniques, somatic exercises, meditation, and partner exercises. New exercises unlock as you level up.",
  },
  {
    question: "How does the leveling system work?",
    answer:
      "Complete exercises to earn XP. As you accumulate XP, you level up through 100 levels across 10 tiers. Higher levels unlock more advanced exercises and earn you badges.",
  },
  {
    question: "Can I use Endura without a subscription?",
    answer:
      "Endura offers a free tier with limited access to exercises and Dr. Maya sessions. Pro and Premium plans unlock more features, exercises, and coaching sessions.",
  },
  {
    question: "Who can I contact for support?",
    answer:
      "Email us at endura288@gmail.com. We typically respond within 24\u201348 hours.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-white/[0.04] last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 px-1 text-left"
      >
        <span className="text-sm font-normal text-white/70 pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-white/30 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-5 px-1 text-sm font-light leading-relaxed text-white/40">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function HelpPage() {
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
            className="text-sm font-light text-white/50 transition-all duration-500 hover:text-white/60"
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
            <HelpCircle className="h-7 w-7 text-amber-300/40" />
          </div>
          <h1 className="text-3xl font-light tracking-wide text-white/80 sm:text-4xl">
            Help Center
          </h1>
          <p className="mt-4 text-base font-light text-white/40">
            Find answers to common questions about Endura.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="glass p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-5 w-5 text-amber-300/40" />
            <h2 className="text-base font-normal tracking-wide text-white/70">
              Frequently Asked Questions
            </h2>
          </div>

          <div>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 glass p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-5 w-5 text-amber-300/40" />
            <h2 className="text-base font-normal tracking-wide text-white/70">
              Still Need Help?
            </h2>
          </div>
          <p className="text-sm font-light leading-relaxed text-white/40 mb-6">
            Can&apos;t find what you&apos;re looking for? Reach out and we&apos;ll
            get back to you within 24&ndash;48 hours.
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

        <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-2 text-xs font-light text-white/40">
          <Shield className="h-3.5 w-3.5 text-amber-300/20" />
          <span>All communications are private &amp; confidential</span>
        </motion.div>
      </motion.main>
    </div>
  );
}
