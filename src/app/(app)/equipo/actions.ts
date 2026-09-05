"use server";

import { revalidatePath } from "next/cache";
import { requireUser, isAdmin } from "@/lib/auth";

export async function removeMember(formData: FormData) {
  const { supabase, profile, user } = await requireUser();
  if (!isAdmin(profile)) throw new Error("Solo el administrador.");

  const id = String(formData.get("id") || "");
  if (id === user.id) throw new Error("No puedes sacarte a ti mismo.");

  await supabase.from("athletes").delete().eq("profile_id", id);

  const { error } = await supabase
    .from("profiles")
    .update({ team_id: null, role: "athlete" })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/equipo/miembros");
}
