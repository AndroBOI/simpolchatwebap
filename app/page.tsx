import { Suspense } from "react";
import Homepage from "./home-page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading users...</div>}>
      <UsersWrapper />
    </Suspense>
  );
}

async function UsersWrapper() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user }, 
  } = await supabase.auth.getUser();
  if (!user) {
    return <div>Not logged in</div>;
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .neq("id", user.id);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <Homepage initialUsers={data || []} />;
}
