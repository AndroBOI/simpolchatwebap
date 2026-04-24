import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ChatWindow from "./chat-window";
const ChatContent = async ({ params }: { params: { id: string } }) => {
  const { id: conversationId } = await params;

  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { data: participants } = await supabase
    .from("conversation_participants")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .neq("user_id", currentUser!.id);

  const otherUserId = participants?.[0]?.user_id;

  const { data: otherUser } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, status")
    .eq("id", otherUserId)
    .single();

  const { data: initialMessages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
        <Link href="/chat" className="hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <CircleUserRound className="w-4 h-4 text-primaary" />
        </div>
        <div>
          <p className="font-medium leading-none">
            {otherUser?.full_name ?? otherUser?.email ?? "User"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {otherUser?.status ?? "offline"}
          </p>
        </div>
      </div>

      <ChatWindow
        conversationId={conversationId}
        currentUserId={currentUser!.id}
        initialMessages={initialMessages ?? []}
      />
    </div>
  );
};

export default ChatContent;
