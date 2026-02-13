import Link from "next/link";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
  return (
    <main className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-3">
        <Link href="/" className="text-lg font-bold text-[var(--primary)]">
          FR8
        </Link>
        <span className="text-sm text-[var(--muted-foreground)]">
          Intermodal Intelligence
        </span>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
