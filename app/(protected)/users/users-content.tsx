import { createClient } from "@/lib/supabase/server";
import { UserLink } from "./user-link";

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
          <UserLink key={user.id} user={user} />
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
