import Link from "next/link";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Train, ArrowLeft } from "lucide-react";

export default function ChatPage() {
  return (
    <main className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--background)]/80 px-4 py-2.5 backdrop-blur-lg">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <div className="h-4 w-px bg-[var(--border)]" />
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)]">
            <Train className="h-3 w-3 text-[var(--primary-foreground)]" />
          </div>
          <span className="text-sm font-semibold">FR8 Tools</span>
          <span className="hidden text-xs text-[var(--muted-foreground)] sm:inline">
            Intermodal Intelligence
          </span>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
