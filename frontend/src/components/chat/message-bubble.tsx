"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import { ChartDisplay } from "@/components/viz/chart-display";
import { MapDisplay } from "@/components/viz/map-display";
import { Train, User } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 px-4 py-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-[var(--primary)]" : "bg-[var(--muted)]"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-[var(--primary-foreground)]" />
        ) : (
          <Train className="h-4 w-4 text-[var(--foreground)]" />
        )}
      </div>

      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--muted)] text-[var(--foreground)]"
          )}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{message.content || "Thinking..."}</ReactMarkdown>
            </div>
          )}
        </div>

        {message.sql && (
          <details className="w-full text-xs text-[var(--muted-foreground)]">
            <summary className="cursor-pointer hover:text-[var(--foreground)]">
              View SQL query
            </summary>
            <pre className="mt-1 overflow-x-auto rounded bg-[var(--muted)] p-2">
              <code>{message.sql}</code>
            </pre>
          </details>
        )}

        {message.chart && <ChartDisplay config={message.chart} />}
        {message.map && <MapDisplay data={message.map} />}
      </div>
    </div>
  );
}
