"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Trash2 } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

const SECTIONS = [
  {
    title: "Privacy Policy",
    body: `Effective Date: March 9, 2026
Last Updated: March 9, 2026

Endura ("we," "us," or "our") operates the Endura application (the "App"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our App. By using Endura, you agree to the practices described in this policy.

Endura is a sexual wellness coaching application rated 17+. We take the sensitivity of this subject matter and your data extremely seriously.`,
  },
  {
    title: "1. Information We Collect",
    body: `A. Information You Provide Directly

\u2022 Account Information: Email address and display name when you register via email or Google sign-in.

\u2022 Onboarding Assessment: Age, relationship status, duration of concern, self-rated control and confidence levels (1\u201310 scale), impact on relationships, performance anxiety frequency, previous treatments tried, physical activity level, stress level, sleep quality, personal goals, and commitment level. This data is used solely to personalize your coaching experience.

\u2022 Chat Messages: Text messages you send to the AI coach (\u201cDr. Maya\u201d) during coaching sessions.

B. Information Collected Automatically

\u2022 Exercise Completion Data: Which exercises you complete and when, XP earned, and streak information.

\u2022 Progress Metrics: Control, confidence, and awareness scores tracked over time.

\u2022 Device Information: Device type and push notification token (only if you opt in to notifications).

\u2022 Usage Analytics: Anonymous, aggregated usage data collected via PostHog (e.g., feature usage frequency, session duration). We do not link analytics data to your identity.

C. Information We Do NOT Collect

\u2022 We do not access your device contacts, photos, camera, microphone, location, or health platform data (Apple HealthKit / Google Health Connect).
\u2022 We do not collect financial or payment card information \u2014 all purchases are processed entirely by Apple App Store, Google Play Store, or Stripe.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use the information we collect for the following purposes:

\u2022 To provide and personalize the coaching experience, including AI-generated responses from Dr. Maya.
\u2022 To track your exercise progress, streaks, levels, and badges.
\u2022 To send push notifications (daily reminders and motivational messages), only with your explicit consent.
\u2022 To process and manage your subscription through Apple App Store, Google Play Store, or Stripe.
\u2022 To improve the App through anonymous, aggregated analytics.
\u2022 To provide customer support when you contact us.
\u2022 To comply with legal obligations.

We do NOT use your data for advertising, profiling for third-party marketing, or any purpose unrelated to delivering the Endura service.`,
  },
  {
    title: "3. AI Coaching & Data Processing",
    body: `Endura uses Anthropic\u2019s Claude AI to power the Dr. Maya coaching experience. When you chat with Dr. Maya:

\u2022 Your messages and conversation history within the current session are sent to Anthropic\u2019s API via our secure server-side endpoint (not directly from your device).
\u2022 Anthropic processes messages solely to generate responses and does not use your data to train its models.
\u2022 Conversation data is stored on our servers to maintain session continuity and allow you to review past sessions.
\u2022 AI-generated responses are for educational and wellness purposes only and do not constitute medical advice.`,
  },
  {
    title: "4. Third-Party Services",
    body: `We use the following third-party service providers, each under their own privacy policies:

\u2022 Supabase (Database & Authentication): Stores your account data, profile, conversations, and exercise history. Data is encrypted in transit (TLS) and at rest. Row-level security ensures you can only access your own data. Supabase Privacy Policy: https://supabase.com/privacy

\u2022 Anthropic (AI Processing): Processes chat messages to generate coaching responses. Anthropic Privacy Policy: https://www.anthropic.com/privacy

\u2022 Stripe (Web Payments): Handles payment processing for the web application. Stripe Privacy Policy: https://stripe.com/privacy

\u2022 RevenueCat (Mobile Subscription Management): Manages subscription state and entitlements on mobile. RevenueCat receives your anonymous app user ID and purchase receipts \u2014 not your personal data. RevenueCat Privacy Policy: https://www.revenuecat.com/privacy

\u2022 PostHog (Analytics): Collects anonymous usage analytics. No personally identifiable information is shared. PostHog Privacy Policy: https://posthog.com/privacy

\u2022 Expo / EAS (Mobile App Infrastructure): Handles push notification delivery on mobile. Expo Privacy Policy: https://expo.dev/privacy

We do not sell, rent, or trade your personal information to any third party.`,
  },
  {
    title: "5. Data Storage & Security",
    body: `\u2022 All data transmitted between the App and our servers is encrypted using TLS (Transport Layer Security).
\u2022 Server-side data is stored in Supabase with encryption at rest and row-level security policies.
\u2022 Authentication tokens are stored securely on your device.
\u2022 API keys and secrets are stored server-side and are never embedded in the App.

While we implement industry-standard security measures, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your data using commercially reasonable measures.`,
  },
  {
    title: "6. Data Retention",
    body: `\u2022 Account and profile data is retained for as long as your account is active.
\u2022 Conversation history is retained to provide continuity across coaching sessions.
\u2022 Exercise and progress data is retained to maintain your streaks, levels, and historical progress.
\u2022 Anonymous analytics data may be retained indefinitely in aggregated form.

You may request deletion of your data at any time (see Section 8).`,
  },
  {
    title: "7. Subscriptions & Payments",
    body: `Endura offers optional paid subscriptions (Pro and Premium). On mobile, subscriptions are managed entirely through the Apple App Store or Google Play Store. On the web, payments are processed by Stripe. We do not collect, process, or store any payment card numbers or billing details. All payment processing, refunds, and subscription management are handled by the respective payment provider under their own terms and privacy policies.`,
  },
  {
    title: "8. Your Rights & Choices",
    body: `You have the following rights regarding your data:

\u2022 Access: You may request a copy of the personal data we hold about you.
\u2022 Correction: You may request correction of inaccurate personal data.
\u2022 Deletion: You may request complete deletion of your account and all associated data by contacting us at support@endura-app.com. We will process deletion requests within 30 days.
\u2022 Notifications: You may opt out of push notifications at any time through your device settings.
\u2022 Withdraw Consent: You may withdraw consent for data processing at any time by deleting your account.

For users in the European Economic Area (EEA), United Kingdom, or other jurisdictions with applicable data protection laws, you also have the right to data portability, the right to restrict processing, and the right to lodge a complaint with your local data protection authority.`,
  },
  {
    title: "9. Children\u2019s Privacy",
    body: `Endura is rated 17+ and is not intended for use by anyone under the age of 17. We do not knowingly collect personal information from individuals under 17. If we become aware that we have collected data from a person under 17, we will delete that information promptly. If you believe a minor has provided us with personal data, please contact us immediately at support@endura-app.com.`,
  },
  {
    title: "10. International Data Transfers",
    body: `Your data may be processed on servers located outside your country of residence. Supabase and Anthropic may process data in the United States. By using the App, you consent to the transfer of your data to these jurisdictions. We ensure that appropriate safeguards are in place in compliance with applicable data protection laws.`,
  },
  {
    title: "11. Changes to This Privacy Policy",
    body: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you through the App or by updating the \u201cLast Updated\u201d date above. Your continued use of the App after changes are posted constitutes your acceptance of the revised policy. We encourage you to review this policy periodically.`,
  },
  {
    title: "12. Contact Us",
    body: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:

Email: support@endura-app.com
Developer: Ariel Ohayon
App: Endura \u2014 Sexual Wellness Coach`,
  },
];

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
            className="text-sm font-light text-white/50 transition-all duration-500 hover:text-white/60"
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
        {/* Privacy Shield Banner */}
        <motion.div
          variants={fadeUp}
          className="glass p-7 sm:p-8"
          style={{ borderColor: "rgba(196,149,106,0.08)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-amber-300/40" />
            <h2 className="text-lg font-normal text-white/70">
              Privacy Shield
            </h2>
          </div>
          <p className="text-sm font-light leading-relaxed text-white/45">
            Your privacy is not just a policy &mdash; it&apos;s the foundation of
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
                desc: "Delete all your data anytime from Settings.",
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

        {/* Sections */}
        <div className="mt-10 space-y-8 text-sm font-light leading-relaxed text-white/45">
          {SECTIONS.map((section, i) => (
            <motion.section key={i} variants={fadeUp}>
              <h2
                className={
                  i === 0
                    ? "text-3xl font-light tracking-wide text-white/80 sm:text-4xl"
                    : "mb-3 text-base font-normal text-white/65"
                }
              >
                {section.title}
              </h2>
              {i === 0 && (
                <p className="mt-3 mb-4 text-sm font-light text-white/50">
                  Last updated: March 9, 2026
                </p>
              )}
              <p className="whitespace-pre-line">{section.body}</p>
            </motion.section>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
