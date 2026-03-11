"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

const SUPABASE_URL = "https://eqnnanygxucdbazyqtrs.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbm5hbnlneHVjZGJhenlxdHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjQ0MTIsImV4cCI6MjA4ODgwMDQxMn0.oapQSkpooBPhqjg9NaaPgiWKMIZZcNG03LWrjchDFVE";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!email) {
      setErrorMsg("No email address provided.");
      setStatus("error");
    }
  }, [email]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/early_access_signups?email=eq.${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ unsubscribed: true, allows_marketing: false }),
        }
      );
      if (!res.ok) {
        setErrorMsg("Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-md text-center">
      {status === "success" ? (
        <>
          <CheckCircle className="mx-auto h-12 w-12 text-amber-300/60" />
          <h1 className="mt-6 text-2xl font-light tracking-wide text-white/80">
            You&apos;ve been unsubscribed
          </h1>
          <p className="mt-4 font-light text-white/40">
            You will no longer receive marketing emails from Endura.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-sm font-light text-amber-200/60 transition-all duration-500 hover:text-amber-200/80"
          >
            Back to homepage
          </Link>
        </>
      ) : status === "error" ? (
        <>
          <XCircle className="mx-auto h-12 w-12 text-red-400/60" />
          <h1 className="mt-6 text-2xl font-light tracking-wide text-white/80">
            Oops
          </h1>
          <p className="mt-4 font-light text-white/40">{errorMsg}</p>
          <Link
            href="/"
            className="mt-8 inline-block text-sm font-light text-amber-200/60 transition-all duration-500 hover:text-amber-200/80"
          >
            Back to homepage
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-light tracking-wide text-white/80">
            Unsubscribe
          </h1>
          <p className="mt-4 font-light text-white/40">
            Are you sure you want to unsubscribe{" "}
            <span className="text-white/60">{email}</span> from Endura
            marketing emails?
          </p>
          <button
            onClick={handleUnsubscribe}
            disabled={status === "loading"}
            className="mt-8 rounded-full px-8 py-3 text-sm font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)] disabled:opacity-40"
            style={{
              background: "rgba(196,149,106,0.1)",
              border: "1px solid rgba(196,149,106,0.15)",
            }}
          >
            {status === "loading" ? "Processing..." : "Yes, unsubscribe me"}
          </button>
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <Suspense
        fallback={
          <p className="text-sm font-light text-white/40">Loading...</p>
        }
      >
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
