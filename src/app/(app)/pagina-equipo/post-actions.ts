"use server";

import { revalidatePath } from "next/cache";
import { requireUser, isStaff } from "@/lib/auth";

export async function postAnnouncement(
  _prevState: string | null,
  formData: FormData,
) {
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) return "Solo staff.";

  const body = String(formData.get("body") || "").trim();
  const attachment_urls = formData
    .getAll("attachment")
    .map((v) => String(v))
    .filter(Boolean);

  if (!body && attachment_urls.length === 0) return "Escribe algo o adjunta un archivo.";

  const { error } = await supabase.from("announcements").insert({
    team_id: profile!.team_id,
    author_id: profile!.id,
    body,
    attachment_urls,
  });
  if (error) return error.message;

  revalidatePath("/pagina-equipo");
  return null;
}
