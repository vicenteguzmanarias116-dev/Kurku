"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function createTeam(_prevState: string | null, formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (profile?.team_id) redirect("/dashboard");

  const name = String(formData.get("name") || "").trim();
  if (!name) return "Falta el nombre del equipo.";

  const { error } = await supabase.rpc("create_team_for_me", {
    p_name: name,
    p_location: String(formData.get("location") || "") || null,
    p_description: String(formData.get("description") || "") || null,
    p_logo_url: String(formData.get("logo_url") || "") || null,
  });
  if (error) return error.message;

  redirect("/dashboard?welcome=1");
}
