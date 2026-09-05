"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function updateAccount(_prevState: string | null, formData: FormData) {
  const { supabase, user } = await requireUser();

  const full_name = String(formData.get("full_name") || "").trim();
  const avatar_url = String(formData.get("avatar_url") || "") || null;
  if (!full_name) return "Falta tu nombre.";

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, avatar_url })
    .eq("id", user.id);
  if (error) return error.message;

  revalidatePath("/", "layout");
  return null;
}
