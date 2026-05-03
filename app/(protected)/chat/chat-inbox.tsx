import { createClient } from "@/lib/supabase/server";
import ChatInboxContent from "./chat-inbox-content";

export default async function ChatInbox() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-base">Messages</h1>
      </div>
      <ChatInboxContent currentUserId={currentUser!.id} />
    </div>
  );
}
