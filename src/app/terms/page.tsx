"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function TermsPage() {
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
        <motion.h1
          variants={fadeUp}
          className="text-3xl font-light tracking-wide text-white/80 sm:text-4xl"
        >
          Terms of Service
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-3 text-sm font-light text-white/50"
        >
          Last updated: March 2026
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 space-y-8 text-sm font-light leading-relaxed text-white/45"
        >
          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              1. Age Requirement
            </h2>
            <p>
              Endura is intended for adults aged 18 and older. By creating an
              account, you confirm that you are at least 18 years of age. We do
              not knowingly collect data from anyone under 18.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              2. Not Medical Advice
            </h2>
            <p>
              Endura provides AI-powered wellness coaching, not medical advice,
              diagnosis, or treatment. Dr. Maya is an artificial intelligence
              coach — not a licensed medical professional. If you experience
              physical symptoms, pain, or believe you have a medical condition,
              please consult a qualified healthcare provider.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              3. Subscription & Billing
            </h2>
            <p>
              Subscriptions are billed through the Apple App Store or Google Play
              Store. Payment will be charged to your Apple ID or Google account
              at confirmation of purchase. Subscriptions automatically renew
              unless canceled at least 24 hours before the end of the current
              period. You can manage and cancel your subscriptions through your
              App Store or Google Play account settings. Upon cancellation, you
              retain access until the end of your current billing period. Prices
              may vary by region.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              4. Acceptable Use
            </h2>
            <p>
              You agree not to misuse the service, including attempting to
              extract harmful content from the AI, sharing your account
              credentials, or using the platform for any illegal purpose.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              5. User-Generated Content
            </h2>
            <p>
              Endura allows users to set a public alias for the leaderboard.
              You agree not to use offensive, abusive, discriminatory, or
              objectionable language in your alias. We reserve the right to
              remove or reset any alias that violates this policy and to ban
              users who repeatedly violate these terms. There is no tolerance
              for objectionable content or abusive users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              6. Data & Privacy
            </h2>
            <p>
              Your data is handled in accordance with our{" "}
              <Link
                href="/privacy"
                className="text-amber-200/50 underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              . You may delete your account and all associated data at any time
              from Settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              7. End User License Agreement
            </h2>
            <p>
              Use of the Endura app is subject to Apple&apos;s standard Licensed
              Application End User License Agreement (EULA), available at{" "}
              <a
                href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-200/50 underline underline-offset-2"
              >
                apple.com/legal/internet-services/itunes/dev/stdeula
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              8. Limitation of Liability
            </h2>
            <p>
              Endura is provided &quot;as is&quot; without warranty. We are not
              liable for any outcomes resulting from following coaching guidance.
              Use the service at your own discretion and in combination with
              professional medical advice where appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              9. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of the
              service after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal text-white/65">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <a
                href="mailto:support@endura-app.com"
                className="text-amber-200/50 underline underline-offset-2"
              >
                support@endura-app.com
              </a>
              .
            </p>
          </section>
        </motion.div>
      </motion.main>
    </div>
  );
}
