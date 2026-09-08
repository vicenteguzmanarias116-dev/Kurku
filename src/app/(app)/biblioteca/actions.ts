"use server";

import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";

export async function addFolder(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Falta nombre.");
  const { error } = await supabase.from("library_folders").insert({
    team_id: profile!.team_id,
    name,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/biblioteca");
}

export async function deleteFolder(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  await supabase.from("library_folders").delete().eq("id", String(formData.get("id")));
  revalidatePath("/biblioteca");
}

export async function addDocument(data: { title: string; file_url: string; folder_id: string | null }) {
  const { supabase, user, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  const { error } = await supabase.from("library_documents").insert({
    team_id: profile!.team_id,
    folder_id: data.folder_id,
    title: data.title,
    file_url: data.file_url,
    uploaded_by: user.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/biblioteca");
}

export async function deleteDocument(formData: FormData) {
  "use server";
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) throw new Error("Solo staff.");
  await supabase.from("library_documents").delete().eq("id", String(formData.get("id")));
  revalidatePath("/biblioteca");
}
