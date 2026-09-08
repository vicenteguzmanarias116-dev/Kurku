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

const VALID_ROLES = ["admin", "coach", "athlete"] as const;

export async function setMemberRole(formData: FormData) {
  const { supabase, profile, user } = await requireUser();
  if (!isAdmin(profile)) throw new Error("Solo el administrador.");

  const id = String(formData.get("id") || "");
  const role = String(formData.get("role") || "");
  if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    throw new Error("Rol inválido.");
  }
  if (id === user.id && role !== "admin") {
    throw new Error("No puedes quitarte el rol de administrador a ti mismo.");
  }

  if (role !== "admin") {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("team_id", profile!.team_id)
      .eq("role", "admin");
    const { data: target } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", id)
      .single();
    if (target?.role === "admin" && (count ?? 0) <= 1) {
      throw new Error("El equipo necesita al menos un administrador.");
    }
  }

  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/equipo/miembros");
}
