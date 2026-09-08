"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function saveCheckin(data: {
  athlete_id: string;
  sleep_hours: number | null;
  sleep_quality: number | null;
  mood: number | null;
  soreness_overall: number | null;
  notes: string | null;
  muscle_pain: Record<string, number>;
}) {
  const { supabase, profile } = await requireUser();
  if (!profile?.team_id) throw new Error("Sin equipo.");

  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from("health_checkins").upsert(
    {
      team_id: profile.team_id,
      athlete_id: data.athlete_id,
      checkin_date: today,
      sleep_hours: data.sleep_hours,
      sleep_quality: data.sleep_quality,
      mood: data.mood,
      soreness_overall: data.soreness_overall,
      notes: data.notes,
      muscle_pain: data.muscle_pain,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "athlete_id,checkin_date" },
  );
  if (error) throw new Error(error.message);
  revalidatePath("/salud");
}
