"use client";

import { useEffect, useState, useRef } from "react";
import { getSocket, readConversations } from "@/lib/socket";
import { Send, CircleUserRound } from "lucide-react";
import { Message, Props } from "@/types";

const ChatWindow = ({
  conversationId,
  currentUserId,
  initialMessages,
}: Props) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = getSocket(currentUserId);

    // mark as read immediately
    readConversations.add(conversationId);
    if (socket.connected) {
      socket.emit("mark_read", { conversation_id: conversationId });
    }

    socket.on("connect", () => {
      socket.emit("mark_read", { conversation_id: conversationId });
    });

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
     
      if (message.conversation_id === conversationId) {
        socket.emit("mark_read", { conversation_id: conversationId });
      }
    });

    socket.on("error", (err: { message: string }) => {
      console.error(`Socket error: ${err.message}`);
    });

    return () => {
      socket.off("connect");
      socket.off("new_message");
      socket.off("error");

    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const socket = getSocket(currentUserId);
    socket.emit("send_message", {
      conversation_id: conversationId,
      content: input.trim(),
    });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <CircleUserRound className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground/60">Say hello 👋</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex gap-2 items-end ${isMine ? "justify-end" : ""}`}
            >
              {!isMine && (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CircleUserRound className="w-3 h-3 text-primary" />
                </div>
              )}
              <div
                className={`rounded-2xl px-3 py-2 max-w-[75%] ${
                  isMine
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border rounded-bl-sm"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isMine
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 px-4 py-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={sendMessage}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
