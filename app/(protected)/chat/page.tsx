import { Suspense } from "react";
import ChatInboxContent from "./chat-inbox-content";
import LoadingSpinner from "@/components/loading-spinner";
export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChatInboxContent />
    </Suspense>
  );
}
