import Link from "next/link";

export const metadata = {
  title: "Safety & Crisis Support | Endura",
  description:
    "Endura's crisis detection protocol and mental health support resources.",
};

const CRISIS_RESOURCES = [
  {
    label: "US: Call or text 988",
    sub: "Suicide & Crisis Lifeline — free, confidential, 24/7",
    url: "tel:988",
  },
  {
    label: "Worldwide: findahelpline.com",
    sub: "Crisis support in your country",
    url: "https://findahelpline.com",
  },
  {
    label: "Text HOME to 741741",
    sub: "Crisis Text Line",
    url: "sms:741741",
  },
];

const SECTIONS = [
  {
    title: "About Endura",
    body: `Endura is a sexual wellness coaching platform for men. Our AI coach, Coach Maya, provides evidence-based guidance on sexual health and confidence.\n\nEndura is not a mental health service and does not employ licensed therapists or crisis counselors.\n\nWe recognize that the challenges our users navigate — performance anxiety, relationship stress, shame — can sometimes intersect with deeper emotional pain. We take that seriously.`,
  },
  {
    title: "Our Crisis Protocol",
    body: `When Coach Maya detects language that may indicate suicidal ideation or self-harm, the following happens automatically:\n\n1. The AI is bypassed entirely. Coach Maya does not generate a response to the message.\n\n2. A hardcoded safe-messaging response is delivered immediately — not written by AI, not subject to variation — directing you to professional crisis services.\n\n3. An anonymous event is logged (date and signal category only — no message content, no user identity) to verify the protocol is operating correctly.\n\nThis detection and response happens at the server level, before any AI processing occurs. It cannot be overridden by conversation context or user instructions.`,
  },
  {
    title: "What We Detect",
    body: `Our system monitors each message for language associated with suicidal ideation and self-harm — including direct expressions of intent, hopelessness framing, and crisis language patterns.\n\nWe do not monitor for general emotional distress. Men talking about feeling frustrated, ashamed, or discouraged about their sexual health are having a normal and important conversation — not a crisis.`,
  },
  {
    title: "What We Don't Do",
    body: `• We do not reach out to users directly after a crisis detection\n• We do not store message content from crisis interactions\n• We do not employ crisis counselors or licensed professionals\n\nThese limitations are intentional. Endura is a wellness platform, not a clinical service. Our role is to ensure users are immediately directed to professionals who are qualified to help.`,
  },
  {
    title: "Logging & Privacy",
    body: `When a crisis signal is detected, we log:\n• The date of detection\n• The category of signal (suicidal ideation or self-harm)\n• Whether the response was successfully delivered\n\nWe do not log your identity, your message, or any information that could identify you. These records are retained for 3 years for safety monitoring purposes and are never shared with third parties.`,
  },
  {
    title: "Compliance",
    body: `This protocol is maintained in compliance with California SB 243 (Companion Chatbot Law, effective January 1, 2026) and New York Assembly Bill A6767 (AI Companion Safeguards Act, effective November 5, 2025).`,
  },
  {
    title: "Contact",
    body: `Questions about this protocol: support@endura.company`,
  },
];

export default function SafetyPage() {
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
          {/* Title */}
          <section>
            <h1 className="text-3xl font-light tracking-wide text-white/80 sm:text-4xl">
              Safety & Crisis Support
            </h1>
            <p className="mt-4 text-sm font-light text-white/40">
              Last updated: March 26, 2026
            </p>
          </section>

          {/* Crisis resources — visually distinct */}
          <section className="rounded-xl border border-amber-200/10 bg-amber-200/5 p-6">
            <h2 className="mb-4 text-base font-normal tracking-wide text-white/70">
              If you&apos;re in crisis right now
            </h2>
            <div className="space-y-4">
              {CRISIS_RESOURCES.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  className="block transition-opacity hover:opacity-80"
                >
                  <p className="text-sm font-normal text-amber-200/70">
                    {r.label}
                  </p>
                  <p className="text-xs font-light text-white/40">{r.sub}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Protocol sections */}
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <h2 className="mb-3 text-lg font-normal tracking-wide text-white/70">
                {section.title}
              </h2>
              <p className="whitespace-pre-line">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
