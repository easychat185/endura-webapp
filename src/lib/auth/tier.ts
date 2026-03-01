import { createClient } from "@/lib/supabase/server";

export async function getUserTier(
  userId: string
): Promise<"free" | "pro" | "premium"> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .maybeSingle();

  return (data?.tier as "free" | "pro" | "premium") ?? "free";
}

export async function canStartSession(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .maybeSingle();

  const tier = profile?.tier ?? "free";

  if (tier === "free") return false;
  if (tier === "premium") return true;

  // Pro: 2 sessions per day
  const today = new Date().toISOString().split("T")[0];

  const { count } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("started_at", `${today}T00:00:00`)
    .lte("started_at", `${today}T23:59:59`);

  return (count ?? 0) < 2;
}

export function getMessageLimit(
  tier: "free" | "pro" | "premium"
): number {
  switch (tier) {
    case "premium":
      return 60;
    case "pro":
      return 30;
    default:
      return 0;
  }
}
