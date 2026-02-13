/**
 * SSE streaming client for the FR8 Tools chat API.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface StreamCallbacks {
  onData: (content: string) => void;
  onChart: (chart: unknown) => void;
  onMap: (geojson: unknown) => void;
  onSql: (sql: string) => void;
  onError: (error: string) => void;
  onDone: () => void;
}

export async function streamChat(
  messages: { role: string; content: string }[],
  threadId: string | null,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, thread_id: threadId }),
    signal,
  });

  if (!response.ok) {
    callbacks.onError(`Request failed with status ${response.status}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError("No response body");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      let currentEvent = "data";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith("event:")) {
          currentEvent = trimmed.slice(6).trim();
          continue;
        }

        if (trimmed.startsWith("data:")) {
          const dataStr = trimmed.slice(5).trim();
          if (!dataStr) continue;

          try {
            const parsed = JSON.parse(dataStr);

            switch (currentEvent) {
              case "data":
                callbacks.onData(parsed.content || "");
                break;
              case "chart":
                callbacks.onChart(parsed);
                break;
              case "map":
                callbacks.onMap(parsed);
                break;
              case "sql":
                callbacks.onSql(parsed.sql || "");
                break;
              case "error":
                callbacks.onError(parsed.error || "Unknown error");
                break;
              case "done":
                callbacks.onDone();
                break;
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  callbacks.onDone();
}
