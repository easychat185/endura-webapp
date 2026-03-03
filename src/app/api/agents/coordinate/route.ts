import { NextRequest, NextResponse } from "next/server";
import { MasterCoordinatorAgent } from "@/lib/agents/runners/master-coordinator";
import { requireAdminAuth } from "@/lib/agents/admin-auth";

export async function POST(request: NextRequest) {
  const authErr = requireAdminAuth(request);
  if (authErr) return authErr;

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
