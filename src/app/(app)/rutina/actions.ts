"use server";

import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";
import type { Days, InfoSection } from "./types";

function weekStart(d = new Date()) {
  const day = (d.getDay() + 6) % 7; // lunes=0
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  return monday.toISOString().slice(0, 10);
}

export async function saveRoutine(
  athleteId: string,
  data: { title: string; subtitle: string; days: Days; info: InfoSection[] },
) {
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");

  const { error } = await supabase.from("routines").upsert(
    {
      team_id: profile!.team_id,
      athlete_id: athleteId,
      title: data.title || "Mi rutina",
      subtitle: data.subtitle || null,
      days: data.days,
      info: data.info,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "athlete_id" },
  );
  if (error) throw new Error(error.message);
  revalidatePath(`/rutina/${athleteId}`);
  revalidatePath("/rutina");
}

async function myAthleteId(supabase: Awaited<ReturnType<typeof requireUser>>["supabase"], userId: string) {
  const { data } = await supabase.from("athletes").select("id").eq("profile_id", userId).maybeSingle();
  return data?.id as string | undefined;
}

export async function toggleCheck(weekday: number, index: number) {
  const { supabase, user } = await requireUser();
  const athleteId = await myAthleteId(supabase, user.id);
  if (!athleteId) throw new Error("No sos un atleta.");

  const ws = weekStart();
  const { data: existing } = await supabase
    .from("routine_checks")
    .select("done_indexes")
    .eq("athlete_id", athleteId)
    .eq("week_start", ws)
    .eq("weekday", weekday)
    .maybeSingle();

  const current: number[] = existing?.done_indexes ?? [];
  const next = current.includes(index)
    ? current.filter((i) => i !== index)
    : [...current, index];

  const { error } = await supabase
    .from("routine_checks")
    .upsert(
      { athlete_id: athleteId, week_start: ws, weekday, done_indexes: next },
      { onConflict: "athlete_id,week_start,weekday" },
    );
  if (error) throw new Error(error.message);
  revalidatePath("/rutina");
}

export async function logWeight(weekday: number, index: number, kg: number, reps: number) {
  const { supabase, user } = await requireUser();
  const athleteId = await myAthleteId(supabase, user.id);
  if (!athleteId) throw new Error("No sos un atleta.");

  const { error } = await supabase.from("exercise_logs").insert({
    athlete_id: athleteId,
    weekday,
    exercise_index: index,
    kg,
    reps,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/rutina");
}

export async function deleteLog(logId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("exercise_logs").delete().eq("id", logId);
  if (error) throw new Error(error.message);
  revalidatePath("/rutina");
}

export async function completeSession(title: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("complete_training_session", { p_title: title });
  if (error) throw new Error(error.message);
  revalidatePath("/pagina-equipo");
}
