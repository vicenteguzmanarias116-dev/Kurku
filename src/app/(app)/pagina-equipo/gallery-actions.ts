"use server";

import { revalidatePath } from "next/cache";
import { requireUser, isAdmin } from "@/lib/auth";

export async function setGallery(urls: string[]) {
  const { supabase, profile } = await requireUser();
  if (!isAdmin(profile)) throw new Error("Solo el administrador.");

  const { error } = await supabase.rpc("set_team_gallery", { p_urls: urls });
  if (error) throw new Error(error.message);

  revalidatePath("/pagina-equipo");
}
