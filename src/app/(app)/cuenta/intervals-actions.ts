"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function saveIntervalsCredentials(_prevState: string | null, formData: FormData) {
  const { supabase, user } = await requireUser();
  const intervals_athlete_id = String(formData.get("intervals_athlete_id") || "").trim() || null;
  const intervals_api_key = String(formData.get("intervals_api_key") || "").trim() || null;

  const { error } = await supabase
    .from("integrations")
    .upsert(
      { profile_id: user.id, intervals_athlete_id, intervals_api_key },
      { onConflict: "profile_id" },
    );
  if (error) return error.message;
  revalidatePath("/cuenta");
  return null;
}

type IntervalsActivity = {
  id: string;
  start_date_local: string;
  moving_time: number | null;
  distance: number | null;
  type: string;
};

export async function syncIntervals() {
  const { supabase, user, profile } = await requireUser();

  const { data: integ } = await supabase
    .from("integrations")
    .select("intervals_athlete_id, intervals_api_key")
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!integ?.intervals_athlete_id || !integ?.intervals_api_key) {
    return { error: "Faltan tus credenciales de Intervals.icu." };
  }

  const { data: athlete } = await supabase
    .from("athletes")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!athlete) return { error: "Tu cuenta no está vinculada a un atleta todavía." };

  const oldest = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10); // últimos 60 días
  const auth = Buffer.from(`API_KEY:${integ.intervals_api_key}`).toString("base64");
  const url = `https://intervals.icu/api/v1/athlete/${integ.intervals_athlete_id}/activities?oldest=${oldest}`;

  let activities: IntervalsActivity[];
  try {
    const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
    if (!res.ok) return { error: `Intervals.icu respondió ${res.status}. Revisa tu API key.` };
    activities = await res.json();
  } catch {
    return { error: "No se pudo conectar con Intervals.icu." };
  }

  let imported = 0;
  for (const a of activities) {
    const { data: existing } = await supabase
      .from("training_sessions")
      .select("id")
      .eq("athlete_id", athlete.id)
      .contains("metrics", { intervals_activity_id: a.id })
      .maybeSingle();
    if (existing) continue;

    const { error } = await supabase.from("training_sessions").insert({
      team_id: profile!.team_id,
      athlete_id: athlete.id,
      session_date: a.start_date_local.slice(0, 10),
      source: "intervals.icu",
      duration_s: a.moving_time,
      distance_m: a.distance,
      metrics: { intervals_activity_id: a.id, type: a.type },
    });
    if (!error) imported++;
  }

  await supabase
    .from("integrations")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("profile_id", user.id);

  revalidatePath("/entrenamientos");
  revalidatePath("/cuenta");
  return { imported };
}
