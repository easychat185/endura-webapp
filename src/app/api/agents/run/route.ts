import { NextRequest, NextResponse } from "next/server";
import { getAgent, ALL_AGENT_TYPES } from "@/lib/agents/registry";
import type { AgentType } from "@/lib/agents/types";
import { timingSafeEqual } from "crypto";

function checkAuth(request: NextRequest): boolean {
  const secret =
    request.headers.get("x-admin-secret") ||
    request.cookies.get("admin_token")?.value;
  const expected = process.env.AGENT_ADMIN_SECRET;
  if (!secret || !expected) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { agentType, depth, focus } = await request.json();

    if (!agentType || !ALL_AGENT_TYPES.includes(agentType as AgentType)) {
      return NextResponse.json(
        { error: `Invalid agent type. Valid: ${ALL_AGENT_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const agent = getAgent(agentType as AgentType);
    const result = await agent.run({ depth, focus });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent run error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
