import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canStartSession } from "@/lib/auth/tier";
import { summarizeSession } from "@/lib/chat/summarize";
import { awardXP } from "@/lib/gamification/xp";
import { updateStreak } from "@/lib/gamification/streak";
import { checkChallengeCompletion } from "@/lib/gamification/challenges";
import { isValidUUID } from "@/lib/validation";

// GET — get active session or session history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    // If conversationId provided, return messages for that session
    if (conversationId) {
      if (!isValidUUID(conversationId)) {
        return NextResponse.json(
          { error: "Invalid conversation ID" },
          { status: 400 }
        );
      }
      const { data: messages } = await supabase
        .from("messages")
        .select("id, sender, content, created_at")
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      return NextResponse.json({ messages: messages ?? [] });
    }

    // Otherwise, find active session (maybeSingle to avoid crash when none exists)
    const { data: activeSession } = await supabase
      .from("conversations")
      .select("id, session_number, message_count, started_at")
      .eq("user_id", user.id)
      .is("ended_at", null)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get total session count
    const { count } = await supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      activeSession,
      totalSessions: count ?? 0,
    });
  } catch (error) {
    console.error("Session GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST — start a new session
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check tier allows new session
    const allowed = await canStartSession(user.id);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Session limit reached for today. Upgrade for more sessions.",
          code: "SESSION_LIMIT",
        },
        { status: 403 }
      );
    }

    // Atomically get next session number via RPC (avoids race condition)
    let sessionNumber: number;
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      "next_session_number",
      { p_user_id: user.id }
    );

    if (rpcError || rpcResult == null) {
      // Fallback to count-based approach if RPC not available
      const { count } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      sessionNumber = (count ?? 0) + 1;
    } else {
      sessionNumber = rpcResult;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        session_number: sessionNumber,
      })
      .select("id, session_number")
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Session POST error:", error);
    return NextResponse.json(
      { error: "Failed to start session" },
      { status: 500 }
    );
  }
}

// PATCH — end a session (generate summary)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await request.json();

    if (!conversationId || !isValidUUID(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID" },
        { status: 400 }
      );
    }

    // Get all messages for this session
    const { data: messages } = await supabase
      .from("messages")
      .select("sender, content")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    let summary = "";
    if (messages && messages.length > 2) {
      try {
        summary = await summarizeSession(messages);
      } catch {
        summary = "Session completed.";
      }
    }

    await supabase
      .from("conversations")
      .update({
        ended_at: new Date().toISOString(),
        summary,
        message_count: messages?.length ?? 0,
      })
      .eq("id", conversationId)
      .eq("user_id", user.id);

    // Gamification: award XP if session had >5 messages
    let xpResult = null;
    const messageCount = messages?.length ?? 0;
    if (messageCount > 5) {
      await updateStreak(user.id, "chat_session");
      xpResult = await awardXP(user.id, 40, "chat_session", conversationId);
      await checkChallengeCompletion(user.id, "chat_session");

      // Check 5+ message challenge
      if (messageCount >= 5) {
        await checkChallengeCompletion(user.id, "chat_5_msgs");
      }
    }

    return NextResponse.json({ success: true, summary, xp: xpResult });
  } catch (error) {
    console.error("Session PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to end session" },
      { status: 500 }
    );
  }
}
