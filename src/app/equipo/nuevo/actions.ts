"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function createTeam(_prevState: string | null, formData: FormData) {
  const { supabase, user, profile } = await requireUser();
  if (profile?.team_id) redirect("/dashboard");

  const name = String(formData.get("name") || "").trim();
  if (!name) return "Falta el nombre del equipo.";

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({
      name,
      sport: "sailing",
      description: String(formData.get("description") || "") || null,
      location: String(formData.get("location") || "") || null,
      logo_url: String(formData.get("logo_url") || "") || null,
    })
    .select("id")
    .single();
  if (teamError) return teamError.message;

  const { data: updatedProfile, error: profileError } = await supabase
    .from("profiles")
    .update({ team_id: team.id, role: "admin" })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();
  if (profileError) return profileError.message;
  if (!updatedProfile) {
    return "El equipo se creó pero no se pudo asignar a tu perfil (bloqueado por permisos). Avísale a soporte.";
  }

  redirect("/dashboard?welcome=1");
}
