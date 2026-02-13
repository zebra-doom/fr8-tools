"use client";

import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 pb-5 pt-3">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about train routes, CO2 emissions, terminals..."
            rows={1}
            className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 pr-12 text-sm shadow-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
          <div className="absolute bottom-1.5 right-1.5">
            {isLoading ? (
              <Button
                onClick={onStop}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
              >
                <Square className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                size="icon"
                className="h-8 w-8 rounded-lg"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-[var(--muted-foreground)]">
        FR8 Tools uses GPT-4o to generate SQL queries against a database of
        European rail freight connections.
      </p>
    </div>
  );
}
