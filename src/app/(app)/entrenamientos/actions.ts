"use server";

import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";

function int(v: FormDataEntryValue | null) {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : null;
}

export async function addSession(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");

  const minutes = int(formData.get("minutes"));
  const row = {
    team_id: profile!.team_id,
    athlete_id: String(formData.get("athlete_id") || ""),
    session_date: String(formData.get("session_date") || ""),
    source: "manual",
    duration_s: minutes != null ? minutes * 60 : null,
    distance_m: int(formData.get("distance_m")),
    rpe: int(formData.get("rpe")),
    tacks: int(formData.get("tacks")),
    gybes: int(formData.get("gybes")),
  };
  if (!row.athlete_id || !row.session_date)
    throw new Error("Falta atleta o fecha.");

  const { error } = await supabase.from("training_sessions").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/entrenamientos");
  revalidatePath("/dashboard");
}
