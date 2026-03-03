"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MessageCircle, Heart, Crown, BookOpen } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { getGuideBySlug } from "@/lib/relationships/guides";
import { fadeUp } from "@/lib/animations";

export default function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const guide = getGuideBySlug(slug);

  // Mark guide as read on visit
  useEffect(() => {
    if (!guide) return;
    try {
      const stored = localStorage.getItem("endura_read_guides");
      const readSet: string[] = stored ? JSON.parse(stored) : [];
      if (!readSet.includes(slug)) {
        readSet.push(slug);
        localStorage.setItem("endura_read_guides", JSON.stringify(readSet));
      }
    } catch {
      // Ignore
    }
  }, [slug, guide]);

  if (!guide) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans text-white">
        <div className="text-center">
          <p className="text-sm font-light text-white/40">Guide not found</p>
          <button
            onClick={() => router.push("/relationships")}
            className="mt-4 text-sm font-light text-amber-200/50 hover:text-amber-200/70"
          >
            Back to Relationships
          </button>
        </div>
      </div>
    );
  }

  const categoryIcon = () => {
    switch (guide.category) {
      case "communication":
        return <MessageCircle className="h-5 w-5 text-amber-300/40" />;
      case "intimacy":
        return <Heart className="h-5 w-5 text-amber-300/40" />;
      case "confidence":
        return <Crown className="h-5 w-5 text-amber-300/40" />;
      default:
        return <BookOpen className="h-5 w-5 text-amber-300/40" />;
    }
  };

  // Simple markdown-to-JSX renderer for guide content
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // H2
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={i}
            className="mt-8 mb-3 text-lg font-normal tracking-wide text-white/75"
          >
            {line.slice(3)}
          </h2>
        );
        i++;
        continue;
      }

      // H3
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={i}
            className="mt-6 mb-2 text-base font-normal tracking-wide text-white/65"
          >
            {line.slice(4)}
          </h3>
        );
        i++;
        continue;
      }

      // Bullet list items
      if (line.startsWith("- ")) {
        const items: string[] = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          items.push(lines[i].slice(2));
          i++;
        }
        elements.push(
          <ul key={`ul-${i}`} className="mt-2 mb-3 space-y-2 pl-1">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-sm font-light leading-relaxed text-white/45">
                <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-amber-300/30" />
                <span>{renderInlineFormatting(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Numbered list items
      if (/^\d+\.\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s/, ""));
          i++;
        }
        elements.push(
          <ol key={`ol-${i}`} className="mt-2 mb-3 space-y-2 pl-1">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-sm font-light leading-relaxed text-white/45">
                <span className="mt-0.5 shrink-0 text-xs font-normal text-amber-300/35">
                  {j + 1}.
                </span>
                <span>{renderInlineFormatting(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Empty line
      if (line.trim() === "") {
        i++;
        continue;
      }

      // Paragraph
      elements.push(
        <p
          key={i}
          className="mt-2 text-sm font-light leading-relaxed text-white/45"
        >
          {renderInlineFormatting(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Handle **bold** patterns
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={i} className="font-normal text-white/60">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative min-h-screen font-sans text-white pb-24">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/relationships")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/40 transition-all duration-350 hover:bg-white/[0.03]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-normal tracking-wide text-white/80">
                {guide.title}
              </h1>
              <p className="text-xs font-light text-white/50 capitalize">
                {guide.category}
              </p>
            </div>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/[0.06]">
            {categoryIcon()}
          </div>
        </div>
      </header>

      <motion.main
        className="mx-auto max-w-2xl px-5 py-6 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {/* Title card */}
        <div className="glass p-7">
          <h2 className="text-xl font-light tracking-wide text-white/80">
            {guide.title}
          </h2>
          <p className="mt-2 text-sm font-light text-white/40">
            {guide.subtitle}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-light text-white/50">
            <Clock className="h-3.5 w-3.5" />
            {guide.readTime}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 glass p-7">
          {renderContent(guide.content)}
        </div>
      </motion.main>

      <BottomNav activeTab="Home" />
    </div>
  );
}
