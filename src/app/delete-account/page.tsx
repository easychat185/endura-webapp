import Link from "next/link";

export default function DeleteAccount() {
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
          Delete Your Endura Account
        </h1>

        <div className="mt-12 space-y-10 text-sm font-light leading-relaxed text-white/50">
          <section>
            <p>
              If you&apos;d like to delete your Endura account and all associated
              data, please send us an email using the link below.
            </p>

            <a
              href="mailto:easychat185@gmail.com?subject=Delete%20My%20Account"
              className="mt-6 inline-block rounded-full px-7 py-4 text-sm font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)]"
              style={{
                background: "rgba(196,149,106,0.1)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              Request Account Deletion
            </a>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              What gets deleted
            </h2>
            <p className="mb-3">
              When we process your request, the following data will be
              permanently removed:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Profile and personal information</li>
              <li>Chat conversations and messages</li>
              <li>Exercise completion history</li>
              <li>Daily scores and progress data</li>
              <li>Gamification data (XP, levels, streaks, badges)</li>
              <li>Device tokens and notification preferences</li>
              <li>Onboarding responses</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              Timeline
            </h2>
            <p>We will process your request within 14 days.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
              Data retention
            </h2>
            <p>
              We may retain anonymized, aggregated data that cannot be used to
              identify you, as required by law.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
