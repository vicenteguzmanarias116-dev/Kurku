import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export type Profile = {
  id: string;
  team_id: string | null;
  role: "admin" | "coach" | "athlete";
  full_name: string | null;
};

/** Usuario + profile, o redirige a /login. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, team_id, role, full_name")
    .eq("id", user.id)
    .single<Profile>();

  return { supabase, user, profile };
}

export const isStaff = (p?: Profile | null) =>
  p?.role === "admin" || p?.role === "coach";
