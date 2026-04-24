"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { CircleUserRound, MessageCircleDashed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Conversation = {
  conversation_id: string;
  other: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  lastMsg: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
  unread: number;
};

export default function ChatInboxClient({
  currentUserId,
  initialConversations,
  hidden = false,
}: {
  currentUserId: string;
  initialConversations: Conversation[];
  hidden?: boolean;
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;

    setConversations((prev) =>
      prev.map((convo) => {
        const isViewing = pathname === `/chat/${convo.conversation_id}`;
        return isViewing ? { ...convo, unread: 0 } : convo;
      }),
    );
  }, [pathname]);

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      auth: { user_id: currentUserId },
    });

    socket.on("new_message", (message) => {
      const isCurrentlyViewing =
        pathnameRef.current === `/chat/${message.conversation_id}`;
      setConversations((prev) =>
        prev.map((convo) => {
          if (convo.conversation_id !== message.conversation_id) return convo;

          return {
            ...convo,
            lastMsg: {
              content: message.content,
              created_at: message.created_at,
              sender_id: message.sender_id,
            },
            unread:
              message.sender_id !== currentUserId && !isCurrentlyViewing
                ? convo.unread + 1
                : convo.unread,
          };
        }),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  if (hidden) return null;

  if (conversations.length === 0) {
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

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-base">Messages</h1>
        <p className="text-xs text-muted-foreground">
          {conversations.length} conversation
          {conversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {conversations.map((convo) => (
          <Link
            key={convo.conversation_id}
            href={`/chat/${convo.conversation_id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <CircleUserRound className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`truncate ${convo.unread > 0 ? "font-semibold" : "font-medium"}`}
              >
                {convo.other?.full_name ?? convo.other?.email}
              </p>
              <p
                className={`text-xs truncate ${convo.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                {convo.lastMsg
                  ? convo.lastMsg.sender_id === currentUserId
                    ? `You: ${convo.lastMsg.content}`
                    : convo.lastMsg.content
                  : "No messages yet"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              {convo.lastMsg && (
                <span className="text-xs text-muted-foreground">
                  {new Date(convo.lastMsg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
              {convo.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {convo.unread}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
