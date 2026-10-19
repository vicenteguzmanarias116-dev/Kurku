"use server";

import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DAYS = 62;

/** Crea el mismo evento en cada día del rango [date_from, date_to]. */
export async function addEvents(formData: FormData): Promise<{ error?: string }> {
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) return { error: "Solo staff puede crear eventos." };

  const title = String(formData.get("title") || "").trim();
  const from = String(formData.get("date_from") || "");
  const to = String(formData.get("date_to") || from);
  const time = String(formData.get("time") || "09:00");
  if (!title) return { error: "Falta el título." };
  if (!DATE_RE.test(from) || !DATE_RE.test(to) || to < from) return { error: "Revisa las fechas." };
  if (!/^\d{2}:\d{2}$/.test(time)) return { error: "Hora inválida." };

  const dates: string[] = [];
  for (const d = new Date(`${from}T00:00:00Z`); d.toISOString().slice(0, 10) <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
    if (dates.length > MAX_DAYS) return { error: `Máximo ${MAX_DAYS} días por vez.` };
  }

  const kind = String(formData.get("kind") || "training");
  const planType = String(formData.get("plan_type") || "");
  const plan_items = String(formData.get("plan_items") || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((label) => ({ label }));

  const base = {
    team_id: profile!.team_id,
    kind,
    title,
    location: String(formData.get("location") || "") || null,
    description: String(formData.get("description") || "") || null,
    athlete_id: String(formData.get("athlete_id") || "") || null,
    plan_type: kind === "training" && planType ? planType : null,
    plan_items: plan_items.length ? plan_items : null,
  };

  // hora guardada como UTC literal: se muestra tal cual se escribió
  const rows = dates.map((date) => ({ ...base, starts_at: new Date(`${date}T${time}:00Z`).toISOString() }));
  const { error } = await supabase.from("events").insert(rows);
  if (error) return { error: error.message };

  revalidatePath("/calendario");
  return {};
}
