"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import { ChartDisplay } from "@/components/viz/chart-display";
import { MapDisplay } from "@/components/viz/map-display";
import { Train, User, Code2 } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:300ms]" />
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isEmpty = !message.content && message.role === "assistant";

  return (
    <div className={cn("flex gap-3 px-4 py-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-[var(--primary)] shadow-sm"
            : "border border-[var(--border)] bg-[var(--card)]"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-[var(--primary-foreground)]" />
        ) : (
          <Train className="h-4 w-4 text-[var(--primary)]" />
        )}
      </div>

      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-2",
          isUser && "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
            isUser
              ? "rounded-tr-md bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "rounded-tl-md border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]"
          )}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : isEmpty ? (
            <LoadingDots />
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:mb-2 prose-headings:mt-3 prose-p:my-1.5 prose-li:my-0.5">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {message.sql && (
          <details className="group w-full">
            <summary className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
              <Code2 className="h-3 w-3" />
              View generated SQL
            </summary>
            <pre className="mt-1.5 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs leading-relaxed">
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
