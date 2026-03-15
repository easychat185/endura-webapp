import Link from "next/link";

const SECTIONS = [
  {
    title: "Terms of Service",
    body: `By using Endura, you agree to the following terms. Please read them carefully before creating an account or using the service.`,
  },
  {
    title: "1. Age Requirement",
    body: `Endura is intended for adults aged 18 and older. By creating an account, you confirm that you are at least 18 years of age. We do not knowingly collect data from anyone under 18.`,
  },
  {
    title: "2. Not Medical Advice",
    body: `Endura provides AI-powered wellness coaching, not medical advice, diagnosis, or treatment. Dr. Maya is an artificial intelligence coach — not a licensed medical professional. If you experience physical symptoms, pain, or believe you have a medical condition, please consult a qualified healthcare provider.`,
  },
  {
    title: "3. Subscription & Billing",
    body: `Subscriptions are billed through the Apple App Store or Google Play Store. Payment will be charged to your Apple ID or Google account at confirmation of purchase. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period. You can manage and cancel your subscriptions through your App Store or Google Play account settings. Upon cancellation, you retain access until the end of your current billing period. Prices may vary by region.`,
  },
  {
    title: "4. Acceptable Use",
    body: `You agree not to misuse the service, including attempting to extract harmful content from the AI, sharing your account credentials, or using the platform for any illegal purpose.`,
  },
  {
    title: "5. User-Generated Content",
    body: `Endura allows users to set a public alias for the leaderboard. You agree not to use offensive, abusive, discriminatory, or objectionable language in your alias. We reserve the right to remove or reset any alias that violates this policy and to ban users who repeatedly violate these terms. There is no tolerance for objectionable content or abusive users.`,
  },
  {
    title: "6. Data & Privacy",
    body: `Your data is handled in accordance with our Privacy Policy. You may delete your account and all associated data at any time from Settings.`,
  },
  {
    title: "7. End User License Agreement",
    body: `Use of the Endura app is subject to Apple's standard Licensed Application End User License Agreement (EULA), available at apple.com/legal/internet-services/itunes/dev/stdeula.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `Endura is provided "as is" without warranty. We are not liable for any outcomes resulting from following coaching guidance. Use the service at your own discretion and in combination with professional medical advice where appropriate.`,
  },
  {
    title: "9. Changes to Terms",
    body: `We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.`,
  },
  {
    title: "10. Contact Us",
    body: `If you have any questions about these Terms of Service, please contact us at support@endura-app.com.`,
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm font-light text-amber-200/60 transition-all duration-500 hover:text-amber-200/80"
        >
          &larr; Back to homepage
        </Link>

        <div className="mt-10 space-y-10 text-sm font-light leading-relaxed text-white/50">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <h2
                className={
                  i === 0
                    ? "text-3xl font-light tracking-wide text-white/80 sm:text-4xl"
                    : "mb-3 text-lg font-normal tracking-wide text-white/70"
                }
              >
                {section.title}
              </h2>
              {i === 0 && (
                <p className="mt-4 text-sm font-light text-white/40">
                  Last updated: March 2026
                </p>
              )}
              <p className="mt-3 whitespace-pre-line">
                {section.title === "6. Data & Privacy" ? (
                  <>
                    Your data is handled in accordance with our{" "}
                    <Link
                      href="/privacy"
                      className="text-amber-200/50 underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                    . You may delete your account and all associated data at any
                    time from Settings.
                  </>
                ) : section.title === "7. End User License Agreement" ? (
                  <>
                    Use of the Endura app is subject to Apple&apos;s standard
                    Licensed Application End User License Agreement (EULA),
                    available at{" "}
                    <a
                      href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-200/50 underline underline-offset-2"
                    >
                      apple.com/legal/internet-services/itunes/dev/stdeula
                    </a>
                    .
                  </>
                ) : section.title === "10. Contact Us" ? (
                  <>
                    If you have any questions about these Terms of Service,
                    please contact us at{" "}
                    <a
                      href="mailto:support@endura-app.com"
                      className="text-amber-200/50 underline underline-offset-2"
                    >
                      support@endura-app.com
                    </a>
                    .
                  </>
                ) : (
                  section.body
                )}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
