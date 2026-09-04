"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function createTeam(formData: FormData) {
  const { supabase, user, profile } = await requireUser();
  if (profile?.team_id) redirect("/dashboard");

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Falta el nombre del equipo.");

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
  if (teamError) throw new Error(teamError.message);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ team_id: team.id, role: "admin" })
    .eq("id", user.id);
  if (profileError) throw new Error(profileError.message);

  redirect("/dashboard");
}
