import { z } from "zod";

export const MAX_BODY = 32_768;
export const messageSchema = z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(6000) }).strict();
export const inputSchema = z.object({
  sessionId: z.string().uuid(),
  messages: z.array(messageSchema).min(1).max(16),
  contextPath: z.string().regex(/^\/(articles|projects)\/[a-z0-9-]+$/).max(180).optional(),
}).strict().superRefine((value, ctx) => {
  if (value.messages.at(-1)?.role !== "user" || value.messages.at(-1)!.content.length > 2000 || value.messages.reduce((n, m) => n + m.content.length, 0) > 12000) {
    ctx.addIssue({ code: "custom", message: "Invalid history" });
  }
  if (value.messages.some((m, i) => m.role !== (i % 2 === 0 ? "user" : "assistant"))) {
    ctx.addIssue({ code: "custom", message: "History must alternate from user" });
  }
});
export type ChatMessage = z.infer<typeof messageSchema>;

/** Streaming UTF-8 + CRLF-safe SSE decoder. Reject unbounded/malformed events. */
export async function* sseData(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let match: RegExpExecArray | null;
      while ((match = /\r?\n\r?\n/.exec(buffer))) {
        if (match.index > 65536) throw new Error("Stream event too large");
        const block = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);
        const data = block.split(/\r?\n/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
        if (data) yield data;
      }
      if (buffer.length > 65536) throw new Error("Stream event too large");
      if (done) break;
    }
    if (buffer.trim()) throw new Error("Incomplete stream event");
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
