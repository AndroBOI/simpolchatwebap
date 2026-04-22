"use client";

import { CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { startConversation } from "./actions";

export const UserLink = ({
  user,
}: {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}) => {
  const router = useRouter();

  const handleClick = async () => {
    const convoId = await startConversation(user.id);
    router.push(`/chat/${convoId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors cursor-pointer"
    >
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <CircleUserRound className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.full_name ?? user.email}</p>
        {user.full_name && (
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        )}
      </div>
    </div>
  );
};
