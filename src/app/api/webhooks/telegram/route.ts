import { NextRequest, NextResponse } from "next/server";
import { handleTelegramMessage } from "@/lib/agents/telegram-agent";
import { getAgent } from "@/lib/agents/registry";
import { SPECIALIZED_AGENT_TYPES } from "@/lib/agents/types";
import type { AgentType } from "@/lib/agents/types";
import { MasterCoordinatorAgent } from "@/lib/agents/runners/master-coordinator";

const TELEGRAM_API = "https://api.telegram.org/bot";

function getToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN");
  return token;
}

function getAllowedChatId(): string | null {
  return process.env.TELEGRAM_ALLOWED_CHAT_ID ?? null;
}

async function sendMessage(chatId: number, text: string) {
  const token = getToken();

  // Telegram has a 4096 char limit per message
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, 4000));
    remaining = remaining.slice(4000);
  }

  for (const chunk of chunks) {
    await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: chunk,
        parse_mode: "Markdown",
      }),
    });
  }
}

async function sendPlainMessage(chatId: number, text: string) {
  const token = getToken();
  await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

// Webhook verification
export async function GET() {
  return NextResponse.json({ status: "ok", bot: "endura-master-agent" });
}

// Incoming messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message?.text || !message?.chat?.id) {
      return NextResponse.json({ ok: true });
    }

    const chatId: number = message.chat.id;
    const text: string = message.text;

    // Auth: only allow specific chat ID if configured
    const allowedId = getAllowedChatId();
    if (allowedId && String(chatId) !== allowedId) {
      await sendPlainMessage(chatId, "Unauthorized. Your chat ID: " + chatId);
      return NextResponse.json({ ok: true });
    }

    // Handle /start command
    if (text === "/start") {
      await sendPlainMessage(
        chatId,
        "Endura Master Agent ready.\n\nCommands:\n- status\n- priorities\n- costs\n- summary\n- run [agent-name]\n- run all\n\nOr just chat with me about Endura strategy.\n\nYour chat ID: " + chatId
      );
      return NextResponse.json({ ok: true });
    }

    // Handle "run" commands
    const lower = text.toLowerCase().trim();

    if (lower === "run all") {
      await sendPlainMessage(chatId, "Running all agents... this will take a few minutes.");

      // Run in background (don't await in webhook)
      runAllAgents(chatId).catch(() => {});
      return NextResponse.json({ ok: true });
    }

    if (lower.startsWith("run ")) {
      const agentType = lower.slice(4).trim() as AgentType;
      const allTypes = [...SPECIALIZED_AGENT_TYPES, "master-coordinator" as AgentType];

      if (!allTypes.includes(agentType)) {
        await sendPlainMessage(
          chatId,
          `Unknown agent. Available: ${allTypes.join(", ")}`
        );
        return NextResponse.json({ ok: true });
      }

      await sendPlainMessage(chatId, `Running ${agentType}...`);
      runSingleAgent(chatId, agentType).catch(() => {});
      return NextResponse.json({ ok: true });
    }

    // Regular conversation
    const reply = await handleTelegramMessage(chatId, text);

    // Try Markdown first, fall back to plain text
    try {
      await sendMessage(chatId, reply);
    } catch {
      await sendPlainMessage(chatId, reply);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}

async function runSingleAgent(chatId: number, agentType: AgentType) {
  try {
    const agent = getAgent(agentType);
    const result = await agent.run({});

    if (result.status === "completed") {
      await sendPlainMessage(
        chatId,
        `✅ ${agentType} completed\nDuration: ${(result.durationMs / 1000).toFixed(1)}s\nCost: $${result.tokenUsage.costUsd.toFixed(4)}\n\n${result.report?.summary ?? ""}`
      );
    } else {
      await sendPlainMessage(chatId, `❌ ${agentType} failed: ${result.error}`);
    }
  } catch (err) {
    await sendPlainMessage(chatId, `❌ Error: ${err instanceof Error ? err.message : "Unknown"}`);
  }
}

async function runAllAgents(chatId: number) {
  try {
    let totalCost = 0;
    const runIds: string[] = [];

    for (const agentType of SPECIALIZED_AGENT_TYPES) {
      const agent = getAgent(agentType);
      const result = await agent.run({});
      runIds.push(result.runId);
      totalCost += result.tokenUsage.costUsd;
      const emoji = result.status === "completed" ? "✅" : "❌";
      await sendPlainMessage(chatId, `${emoji} ${agentType}: ${result.status}`);
    }

    // Run coordinator
    const coordinator = new MasterCoordinatorAgent();
    const coordResult = await coordinator.run({});
    runIds.push(coordResult.runId);
    totalCost += coordResult.tokenUsage.costUsd;

    if (coordResult.status === "completed" && coordResult.report) {
      await coordinator.saveDailySummary(coordResult.report.data, runIds, totalCost);
      await sendPlainMessage(
        chatId,
        `✅ All agents done! Total cost: $${totalCost.toFixed(4)}\n\n${coordResult.report.summary}`
      );
    } else {
      await sendPlainMessage(chatId, `⚠️ Agents done but coordinator failed. Cost: $${totalCost.toFixed(4)}`);
    }
  } catch (err) {
    await sendPlainMessage(chatId, `❌ Schedule failed: ${err instanceof Error ? err.message : "Unknown"}`);
  }
}
