"use client";

import { AlertCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 font-sans text-white">
      <div className="text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "rgba(239,68,68,0.06)" }}
        >
          <AlertCircle className="h-8 w-8 text-red-400/50" />
        </div>

        <h1 className="text-2xl font-light tracking-wide text-white/80">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-sm text-sm font-light text-white/35">
          An unexpected error occurred. Please try again or contact support if
          the issue persists.
        </p>

        <button
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)]"
          style={{
            background: "rgba(196,149,106,0.1)",
            border: "1px solid rgba(196,149,106,0.15)",
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
