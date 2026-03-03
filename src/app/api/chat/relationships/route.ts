import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { buildRelationshipPrompt } from "@/lib/prompts/dr-maya-relationships";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeMessage } from "@/lib/validation";

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
    const { history } = body;
    let { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Missing message" },
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

    message = sanitizeMessage(message);

    // Validate and sanitize history
    const validSenders = ["user", "maya", "assistant"];
    const safeHistory: { sender: string; text: string }[] = [];
    if (Array.isArray(history)) {
      for (const m of history.slice(-20)) {
        if (
          m &&
          typeof m === "object" &&
          typeof m.sender === "string" &&
          validSenders.includes(m.sender) &&
          typeof m.text === "string" &&
          m.text.length <= 5000
        ) {
          safeHistory.push({ sender: m.sender, text: sanitizeMessage(m.text) });
        }
      }
    }

    // Build system prompt
    const systemPrompt = buildRelationshipPrompt();

    // Build message history for Claude
    const claudeMessages: Anthropic.MessageParam[] = [
      ...safeHistory.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
      { role: "user" as const, content: message },
    ];

    // Use sonnet for relationship conversations (more nuanced)
    const model = "claude-sonnet-4-6";

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

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch {
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
    console.error("Relationship chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
