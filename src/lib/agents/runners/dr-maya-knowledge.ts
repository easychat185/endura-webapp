import * as fs from "fs";
import * as path from "path";
import { BaseAgent } from "../base-agent";
import { getDrMayaKnowledgePrompt } from "../prompts/dr-maya-knowledge-prompt";
import type { AgentType, AgentRunParams, AgentActionItem } from "../types";
import { DEFAULT_AGENT_MODEL } from "@/lib/ai/models";

export class DrMayaKnowledgeAgent extends BaseAgent {
  readonly agentType: AgentType = "dr-maya-knowledge";
  readonly model = DEFAULT_AGENT_MODEL;
  readonly maxTokens = 4096;
  readonly label = "Dr. Maya Knowledge";

  getSystemPrompt(params: AgentRunParams): string {
    return getDrMayaKnowledgePrompt(params);
  }

  async buildUserMessage(params: AgentRunParams): Promise<string> {
    const focus = params.focus ?? "comprehensive knowledge audit";
    const projectRoot = params.projectPath ?? process.cwd();
    const promptsDir = path.join(projectRoot, "src", "lib", "prompts");

    let context = "";

    const promptFiles = [
      "dr-maya.ts",
      "dr-maya-relationships.ts",
    ];

    for (const fileName of promptFiles) {
      const filePath = path.join(promptsDir, fileName);
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        context += `\n--- ${fileName} ---\n${content}\n`;
      } catch {
        // skip if not found
      }
    }

    // Also check for any other prompt files
    if (fs.existsSync(promptsDir)) {
      const allFiles = fs.readdirSync(promptsDir);
      for (const file of allFiles) {
        if (promptFiles.includes(file)) continue;
        if (!file.endsWith(".ts")) continue;
        try {
          const content = fs.readFileSync(path.join(promptsDir, file), "utf-8");
          context += `\n--- ${file} ---\n${content}\n`;
        } catch {
          // skip
        }
      }
    }

    return `Audit the following Dr. Maya system prompts and knowledge base. Focus: ${focus}. Return valid JSON only.\n\n${context}`;
  }

  parseResponse(text: string): {
    data: Record<string, unknown>;
    actionItems: AgentActionItem[];
  } {
    const parsed = JSON.parse(text);
    const actionItems: AgentActionItem[] = (parsed.actionItems ?? []).map(
      (item: Record<string, unknown>) => ({
        title: String(item.title ?? ""),
        description: String(item.description ?? ""),
        priority: Number(item.priority ?? 5),
        category: item.category ? String(item.category) : "dr-maya",
      })
    );
    return { data: parsed, actionItems };
  }
}
