import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export const PREVIEW_ROLES = ["coach", "fisico", "nutricionista", "athlete"] as const;
const PREVIEW_COOKIE = "kurku_preview_role";

export type Profile = {
  id: string;
  team_id: string | null;
  role: "admin" | "coach" | "fisico" | "nutricionista" | "athlete";
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

/** Usuario + profile, o redirige a /login. */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, team_id, role, full_name, avatar_url, bio")
    .eq("id", user.id)
    .single<Profile>();

  if (profileError) {
    console.error("[kurku] requireUser profile fetch failed", profileError);
  }

  // vista previa: solo el admin real puede "verse" como otro rol, y solo
  // para pintar la UI (el acceso real a los datos lo sigue decidiendo RLS
  // con el rol de verdad, esto nunca toca la base).
  let previewRole: Profile["role"] | null = null;
  if (profile?.role === "admin") {
    const cookieStore = await cookies();
    const raw = cookieStore.get(PREVIEW_COOKIE)?.value;
    if (raw && (PREVIEW_ROLES as readonly string[]).includes(raw)) {
      previewRole = raw as Profile["role"];
    }
  }

  return {
    supabase,
    user,
    profile: previewRole && profile ? { ...profile, role: previewRole } : profile,
    realProfile: profile,
    previewRole,
  };
}

export const isStaff = (p?: Profile | null) =>
  p?.role === "admin" ||
  p?.role === "coach" ||
  p?.role === "fisico" ||
  p?.role === "nutricionista";

export const isAdmin = (p?: Profile | null) => p?.role === "admin";
