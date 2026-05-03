"use client";

import { useEffect, useState } from "react";
import { getSocket, readConversations } from "@/lib/socket";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type LastMessage = {
  conversation_id: string;
  content: string;
  created_at: string;
  sender_id: string;
};

type OtherParticipant = {
  conversation_id: string;
  users: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  }[];
};

export default function ChatInboxContent({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [otherParticipants, setOtherParticipants] = useState<
    OtherParticipant[]
  >([]);
  const [lastMessageMap, setLastMessageMap] = useState<
    Record<string, LastMessage>
  >({});
  const [unreadSet, setUnreadSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", currentUserId);

      const convoIds = participants?.map((p) => p.conversation_id) ?? [];

      if (convoIds.length === 0) {
        setLoading(false);
        return;
      }

      const [{ data: others }, { data: lastMessages }, { data: unread }] =
        await Promise.all([
          supabase
            .from("conversation_participants")
            .select(
              "conversation_id, user_id, users(id, email, full_name, avatar_url)",
            )
            .in("conversation_id", convoIds)
            .neq("user_id", currentUserId),
          supabase
            .from("messages")
            .select("conversation_id, content, created_at, sender_id")
            .in("conversation_id", convoIds)
            .order("created_at", { ascending: false }),
          supabase
            .from("messages")
            .select("conversation_id")
            .in("conversation_id", convoIds)
            .neq("sender_id", currentUserId)
            .is("read_at", null),
        ]);

      const msgMap: Record<string, LastMessage> = {};
      lastMessages?.forEach((msg) => {
        if (!msgMap[msg.conversation_id]) {
          msgMap[msg.conversation_id] = msg;
        }
      });

      const unreadIds = new Set(
        (unread?.map((m) => m.conversation_id) ?? []).filter(
          (id) => !readConversations.has(id),
        ),
      );

      setOtherParticipants((others as OtherParticipant[]) ?? []);
      setLastMessageMap(msgMap);
      setUnreadSet(unreadIds);
      setLoading(false);
    };

    fetchData();
  }, [currentUserId]);

  useEffect(() => {
    const socket = getSocket(currentUserId);

    socket.on("new_message", (message: LastMessage) => {
      setLastMessageMap((prev) => ({
        ...prev,
        [message.conversation_id]: message,
      }));

      if (
        message.sender_id !== currentUserId &&
        !readConversations.has(message.conversation_id)
      ) {
        setUnreadSet((prev) => new Set(prev).add(message.conversation_id));
      }
    });

    socket.on("marked_read", (conversation_id: string) => {
      readConversations.add(conversation_id);
      setUnreadSet((prev) => {
        const next = new Set(prev);
        next.delete(conversation_id);
        return next;
      });
    });

    return () => {
      socket.off("new_message");
      socket.off("marked_read");
    };
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground px-4 py-6">Loading...</div>
    );
  }

  if (otherParticipants.length === 0) {
    return (
      <div className="text-sm text-muted-foreground px-4 py-6">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border">
      {otherParticipants.map((p) => {
        const other = Array.isArray(p.users) ? p.users[0] : p.users;
        const lastMsg = lastMessageMap[p.conversation_id];
        const isUnread = unreadSet.has(p.conversation_id);

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
              <p
                className={`truncate ${isUnread ? "font-bold" : "font-medium"}`}
              >
                {other?.full_name ?? other?.email}
              </p>
              <p
                className={`text-xs truncate ${isUnread ? "text-foreground font-semibold" : "text-muted-foreground"}`}
              >
                {lastMsg
                  ? lastMsg.sender_id === currentUserId
                    ? `You: ${lastMsg.content}`
                    : lastMsg.content
                  : "No messages yet"}
              </p>
            </div>

            {lastMsg && (
              <span
                className={`text-xs shrink-0 ${isUnread ? "text-primary font-semibold" : "text-muted-foreground"}`}
              >
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
  );
}
