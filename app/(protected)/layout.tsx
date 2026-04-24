import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import ChatInboxClient from "./chat/chat-inbox-client";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { data: participants } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", currentUser!.id);

  const convoIds = participants?.map((p) => p.conversation_id) ?? [];

  const { data: otherParticipants } = await supabase
    .from("conversation_participants")
    .select("conversation_id, user_id, users(id, email, full_name, avatar_url)")
    .in("conversation_id", convoIds.length > 0 ? convoIds : [""])
    .neq("user_id", currentUser!.id);

  const { data: lastMessages } = await supabase
    .from("messages")
    .select("conversation_id, content, created_at, sender_id")
    .in("conversation_id", convoIds.length > 0 ? convoIds : [""])
    .order("created_at", { ascending: false });

  const { data: unreadMessages } = await supabase
    .from("messages")
    .select("conversation_id")
    .in("conversation_id", convoIds.length > 0 ? convoIds : [""])
    .neq("sender_id", currentUser!.id)
    .is("read_at", null);

  const lastMessageMap: Record<
    string,
    { content: string; created_at: string; sender_id: string }
  > = {};
  lastMessages?.forEach((msg) => {
    if (!lastMessageMap[msg.conversation_id]) {
      lastMessageMap[msg.conversation_id] = msg;
    }
  });

  const unreadMap: Record<string, number> = {};
  unreadMessages?.forEach((msg) => {
    unreadMap[msg.conversation_id] = (unreadMap[msg.conversation_id] ?? 0) + 1;
  });

  const conversations =
    otherParticipants?.map((p) => {
      const other = (Array.isArray(p.users)
        ? p.users[0]
        : p.users) as unknown as {
        id: string;
        email: string;
        full_name: string | null;
        avatar_url: string | null;
      };
      return {
        conversation_id: p.conversation_id,
        other,
        lastMsg: lastMessageMap[p.conversation_id] ?? null,
        unread: unreadMap[p.conversation_id] ?? 0,
      };
    }) ?? [];

  return (
    <div className="pb-16">
      <ChatInboxClient
        currentUserId={currentUser!.id}
        initialConversations={conversations}
        hidden 
      />
      {children}
      <Navbar />
    </div>
  );
}
