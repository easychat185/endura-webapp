"use client";

import Link from "next/link";
import { Home, Dumbbell, MessageCircle, BarChart3, User } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Practice", icon: Dumbbell, href: "/exercises" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
  { label: "Progress", icon: BarChart3, href: "/progress" },
  { label: "Profile", icon: User, href: "/settings" },
] as const;

type TabLabel = (typeof tabs)[number]["label"];

export default function BottomNav({
  activeTab,
}: {
  activeTab: TabLabel;
}) {
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 z-50 w-full border-t border-white/[0.03] backdrop-blur-2xl"
      style={{ background: "rgba(8,8,8,0.6)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-2.5">
        {tabs.map(({ label, icon: Icon, href }) => {
          const active = label === activeTab;
          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 min-h-[44px] min-w-[44px] transition-all duration-500 active:scale-95 ${
                active
                  ? "text-amber-300/60 bg-amber-300/[0.06]"
                  : "text-white/50 hover:text-white/65"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${active ? "text-amber-300/60" : ""}`}
                strokeWidth={active ? 2 : 1.5}
              />
              <span className="text-[11px] font-light">{label}</span>
              {active && (
                <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-amber-300/60" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
