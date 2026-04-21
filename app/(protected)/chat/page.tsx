import Link from "next/link";
import { MessageCircleDashed } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-base">Messages</h1>
        <p className="text-xs text-muted-foreground">Your conversations</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <MessageCircleDashed className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No conversations yet</p>
        <Link
          href="/users"
          className="text-xs text-primary hover:opacity-70 transition-opacity"
        >
          Find people to chat with
        </Link>
      </div>
    </div>
  );
}
