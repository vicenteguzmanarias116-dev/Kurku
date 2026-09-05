"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function joinTeam(_prevState: string | null, formData: FormData) {
  const teamId = String(formData.get("team_id") || "");
  const supabase = await createClient();

  const { data: athleteId, error } = await supabase.rpc("join_team_for_me", {
    p_team_id: teamId,
  });
  if (error) return error.message;

  redirect(`/atletas/${athleteId}?welcome=1`);
}
