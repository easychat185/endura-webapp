import Link from "next/link";

export default function PrivacyLandingPolicy() {
  return (
    <div className="min-h-screen px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm font-light text-amber-200/60 transition-all duration-500 hover:text-amber-200/80"
        >
          &larr; Back to homepage
        </Link>

        <h1 className="mt-8 text-3xl font-light tracking-wide text-white/80 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm font-light text-white/40">
          Last updated: March 11, 2026
        </p>

        <div className="mt-12 space-y-10 text-sm font-light leading-relaxed text-white/50">
          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              1. Information We Collect
            </h2>
            <p>
              When you sign up for early access, we collect your{" "}
              <strong className="text-white/60">email address</strong> and your
              marketing consent preference. We do not collect any other personal
              information at this stage.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              2. How We Use Your Information
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>To notify you when Endura launches or early access becomes available.</li>
              <li>
                To send promotional and marketing communications, but{" "}
                <strong className="text-white/60">only if you have explicitly opted in</strong>{" "}
                by checking the marketing consent checkbox.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              3. Data Storage &amp; Security
            </h2>
            <p>
              Your data is securely stored on Supabase infrastructure with
              encryption at rest and in transit. We use row-level security
              policies to restrict access to your data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              4. Marketing Communications
            </h2>
            <p>
              You will only receive marketing emails if you have given explicit
              consent. Every marketing email includes an unsubscribe link. You
              can opt out at any time by clicking the unsubscribe link or
              visiting our{" "}
              <Link href="/unsubscribe" className="text-amber-200/60 underline underline-offset-2 hover:text-amber-200/80">
                unsubscribe page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              5. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="mt-2 list-inside list-disc space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data at any time.</li>
              <li>Withdraw your marketing consent at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              6. Data Sharing
            </h2>
            <p>
              We do <strong className="text-white/60">not</strong> sell, rent, or
              share your personal information with third parties for their
              marketing purposes. We may share data with service providers
              (e.g., our hosting provider) solely to operate the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              7. Cookies
            </h2>
            <p>
              Our landing page does not use tracking cookies or third-party
              analytics at this time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              9. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to
              exercise your data rights, please contact us at{" "}
              <a
                href="mailto:support@endura-app.com"
                className="text-amber-200/60 underline underline-offset-2 hover:text-amber-200/80"
              >
                support@endura-app.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
