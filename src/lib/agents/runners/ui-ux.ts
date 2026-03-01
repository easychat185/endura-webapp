import * as fs from "fs";
import * as path from "path";
import { BaseAgent } from "../base-agent";
import { getUiUxPrompt } from "../prompts/ui-ux-prompt";
import type { AgentType, AgentRunParams, AgentActionItem } from "../types";

const MAX_FILE_SIZE = 8000;
const MAX_TOTAL_CONTEXT = 60000;

export class UiUxAgent extends BaseAgent {
  readonly agentType: AgentType = "ui-ux";
  readonly model = "claude-sonnet-4-6";
  readonly maxTokens = 4096;
  readonly label = "UI/UX Analysis";

  getSystemPrompt(params: AgentRunParams): string {
    return getUiUxPrompt(params);
  }

  async buildUserMessage(params: AgentRunParams): Promise<string> {
    const focus = params.focus ?? "full UI review";
    const projectRoot = process.cwd();

    const dirs = [
      path.join(projectRoot, "src", "app"),
      path.join(projectRoot, "src", "components"),
    ];

    let context = "";
    let totalChars = 0;

    for (const dir of dirs) {
      const files = this.collectFiles(dir, [".tsx"]);
      for (const filePath of files) {
        if (totalChars >= MAX_TOTAL_CONTEXT) break;
        try {
          let content = fs.readFileSync(filePath, "utf-8");
          if (content.length > MAX_FILE_SIZE) {
            content = content.slice(0, MAX_FILE_SIZE) + "\n... (truncated)";
          }
          const relativePath = path.relative(projectRoot, filePath);
          const entry = `\n--- ${relativePath} ---\n${content}\n`;
          if (totalChars + entry.length > MAX_TOTAL_CONTEXT) break;
          context += entry;
          totalChars += entry.length;
        } catch {
          // skip unreadable files
        }
      }
    }

    return `Review the following UI components and pages. Focus: ${focus}. Return valid JSON only.\n\n${context}`;
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
        category: item.category ? String(item.category) : "ui-ux",
      })
    );
    return { data: parsed, actionItems };
  }

  private collectFiles(dir: string, extensions: string[]): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") continue;
        results.push(...this.collectFiles(fullPath, extensions));
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
    return results;
  }
}
