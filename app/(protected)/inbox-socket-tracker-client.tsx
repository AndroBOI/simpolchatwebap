"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function InboxSocketTrackerClient({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const router = useRouter();
  const routerRef = useRef(router);

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      auth: { user_id: currentUserId },
    });

    socket.on("new_message", () => {
      routerRef.current.refresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  return null;
}
