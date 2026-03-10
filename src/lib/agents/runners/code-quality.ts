import * as fs from "fs";
import * as path from "path";
import { BaseAgent } from "../base-agent";
import { getCodeQualityPrompt } from "../prompts/code-quality-prompt";
import type { AgentType, AgentRunParams, AgentActionItem } from "../types";
import { DEFAULT_AGENT_MODEL } from "@/lib/ai/models";

const MAX_FILE_SIZE = 8000; // chars per file
const MAX_TOTAL_CONTEXT = 60000; // total chars for all files

export class CodeQualityAgent extends BaseAgent {
  readonly agentType: AgentType = "code-quality";
  readonly model = DEFAULT_AGENT_MODEL;
  readonly maxTokens = 4096;
  readonly label = "Code Quality";

  getSystemPrompt(params: AgentRunParams): string {
    return getCodeQualityPrompt(params);
  }

  async buildUserMessage(params: AgentRunParams): Promise<string> {
    const focus = params.focus ?? "full codebase";
    const projectRoot = params.projectPath ?? process.cwd();
    const srcDir = path.join(projectRoot, "src");

    const files = this.collectFiles(srcDir, [".ts", ".tsx"]);
    let context = "";
    let totalChars = 0;

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

    return `Review the following source code. Focus: ${focus}. Return valid JSON only.\n\n${context}`;
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
        category: item.category ? String(item.category) : "code-quality",
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
