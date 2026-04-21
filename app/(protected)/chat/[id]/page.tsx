import { Suspense } from "react";
import ChatContent from "./chat-content";
import LoadingSpinner from "@/components/loading-spinner";

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChatContent params={params} />
    </Suspense>
  );
}
