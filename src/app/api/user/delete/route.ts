import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cancel Stripe subscription if exists
    if (user.email) {
      try {
        const customers = await getStripe().customers.list({
          email: user.email,
          limit: 1,
        });
        if (customers.data.length > 0) {
          const subscriptions = await getStripe().subscriptions.list({
            customer: customers.data[0].id,
            status: "active",
          });
          for (const sub of subscriptions.data) {
            await getStripe().subscriptions.cancel(sub.id);
          }
        }
      } catch {
        // Stripe may not be configured — continue with deletion
      }
    }

    // Delete all user data in parallel (no FK ordering needed — all keyed by user_id)
    await Promise.all([
      supabase.from("messages").delete().eq("user_id", user.id),
      supabase.from("daily_scores").delete().eq("user_id", user.id),
      supabase.from("milestones").delete().eq("user_id", user.id),
      supabase.from("onboarding_responses").delete().eq("user_id", user.id),
      supabase.from("xp_transactions").delete().eq("user_id", user.id),
      supabase.from("user_badges").delete().eq("user_id", user.id),
      supabase.from("daily_activity").delete().eq("user_id", user.id),
      supabase.from("daily_challenges").delete().eq("user_id", user.id),
      supabase.from("exercise_completions").delete().eq("user_id", user.id),
    ]);

    // Delete conversations after messages are gone
    await supabase.from("conversations").delete().eq("user_id", user.id);

    // Delete gamification + profile last (may be referenced)
    await Promise.all([
      supabase.from("user_gamification").delete().eq("user_id", user.id),
      supabase.from("profiles").delete().eq("id", user.id),
    ]);

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
