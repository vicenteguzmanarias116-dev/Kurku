"use server";

import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";

export async function addInjury(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");

  const row = {
    team_id: profile!.team_id,
    athlete_id: String(formData.get("athlete_id") || ""),
    body_part: String(formData.get("body_part") || "").trim(),
    description: String(formData.get("description") || "") || null,
    severity: Number(formData.get("severity")) || null,
    reported_date: String(formData.get("reported_date") || "") || new Date().toISOString().slice(0, 10),
    expected_return: String(formData.get("expected_return") || "") || null,
  };
  if (!row.athlete_id || !row.body_part) throw new Error("Falta atleta o zona.");
  const { error } = await supabase.from("injuries").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/lesiones");
  revalidatePath("/dashboard");
}

export async function setStatus(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const { error } = await supabase
    .from("injuries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/lesiones");
  revalidatePath("/dashboard");
}
