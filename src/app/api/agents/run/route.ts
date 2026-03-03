import { NextRequest, NextResponse } from "next/server";
import { getAgent, ALL_AGENT_TYPES } from "@/lib/agents/registry";
import type { AgentType } from "@/lib/agents/types";
import { requireAdminAuth } from "@/lib/agents/admin-auth";
import { isValidAgentDepth, isValidAgentFocus } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const authErr = requireAdminAuth(request);
  if (authErr) return authErr;

  try {
    const { agentType, depth, focus } = await request.json();

    if (!agentType || !ALL_AGENT_TYPES.includes(agentType as AgentType)) {
      return NextResponse.json(
        { error: `Invalid agent type. Valid: ${ALL_AGENT_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const validDepth = isValidAgentDepth(depth) ? depth : "standard";
    const validFocus = focus !== undefined && isValidAgentFocus(focus) ? focus : undefined;

    const agent = getAgent(agentType as AgentType);
    const result = await agent.run({ depth: validDepth, focus: validFocus });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent run error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
