"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, CreditCard, Shield, Trash2, LogOut, Bell, Info, Star, Trophy, BellRing } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { fadeUpIndexed, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { APP_VERSION } from "@/lib/constants";
import { registerPushNotifications, unregisterPushNotifications } from "@/lib/push-notifications";

interface ProfileData {
  display_name: string;
  tier: string;
  email: string;
  leaderboardOptIn?: boolean;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  // Load reminder prefs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("endura_reminders");
      if (stored) {
        const data = JSON.parse(stored);
        setRemindersEnabled(data.enabled ?? true);
        setReminderTime(data.time ?? "09:00");
      }
    } catch {
      // Use defaults
    }
  }, []);

  const updateReminders = (enabled: boolean, time: string) => {
    setRemindersEnabled(enabled);
    setReminderTime(time);
    localStorage.setItem("endura_reminders", JSON.stringify({ enabled, time }));
    trackEvent("settings_changed", { setting: "reminders", enabled, time });
  };

  function getSupabase() {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }

  const loadSettings = () => {
    setLoading(true);
    setError(null);
    async function load() {
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("display_name, tier")
        .eq("id", user.id)
        .maybeSingle();

      // Get leaderboard opt-in
      const { data: gam } = await supabase
        .from("user_gamification")
        .select("leaderboard_opt_in")
        .eq("user_id", user.id)
        .maybeSingle();

      setProfile({
        display_name: data?.display_name ?? user.email?.split("@")[0] ?? "User",
        tier: data?.tier ?? "free",
        email: user.email ?? "",
        leaderboardOptIn: gam?.leaderboard_opt_in ?? false,
      });
    }
    load()
      .catch((err) => setError(err.message || "Failed to load settings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleLogout = async () => {
    await getSupabase().auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure? This will permanently delete all your data including conversations, scores, and progress. This cannot be undone."
      )
    )
      return;

    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        await getSupabase().auth.signOut();
        router.push("/");
      } else {
        setDeleting(false);
        alert("Failed to delete account. Please try again.");
      }
    } catch {
      setDeleting(false);
      alert("Network error. Please check your connection and try again.");
    }
  };

  const tierLabel =
    profile?.tier === "premium"
      ? "Premium"
      : profile?.tier === "pro"
        ? "Pro"
        : "Free";

  return (
    <div className="relative min-h-screen font-sans text-white pb-28">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4 sm:px-8">
          <h1 className="text-xl font-light tracking-wide text-white/80">
            Settings
          </h1>
        </div>
      </header>

      <motion.main
        key={loading ? "loading" : "loaded"}
        className="mx-auto max-w-2xl px-5 py-8 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="glass h-24 animate-pulse"
                style={{ opacity: 0.3 }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-light text-red-400/60">{error}</p>
            <button
              onClick={loadSettings}
              className="mt-4 rounded-full px-5 py-2.5 text-sm font-normal text-amber-200/70 transition-all duration-500 hover:text-amber-200/90"
              style={{
                background: "rgba(196,149,106,0.1)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Profile Section */}
            <motion.section custom={0} variants={fadeUpIndexed} className="glass p-7 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <User className="h-5 w-5 text-amber-300/40" />
                <h2 className="text-base font-normal tracking-wide text-white/70">
                  Profile
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-white/45">Name</span>
                  <span className="text-sm font-light text-white/60">
                    {profile?.display_name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-white/45">Email</span>
                  <span className="text-sm font-light text-white/60">
                    {profile?.email}
                  </span>
                </div>
              </div>
            </motion.section>

            {/* Subscription Section */}
            <motion.section
              custom={1}
              variants={fadeUpIndexed}
              className="glass mt-5 p-7 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <CreditCard className="h-5 w-5 text-amber-300/40" />
                <h2 className="text-base font-normal tracking-wide text-white/70">
                  Subscription
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-white/45">
                    Current Plan
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-normal"
                    style={{
                      background:
                        profile?.tier !== "free"
                          ? "rgba(196,149,106,0.08)"
                          : "rgba(255,255,255,0.04)",
                      color:
                        profile?.tier !== "free"
                          ? "rgba(212,180,140,0.7)"
                          : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {tierLabel}
                  </span>
                </div>
              </div>
              {/* Manage Subscription button — hidden until Stripe/App Store billing is enabled */}
            </motion.section>

            {/* Reminders Section */}
            <motion.section
              custom={2}
              variants={fadeUpIndexed}
              className="glass mt-5 p-7 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <Bell className="h-5 w-5 text-amber-300/40" />
                <h2 className="text-base font-normal tracking-wide text-white/70">
                  Reminders
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-white/45">
                    Daily practice reminder
                  </span>
                  <button
                    onClick={() => updateReminders(!remindersEnabled, reminderTime)}
                    className="relative h-8 w-14 rounded-full transition-all duration-300"
                    style={{
                      background: remindersEnabled
                        ? "rgba(196,149,106,0.25)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="absolute top-0.5 h-7 w-7 rounded-full transition-all duration-300"
                      style={{
                        left: remindersEnabled ? "calc(100% - 30px)" : "2px",
                        background: remindersEnabled
                          ? "rgba(212,180,140,0.8)"
                          : "rgba(255,255,255,0.25)",
                      }}
                    />
                  </button>
                </div>
                {remindersEnabled && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-white/45">
                      Reminder time
                    </span>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => updateReminders(remindersEnabled, e.target.value)}
                      className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm font-light text-white/60 outline-none border border-white/[0.04] focus:border-amber-300/20 transition-all"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                )}
              </div>
            </motion.section>

            {/* Push Notifications Section */}
            <motion.section
              custom={2.5}
              variants={fadeUpIndexed}
              className="glass mt-5 p-7 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <BellRing className="h-5 w-5 text-amber-300/40" />
                <h2 className="text-base font-normal tracking-wide text-white/70">
                  Push Notifications
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-light text-white/45">
                      Enable push notifications
                    </span>
                    <p className="text-xs font-light text-white/40 mt-0.5">
                      Get reminders and session updates
                    </p>
                  </div>
                  <button
                    disabled={pushLoading}
                    onClick={async () => {
                      setPushLoading(true);
                      try {
                        const supabase = getSupabase();
                        const { data: { user } } = await supabase.auth.getUser();
                        if (!user) return;

                        if (!pushEnabled) {
                          const success = await registerPushNotifications(user.id);
                          if (success) {
                            setPushEnabled(true);
                            trackEvent("settings_changed", { setting: "push_notifications", value: true });
                          }
                        } else {
                          await unregisterPushNotifications(user.id);
                          setPushEnabled(false);
                          trackEvent("settings_changed", { setting: "push_notifications", value: false });
                        }
                      } catch { /* ignore */ }
                      finally { setPushLoading(false); }
                    }}
                    className="relative h-8 w-14 rounded-full transition-all duration-300 disabled:opacity-50"
                    style={{
                      background: pushEnabled
                        ? "rgba(196,149,106,0.25)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="absolute top-0.5 h-7 w-7 rounded-full transition-all duration-300"
                      style={{
                        left: pushEnabled ? "calc(100% - 30px)" : "2px",
                        background: pushEnabled
                          ? "rgba(212,180,140,0.8)"
                          : "rgba(255,255,255,0.25)",
                      }}
                    />
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Leaderboard Section */}
            <motion.section
              custom={3}
              variants={fadeUpIndexed}
              className="glass mt-5 p-7 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <Trophy className="h-5 w-5 text-amber-300/40" />
                <h2 className="text-base font-normal tracking-wide text-white/70">
                  Leaderboard
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-light text-white/45">
                      Show me on leaderboard
                    </span>
                    <p className="text-xs font-light text-white/40 mt-0.5">
                      Only your name, level, streak, and XP are shown
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      const newVal = !profile?.leaderboardOptIn;
                      setProfile((prev) => prev ? { ...prev, leaderboardOptIn: newVal } : prev);
                      try {
                        const supabase = getSupabase();
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                          await supabase
                            .from("user_gamification")
                            .upsert(
                              { user_id: user.id, leaderboard_opt_in: newVal },
                              { onConflict: "user_id" }
                            );
                        }
                      } catch { /* ignore */ }
                    }}
                    className="relative h-8 w-14 rounded-full transition-all duration-300"
                    style={{
                      background: profile?.leaderboardOptIn
                        ? "rgba(196,149,106,0.25)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="absolute top-0.5 h-7 w-7 rounded-full transition-all duration-300"
                      style={{
                        left: profile?.leaderboardOptIn ? "calc(100% - 30px)" : "2px",
                        background: profile?.leaderboardOptIn
                          ? "rgba(212,180,140,0.8)"
                          : "rgba(255,255,255,0.25)",
                      }}
                    />
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Privacy Section */}
            <motion.section
              custom={4}
              variants={fadeUpIndexed}
              className="glass mt-5 p-7 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <Shield className="h-5 w-5 text-amber-300/40" />
                <h2 className="text-base font-normal tracking-wide text-white/70">
                  Privacy
                </h2>
              </div>
              <div className="space-y-3">
                <a
                  href="/privacy"
                  className="block text-sm font-light text-amber-200/50 transition-all duration-500 hover:text-amber-200/70"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="block text-sm font-light text-amber-200/50 transition-all duration-500 hover:text-amber-200/70"
                >
                  Terms of Service
                </a>
              </div>
            </motion.section>

            {/* About Section */}
            <motion.section
              custom={5}
              variants={fadeUpIndexed}
              className="glass mt-5 p-7 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <Info className="h-5 w-5 text-amber-300/40" />
                <h2 className="text-base font-normal tracking-wide text-white/70">
                  About
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-white/45">Version</span>
                  <span className="text-sm font-light text-white/50">Endura v{APP_VERSION}</span>
                </div>
                <button
                  onClick={() => {
                    // Placeholder: In production, this opens the App Store review
                    window.open("https://endura.app", "_blank");
                  }}
                  className="flex w-full items-center gap-2 text-sm font-light text-amber-200/50 transition-all duration-500 hover:text-amber-200/70"
                >
                  <Star className="h-4 w-4" />
                  Rate Endura
                </button>
              </div>
            </motion.section>

            {/* Actions */}
            <motion.section custom={6} variants={fadeUpIndexed} className="mt-8 space-y-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-normal text-white/40 transition-all duration-500 hover:text-white/60"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-normal text-red-400/40 transition-all duration-500 hover:text-red-400/60 disabled:opacity-50"
                style={{
                  background: "rgba(239,68,68,0.03)",
                  border: "1px solid rgba(239,68,68,0.06)",
                }}
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete My Account & Data"}
              </button>
            </motion.section>
          </>
        )}
      </motion.main>

      <BottomNav activeTab="Profile" />
    </div>
  );
}
