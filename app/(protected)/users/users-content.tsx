import { createClient } from "@/lib/supabase/server";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function UsersContent() {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  const { data: users } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, created_at")
    .neq("id", currentUser?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-base">People</h1>
        <p className="text-xs text-muted-foreground">
          {users?.length ?? 0} users
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {users?.map((user) => (
          <Link
          href={`/chat/${user.id}`}
            key={user.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors cursor-pointer"
          >
    
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.full_name ?? user.email}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <CircleUserRound className="w-5 h-5 text-primary" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {user.full_name ?? user.email}
              </p>
              {user.full_name && (
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              )}
            </div>
          </Link>
        ))}

        {(!users || users.length === 0) && (
          <div className="px-4 py-6 text-center text-muted-foreground text-xs">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
