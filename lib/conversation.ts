import { createClient } from "./supabase/server";

export const getOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string,
): Promise<string> => {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", currentUserId);

  const myConvoIds = existing?.map((p) => p.conversation_id) ?? [];

  if (myConvoIds.length > 0) {
    const { data: shared } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", otherUserId)
      .in("conversation_id", myConvoIds);

    if (shared && shared.length > 0) {
      return shared[0].conversation_id;
    }
  }

  const { data: convo } = await supabase
    .from("conversations")
    .insert({})
    .select()
    .single();

  await supabase.from("conversation_participants").insert([
    { conversation_id: convo!.id, user_id: currentUserId },
    { conversation_id: convo!.id, user_id: otherUserId },
  ]);

  return convo!.id;
};
