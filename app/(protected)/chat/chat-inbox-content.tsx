import { createClient } from "@/lib/supabase/server";
import { CircleUserRound, MessageCircleDashed } from "lucide-react";
import Link from "next/link";

export default async function ChatInboxContent() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();


  const { data: participants } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", currentUser!.id);

  const convoIds = participants?.map((p) => p.conversation_id) ?? [];

  if (convoIds.length === 0) {
    return <EmptyState />;
  }


  const { data: otherParticipants } = await supabase
    .from("conversation_participants")
    .select("conversation_id, user_id, users(id, email, full_name, avatar_url)")
    .in("conversation_id", convoIds)
    .neq("user_id", currentUser!.id);

 
  const { data: lastMessages } = await supabase
    .from("messages")
    .select("conversation_id, content, created_at, sender_id")
    .in("conversation_id", convoIds)
    .order("created_at", { ascending: false });


  const lastMessageMap: Record<
    string,
    {
      conversation_id: string;
      content: string;
      created_at: string;
      sender_id: string;
    }
  > = {};
  lastMessages?.forEach((msg) => {
    if (!lastMessageMap[msg.conversation_id]) {
      lastMessageMap[msg.conversation_id] = msg;
    }
  });

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-base">Messages</h1>
        <p className="text-xs text-muted-foreground">
          {convoIds.length} conversation{convoIds.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {otherParticipants?.map((p) => {
          const other = (Array.isArray(p.users)
            ? p.users[0]
            : p.users) as unknown as {
            id: string;
            email: string;
            full_name: string | null;
            avatar_url: string | null;
          };
          const lastMsg = lastMessageMap[p.conversation_id];

          return (
            <Link
              key={p.conversation_id}
              href={`/chat/${p.conversation_id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
            >

              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CircleUserRound className="w-5 h-5 text-primary" />
              </div>


              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {other?.full_name ?? other?.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {lastMsg
                    ? lastMsg.sender_id === currentUser!.id
                      ? `You: ${lastMsg.content}`
                      : lastMsg.content
                    : "No messages yet"}
                </p>
              </div>

    
              {lastMsg && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(lastMsg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState() {
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
          Find people to chat with →
        </Link>
      </div>
    </div>
  );
}
