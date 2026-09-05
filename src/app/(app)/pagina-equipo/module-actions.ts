"use server";

import { revalidatePath } from "next/cache";
import { requireUser, isAdmin } from "@/lib/auth";

export async function setModules(hidden: string[]) {
  const { supabase, profile } = await requireUser();
  if (!isAdmin(profile)) throw new Error("Solo el administrador.");

  const { error } = await supabase.rpc("set_team_modules", { p_hidden: hidden });
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}
