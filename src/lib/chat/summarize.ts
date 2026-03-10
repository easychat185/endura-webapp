import Anthropic from "@anthropic-ai/sdk";
import { SUMMARY_MODEL } from "@/lib/ai/models";

const anthropic = new Anthropic();

export async function summarizeSession(
  messages: { sender: string; content: string }[]
): Promise<string> {
  const transcript = messages
    .map((m) => `${m.sender === "maya" ? "Dr. Maya" : "User"}: ${m.content}`)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: SUMMARY_MODEL,
    max_tokens: 300,
    system:
      "You are a clinical note taker. Summarize the following therapy session in 2-3 sentences. Capture: key topics discussed, exercises prescribed, user's emotional state, and any progress signals. Be concise and factual.",
    messages: [
      {
        role: "user",
        content: `Summarize this session:\n\n${transcript}`,
      },
    ],
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}
