"use client";

import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  const answerId = useId();

  return (
    <div className="border-b border-white/[0.03] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left text-base font-normal tracking-wide text-white/60 transition-all duration-500 hover:text-amber-200/60 sm:text-lg"
        aria-expanded={open}
        aria-controls={answerId}
      >
        <span>{question}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 text-amber-300/30 transition-transform duration-500 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={answerId}
        className={`grid transition-all duration-500 ease-in-out ${
          open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-light leading-relaxed text-white/60">{answer}</p>
        </div>
      </div>
    </div>
  );
}
