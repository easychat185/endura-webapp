import { NextRequest, NextResponse } from "next/server";
import { getAgent, ALL_AGENT_TYPES } from "@/lib/agents/registry";
import type { AgentType } from "@/lib/agents/types";
import { requireAdminAuth } from "@/lib/agents/admin-auth";
import { isValidAgentDepth, isValidAgentFocus } from "@/lib/validation";
import * as fs from "fs";

const ALLOWED_PROJECT_PATHS: Record<string, string> = {
  "endura-mobile": "C:\\Users\\danie\\OneDrive\\Desktop\\endura-mobile",
};

export async function POST(request: NextRequest) {
  const authErr = requireAdminAuth(request);
  if (authErr) return authErr;

  try {
    const { agentType, depth, focus, project } = await request.json();

    if (!agentType || !ALL_AGENT_TYPES.includes(agentType as AgentType)) {
      return NextResponse.json(
        { error: `Invalid agent type. Valid: ${ALL_AGENT_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const validDepth = isValidAgentDepth(depth) ? depth : "standard";
    const validFocus = focus !== undefined && isValidAgentFocus(focus) ? focus : undefined;

    let projectPath: string | undefined;
    if (project && project in ALLOWED_PROJECT_PATHS) {
      const resolvedPath = ALLOWED_PROJECT_PATHS[project];
      if (!fs.existsSync(resolvedPath)) {
        return NextResponse.json({ error: `Project path not found: ${project}` }, { status: 400 });
      }
      projectPath = resolvedPath;
    }

    const agent = getAgent(agentType as AgentType);
    const result = await agent.run({ depth: validDepth, focus: validFocus, projectPath });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent run error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
