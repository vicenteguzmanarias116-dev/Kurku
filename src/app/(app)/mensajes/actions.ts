"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function sendMessage(recipientId: string, body: string) {
  const { supabase, user, profile } = await requireUser();
  const text = body.trim();
  if (!text || !recipientId) return;

  const { error } = await supabase.from("direct_messages").insert({
    team_id: profile!.team_id,
    sender_id: user.id,
    recipient_id: recipientId,
    body: text,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/mensajes");
}

export async function markThreadRead(otherId: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("direct_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", user.id)
    .eq("sender_id", otherId)
    .is("read_at", null);
  revalidatePath("/mensajes");
}
