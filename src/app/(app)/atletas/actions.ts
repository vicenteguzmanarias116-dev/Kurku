"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, isStaff } from "@/lib/auth";

function num(v: FormDataEntryValue | null) {
  const n = parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : null;
}

export async function saveAthlete(_prevState: string | null, formData: FormData) {
  const { supabase, profile } = await requireUser();
  const id = String(formData.get("id") || "");
  if (!isStaff(profile) && id === "nuevo") return "Solo staff.";
  const birthdate = String(formData.get("birthdate") || "").trim();
  const row = {
    team_id: profile!.team_id,
    full_name: String(formData.get("full_name") || "").trim(),
    boat_class: String(formData.get("boat_class") || "") || null,
    birthdate: birthdate || null,
    weight_kg: num(formData.get("weight_kg")),
    photo_url: String(formData.get("photo_url") || "") || null,
    notes: String(formData.get("notes") || "") || null,
    active: formData.get("active") === "on",
  };
  if (!row.full_name) return "Falta el nombre.";

  const q =
    id && id !== "nuevo"
      ? supabase.from("athletes").update(row).eq("id", id)
      : supabase.from("athletes").insert(row);
  const { error } = await q;
  if (error) return error.message;

  revalidatePath("/atletas");
  redirect("/atletas");
}

export async function deleteAthlete(formData: FormData) {
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("athletes").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/atletas");
  redirect("/atletas");
}
