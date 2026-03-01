import "dotenv/config";
import { getAgent } from "../src/lib/agents/registry";
import { SPECIALIZED_AGENT_TYPES } from "../src/lib/agents/types";
import type { AgentType, AgentRunResult } from "../src/lib/agents/types";
import { MasterCoordinatorAgent } from "../src/lib/agents/runners/master-coordinator";

async function main() {
  const args = process.argv.slice(2);
  const parallel = args.includes("--parallel");

  // Parse --agents flag
  let agentTypes: AgentType[] = [...SPECIALIZED_AGENT_TYPES];
  const agentsIdx = args.indexOf("--agents");
  if (agentsIdx !== -1 && args[agentsIdx + 1]) {
    agentTypes = args[agentsIdx + 1].split(",") as AgentType[];
  }

  console.log(`\nEndura Agent Scheduler`);
  console.log(`Mode: ${parallel ? "parallel" : "sequential"}`);
  console.log(`Agents: ${agentTypes.join(", ")}`);
  console.log("=".repeat(60));

  const startTime = Date.now();
  const results: AgentRunResult[] = [];

  if (parallel) {
    const settled = await Promise.allSettled(
      agentTypes.map(async (type) => {
        console.log(`  Starting ${type}...`);
        const agent = getAgent(type);
        const result = await agent.run({});
        console.log(
          `  ${type}: ${result.status} (${(result.durationMs / 1000).toFixed(1)}s, $${result.tokenUsage.costUsd.toFixed(4)})`
        );
        return result;
      })
    );

    for (const s of settled) {
      if (s.status === "fulfilled") results.push(s.value);
    }
  } else {
    for (const type of agentTypes) {
      console.log(`\n  Running ${type}...`);
      const agent = getAgent(type);
      const result = await agent.run({});
      results.push(result);
      console.log(
        `  ${type}: ${result.status} (${(result.durationMs / 1000).toFixed(1)}s, $${result.tokenUsage.costUsd.toFixed(4)})`
      );
    }
  }

  // Run master coordinator
  console.log("\n  Running master-coordinator...");
  const coordinator = new MasterCoordinatorAgent();
  const coordResult = await coordinator.run({});
  results.push(coordResult);

  // Save daily summary if coordinator succeeded
  if (coordResult.status === "completed" && coordResult.report) {
    const runIds = results.map((r) => r.runId);
    const totalCost = results.reduce(
      (sum, r) => sum + r.tokenUsage.costUsd,
      0
    );
    await coordinator.saveDailySummary(coordResult.report.data, runIds, totalCost);
  }

  // Print summary table
  const totalDuration = Date.now() - startTime;
  const totalCost = results.reduce(
    (sum, r) => sum + r.tokenUsage.costUsd,
    0
  );
  const totalTokens = results.reduce(
    (sum, r) => sum + r.tokenUsage.totalTokens,
    0
  );

  console.log("\n" + "=".repeat(60));
  console.log("RESULTS");
  console.log("=".repeat(60));
  console.log(
    `${"Agent".padEnd(25)} ${"Status".padEnd(10)} ${"Time".padEnd(8)} ${"Cost".padEnd(10)} Tokens`
  );
  console.log("-".repeat(60));

  for (const r of results) {
    console.log(
      `${r.agentType.padEnd(25)} ${r.status.padEnd(10)} ${(r.durationMs / 1000).toFixed(1).padEnd(8)} $${r.tokenUsage.costUsd.toFixed(4).padEnd(9)} ${r.tokenUsage.totalTokens}`
    );
  }

  console.log("-".repeat(60));
  console.log(
    `${"TOTAL".padEnd(25)} ${results.filter((r) => r.status === "completed").length}/${results.length} ok   ${(totalDuration / 1000).toFixed(1).padEnd(8)} $${totalCost.toFixed(4).padEnd(9)} ${totalTokens}`
  );

  // Print coordinator summary
  if (coordResult.status === "completed" && coordResult.report) {
    console.log("\n" + "=".repeat(60));
    console.log("EXECUTIVE SUMMARY");
    console.log("=".repeat(60));
    console.log(coordResult.report.summary);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
