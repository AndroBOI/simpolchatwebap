import { createClient } from "@/lib/supabase/server";
import ChatWrapper from "./chat-wrapper";
import { Suspense } from "react";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <Wrapper params={params} />
    </Suspense>
  );
};

export default page;

async function Wrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  console.log("Looking up user with id:", id); 

  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  console.log("user:", user, "error:", error); 

  if (!user) {
    return <div>User not found — id was: {id}</div>;
  }

  return <ChatWrapper user={user} />;
}
