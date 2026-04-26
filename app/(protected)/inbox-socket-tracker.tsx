import { createClient } from "@/lib/supabase/server";
import InboxSocketTrackerClient from "./inbox-socket-tracker-client";

export default async function InboxSocketTracker() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return <InboxSocketTrackerClient currentUserId={user.id} />;
}
