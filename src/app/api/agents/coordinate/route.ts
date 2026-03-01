import { NextRequest, NextResponse } from "next/server";
import { MasterCoordinatorAgent } from "@/lib/agents/runners/master-coordinator";
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
    const coordinator = new MasterCoordinatorAgent();
    const result = await coordinator.run({});

    if (result.status === "completed" && result.report) {
      await coordinator.saveDailySummary(
        result.report.data,
        [result.runId],
        result.tokenUsage.costUsd
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Coordinate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
