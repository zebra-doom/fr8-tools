"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Train, Route, Leaf, MapPin } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: Route,
    text: "Show trains from Rotterdam to Milan",
  },
  {
    icon: Leaf,
    text: "Which routes save the most CO2?",
  },
  {
    icon: MapPin,
    text: "List terminals in Germany",
  },
  {
    icon: Train,
    text: "Compare transit times from Hamburg",
  },
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
          <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)] shadow-sm">
                <Train className="h-7 w-7 text-[var(--primary)]" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold tracking-tight">
                  FR8 Tools
                </h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Ask me about European intermodal train connections, CO2
                  emissions, or freight operators.
                </p>
              </div>
            </div>
            <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.text}
                  onClick={() => sendMessage(s.text)}
                  className="group flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 text-left text-sm transition-all hover:border-[var(--primary)]/30 hover:shadow-sm"
                >
                  <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)] opacity-60 transition-opacity group-hover:opacity-100" />
                  <span className="text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--foreground)]">
                    {s.text}
                  </span>
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
