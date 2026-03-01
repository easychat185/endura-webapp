import "dotenv/config";
import { getAgent, ALL_AGENT_TYPES } from "../src/lib/agents/registry";
import type { AgentType, AgentRunParams } from "../src/lib/agents/types";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    console.log(`
Usage: npx tsx agents/run.ts <agent-type> [options]

Agent types:
  ${ALL_AGENT_TYPES.join("\n  ")}

Options:
  --depth <quick|standard|deep>   Analysis depth (default: standard)
  --focus <area>                  Focus area for the analysis
  --help                          Show this help
`);
    process.exit(0);
  }

  const agentType = args[0] as AgentType;
  if (!ALL_AGENT_TYPES.includes(agentType)) {
    console.error(`Unknown agent type: ${agentType}`);
    console.error(`Valid types: ${ALL_AGENT_TYPES.join(", ")}`);
    process.exit(1);
  }

  const params: AgentRunParams = {};

  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--depth" && args[i + 1]) {
      params.depth = args[++i] as AgentRunParams["depth"];
    } else if (args[i] === "--focus" && args[i + 1]) {
      params.focus = args[++i];
    }
  }

  console.log(`\nRunning ${agentType} agent...`);
  console.log(`Depth: ${params.depth ?? "standard"}`);
  if (params.focus) console.log(`Focus: ${params.focus}`);
  console.log("---");

  const agent = getAgent(agentType);
  const result = await agent.run(params);

  if (result.status === "completed") {
    console.log(`\nStatus: ${result.status}`);
    console.log(`Duration: ${(result.durationMs / 1000).toFixed(1)}s`);
    console.log(
      `Tokens: ${result.tokenUsage.totalTokens} (in: ${result.tokenUsage.inputTokens}, out: ${result.tokenUsage.outputTokens})`
    );
    console.log(`Cost: $${result.tokenUsage.costUsd.toFixed(4)}`);
    console.log(`Run ID: ${result.runId}`);
    console.log(`\nSummary:\n${result.report?.summary ?? "N/A"}`);

    if (result.report?.actionItems.length) {
      console.log(`\nAction Items (${result.report.actionItems.length}):`);
      result.report.actionItems
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 10)
        .forEach((item, i) => {
          console.log(
            `  ${i + 1}. [P${item.priority}] ${item.title}: ${item.description}`
          );
        });
    }
  } else {
    console.error(`\nFailed: ${result.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
