"use client";

import { useCallback, useRef, useState } from "react";
import { streamChat } from "@/lib/api";
import type { ChatMessage, ChartConfig, GeoJSONData } from "@/lib/types";

let messageId = 0;
function nextId() {
  return `msg-${++messageId}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        content: content.trim(),
      };

      const assistantMsg: ChatMessage = {
        id: nextId(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        await streamChat(
          apiMessages,
          threadId,
          {
            onData: (text) => {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + text,
                  };
                }
                return updated;
              });
            },
            onChart: (chart) => {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    chart: chart as ChartConfig,
                  };
                }
                return updated;
              });
            },
            onMap: (geojson) => {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    map: geojson as GeoJSONData,
                  };
                }
                return updated;
              });
            },
            onSql: (sql) => {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = { ...last, sql };
                }
                return updated;
              });
            },
            onError: (error) => {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: `Error: ${error}`,
                  };
                }
                return updated;
              });
            },
            onDone: () => {
              setIsLoading(false);
            },
          },
          controller.signal
        );
      } catch {
        setIsLoading(false);
      }
    },
    [isLoading, messages, threadId]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  return { messages, isLoading, sendMessage, stop };
}
