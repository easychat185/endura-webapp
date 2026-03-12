"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

function ConfirmedContent() {
  const params = useSearchParams();
  const status = params.get("status");

  const config: Record<string, { icon: React.ReactNode; title: string; message: string }> = {
    success: {
      icon: <CheckCircle className="mx-auto h-12 w-12 text-amber-300/60" />,
      title: "You're confirmed!",
      message: "Your program guide is on its way. Check your inbox for the PDF.",
    },
    already: {
      icon: <CheckCircle className="mx-auto h-12 w-12 text-amber-300/60" />,
      title: "Already confirmed",
      message: "Your email was already confirmed. Check your inbox for the program guide.",
    },
    expired: {
      icon: <Clock className="mx-auto h-12 w-12 text-white/40" />,
      title: "Link expired",
      message: "This confirmation link has expired. Please sign up again to get a new one.",
    },
    invalid: {
      icon: <XCircle className="mx-auto h-12 w-12 text-red-400/60" />,
      title: "Invalid link",
      message: "This confirmation link is invalid. Please sign up again.",
    },
    error: {
      icon: <AlertCircle className="mx-auto h-12 w-12 text-red-400/60" />,
      title: "Something went wrong",
      message: "We couldn't confirm your email. Please try again or sign up again.",
    },
  };

  const { icon, title, message } = config[status || ""] || config.invalid;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="mx-auto max-w-md text-center">
        {icon}
        <h1 className="mt-6 text-2xl font-light tracking-tight text-white/90">
          {title}
        </h1>
        <p className="mt-4 text-base font-light leading-relaxed text-white/50">
          {message}
        </p>
        <a
          href="/"
          className="mt-8 inline-block text-sm font-light text-amber-300/60 underline underline-offset-4 hover:text-amber-300/80"
        >
          Back to Endura
        </a>
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]" />}>
      <ConfirmedContent />
    </Suspense>
  );
}
