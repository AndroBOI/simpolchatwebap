import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";

export default async function ChatContent({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  console.log("Chatting with user ID:", id);
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
        <Link href="/users" className="hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <CircleUserRound className="w-4 h-4 text-primaary" />
        </div>
        <div>
          <p className="font-medium leading-none">User</p>
          <p className="text-xs text-muted-foreground mt-0.5">offline</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
          <CircleUserRound className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No messages yet</p>
          <p className="text-xs text-muted-foreground/60">Say hello 👋</p>
        </div>

        {/* 
        <div className="flex gap-2 items-end">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CircleUserRound className="w-3 h-3 text-primary" />
          </div>
          <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2 max-w-[75%]">
            <p className="text-sm">Hey there!</p>
            <p className="text-xs text-muted-foreground mt-1">12:00 PM</p>
          </div>
        </div>
        */}

        {/*
        <div className="flex gap-2 items-end justify-end">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-3 py-2 max-w-[75%]">
            <p className="text-sm">Hello!</p>
            <p className="text-xs text-primary-foreground/70 mt-1">12:01 PM</p>
          </div>
        </div>
        */}
      </div>

      <div className="shrink-0 px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity">
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
