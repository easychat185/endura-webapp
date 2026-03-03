import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { buildSessionPrompt } from "@/lib/prompts/dr-maya";
import { getLevelFromXP } from "@/lib/gamification/levels";
import { selectModel } from "@/lib/chat/model-router";
import { checkRateLimit } from "@/lib/rate-limit";
import { isValidUUID, sanitizeMessage } from "@/lib/validation";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const allowed = checkRateLimit(user.id);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { conversationId } = body;
    let { message } = body;

    if (!message || !conversationId) {
      return NextResponse.json(
        { error: "Missing message or conversationId" },
        { status: 400 }
      );
    }

    if (typeof message !== "string") {
      return NextResponse.json(
        { error: "Message must be a string" },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    if (!isValidUUID(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID" },
        { status: 400 }
      );
    }

    message = sanitizeMessage(message);

    // Get user profile and tier
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", user.id)
      .maybeSingle();

    const tier = profile?.tier ?? "free";
    const messageLimit = tier === "premium" ? 60 : 30;

    // Get conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .select("id, session_number, message_count")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Check message limit (count user messages only)
    const userMessageCount = Math.ceil(conversation.message_count / 2);
    if (userMessageCount >= messageLimit) {
      return NextResponse.json(
        { error: "Message limit reached for this session", code: "LIMIT_REACHED" },
        { status: 403 }
      );
    }

    // Save user message
    const { data: userMsgData } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: user.id,
      sender: "user",
      content: message,
    }).select("id").single();
    const userMessageId = userMsgData?.id;

    // Parallelize remaining reads
    const [onboardingRes, priorSessionsRes, sessionMessagesRes, gamRes] = await Promise.all([
      supabase
        .from("onboarding_responses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("conversations")
        .select("summary")
        .eq("user_id", user.id)
        .not("summary", "is", null)
        .neq("id", conversationId)
        .order("started_at", { ascending: false })
        .limit(3),
      supabase
        .from("messages")
        .select("sender, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(40),
      supabase
        .from("user_gamification")
        .select("total_xp, level")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    const onboarding = onboardingRes.data;
    const priorSessions = priorSessionsRes.data;
    const sessionMessages = sessionMessagesRes.data;

    const summaries = (priorSessions ?? [])
      .map((s) => s.summary)
      .filter(Boolean) as string[];

    // Build user progress for Dr. Maya prompt
    const totalXP = gamRes.data?.total_xp ?? 0;
    const levelDef = getLevelFromXP(totalXP);
    const userProgress = {
      level: levelDef.level,
      tier: levelDef.tier,
      tierName: levelDef.tierName,
      totalXP,
    };

    // Build system prompt
    const systemPrompt = buildSessionPrompt(
      onboarding,
      summaries,
      conversation.session_number,
      userProgress
    );

    // Build message history for Claude
    const claudeMessages: Anthropic.MessageParam[] = (
      sessionMessages ?? []
    ).map((m) => ({
      role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));

    // Select model based on context
    const model = selectModel(conversation.session_number, message);

    // Stream response
    const stream = anthropic.messages.stream({
      model,
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: claudeMessages,
    });

    // Create a ReadableStream for the response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              fullResponse += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          // Save Maya's response to DB
          await supabase.from("messages").insert({
            conversation_id: conversationId,
            user_id: user.id,
            sender: "maya",
            content: fullResponse,
          });

          // Update message count (+2 for user + maya) — atomic increment
          await supabase.rpc("increment_message_count", {
            conv_id: conversationId,
            amount: 2,
          });

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch (err) {
          // Save partial response or roll back user message
          try {
            if (fullResponse.length > 0) {
              await supabase.from("messages").insert({
                conversation_id: conversationId,
                user_id: user.id,
                sender: "maya",
                content: fullResponse + "\n\n[Response interrupted — please try again]",
              });
              await supabase.rpc("increment_message_count", {
                conv_id: conversationId,
                amount: 2,
              });
            } else if (userMessageId) {
              await supabase.from("messages").delete().eq("id", userMessageId);
            }
          } catch {
            // Best-effort cleanup
          }
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
