"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Train } from "lucide-react";

const SUGGESTIONS = [
  "Show trains from Rotterdam to Milan",
  "Which routes save the most CO2?",
  "List terminals in Germany",
  "Compare transit times from Hamburg",
];

export function ChatInterface() {
  const { messages, isLoading, sendMessage, stop } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]">
              <Train className="h-8 w-8 text-[var(--primary)]" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">FR8 Tools</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Ask me about European intermodal train connections
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--muted)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl py-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} onStop={stop} isLoading={isLoading} />
    </div>
  );
}
