"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrCreateConversation } from "@/lib/conversation";

export const startConversation = async (
  otherUserId: string,
): Promise<string> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return getOrCreateConversation(user!.id, otherUserId);
};
