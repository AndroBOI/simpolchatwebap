import { Suspense } from "react";
import ChatInbox from "./chat-inbox";
import LoadingSpinner from "@/components/loading-spinner";
export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChatInbox />
    </Suspense>
  );
}
