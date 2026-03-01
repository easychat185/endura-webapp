import { createClient } from "@/lib/supabase/server";

export async function startSession(userId: string) {
  const supabase = await createClient();

  // Get session count for this user
  const { count } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const sessionNumber = (count ?? 0) + 1;

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: userId,
      session_number: sessionNumber,
    })
    .select("id, session_number")
    .single();

  if (error) throw error;
  return data;
}

export async function endSession(conversationId: string, summary: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("conversations")
    .update({
      ended_at: new Date().toISOString(),
      summary,
    })
    .eq("id", conversationId);

  if (error) throw error;
}

export async function getActiveSession(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("conversations")
    .select("id, session_number, message_count")
    .eq("user_id", userId)
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

export async function getSessionHistory(
  conversationId: string,
  limit = 50
) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("messages")
    .select("id, sender, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  return data ?? [];
}

export async function getPriorSessionSummaries(
  userId: string,
  limit = 3
) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("conversations")
    .select("session_number, summary")
    .eq("user_id", userId)
    .not("summary", "is", null)
    .order("started_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((d) => d.summary).filter(Boolean) as string[];
}

export async function getSessionCount(userId: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return count ?? 0;
}
