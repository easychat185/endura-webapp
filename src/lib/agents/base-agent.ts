import Anthropic from "@anthropic-ai/sdk";
import { getAdminClient } from "./supabase-admin";
import { calculateCost, checkBudget } from "./token-tracker";
import type {
  AgentType,
  AgentReport,
  AgentRunResult,
  AgentRunParams,
  TokenUsage,
  AgentActionItem,
} from "./types";

const anthropic = new Anthropic();

const SUMMARY_MODEL = "claude-haiku-4-5-20251001";
const NON_RETRYABLE_CODES = [400, 401, 403];

export abstract class BaseAgent {
  abstract readonly agentType: AgentType;
  abstract readonly model: string;
  abstract readonly maxTokens: number;
  abstract readonly label: string;

  protected temperature?: number;

  abstract getSystemPrompt(params: AgentRunParams): string;
  abstract buildUserMessage(params: AgentRunParams): Promise<string>;
  abstract parseResponse(
    text: string
  ): { data: Record<string, unknown>; actionItems: AgentActionItem[] };

  async run(params: AgentRunParams = {}): Promise<AgentRunResult> {
    const supabase = getAdminClient();
    const startTime = Date.now();

    // Create run record
    const { data: run, error: insertError } = await supabase
      .from("agent_runs")
      .insert({
        agent_type: this.agentType,
        status: "running",
        params,
      })
      .select("id")
      .single();

    if (insertError || !run) {
      throw new Error(`Failed to create agent run: ${insertError?.message}`);
    }

    const runId = run.id;

    try {
      // Budget guard
      const budget = await checkBudget();
      if (!budget.allowed) {
        throw new Error(
          `Daily budget exceeded: $${budget.spent.toFixed(4)} / $${budget.budget} spent`
        );
      }

      const systemPrompt = this.getSystemPrompt(params);
      const userMessage = await this.buildUserMessage(params);

      // Call Claude
      const response = await this.callWithRetry(systemPrompt, userMessage);

      const block = response.content[0];
      const rawText = block.type === "text" ? block.text : "";

      // Calculate tokens
      const tokenUsage = this.calculateTokenUsage(response);

      // Parse structured response
      const { data, actionItems } = this.safeParseResponse(rawText);

      // Generate summary with Haiku
      const summary = await this.generateSummary(rawText);

      // Save report
      const { data: report } = await supabase
        .from("agent_reports")
        .insert({
          run_id: runId,
          agent_type: this.agentType,
          report: data,
          summary,
        })
        .select("id")
        .single();

      // Save action items
      if (report && actionItems.length > 0) {
        await supabase.from("agent_action_items").insert(
          actionItems.map((item) => ({
            report_id: report.id,
            agent_type: this.agentType,
            title: item.title,
            description: item.description,
            priority: item.priority,
            category: item.category ?? null,
          }))
        );
      }

      const durationMs = Date.now() - startTime;

      // Update run as completed
      await supabase
        .from("agent_runs")
        .update({
          status: "completed",
          input_tokens: tokenUsage.inputTokens,
          output_tokens: tokenUsage.outputTokens,
          total_tokens: tokenUsage.totalTokens,
          cost_usd: tokenUsage.costUsd,
          duration_ms: durationMs,
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId);

      const agentReport: AgentReport = {
        agentType: this.agentType,
        data,
        summary,
        actionItems,
      };

      return {
        runId,
        agentType: this.agentType,
        status: "completed",
        report: agentReport,
        tokenUsage,
        durationMs,
      };
    } catch (err) {
      const durationMs = Date.now() - startTime;
      const errorMsg = err instanceof Error ? err.message : String(err);

      await supabase
        .from("agent_runs")
        .update({
          status: "failed",
          error: errorMsg,
          duration_ms: durationMs,
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId);

      return {
        runId,
        agentType: this.agentType,
        status: "failed",
        report: null,
        tokenUsage: { inputTokens: 0, outputTokens: 0, totalTokens: 0, costUsd: 0 },
        durationMs,
        error: errorMsg,
      };
    }
  }

  private async callWithRetry(
    systemPrompt: string,
    userMessage: string,
    retries = 2
  ): Promise<Anthropic.Message> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await anthropic.messages.create({
          model: this.model,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
        });
      } catch (err: unknown) {
        const status =
          err instanceof Anthropic.APIError ? err.status : undefined;
        if (status && NON_RETRYABLE_CODES.includes(status)) throw err;
        if (attempt === retries) throw err;
        // Exponential backoff: 1s, 2s
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
    throw new Error("Unreachable");
  }

  private calculateTokenUsage(response: Anthropic.Message): TokenUsage {
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    return {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      costUsd: calculateCost(this.model, inputTokens, outputTokens),
    };
  }

  protected safeParseResponse(
    text: string
  ): { data: Record<string, unknown>; actionItems: AgentActionItem[] } {
    // Try direct parse
    try {
      return this.parseResponse(text);
    } catch {
      // noop
    }

    // Try extracting JSON between first { and last }
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return this.parseResponse(text.slice(firstBrace, lastBrace + 1));
      } catch {
        // noop
      }
    }

    // Fallback: return raw text as data
    return {
      data: { rawResponse: text },
      actionItems: [],
    };
  }

  private async generateSummary(text: string): Promise<string> {
    try {
      const response = await anthropic.messages.create({
        model: SUMMARY_MODEL,
        max_tokens: 300,
        system:
          "Summarize the following agent report in 2-3 concise sentences. Focus on the most important findings and recommendations.",
        messages: [
          {
            role: "user",
            content: `Summarize this report:\n\n${text.slice(0, 4000)}`,
          },
        ],
      });
      const block = response.content[0];
      return block.type === "text" ? block.text : "";
    } catch {
      return "Summary generation failed.";
    }
  }
}
