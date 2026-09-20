import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "@/lib/auth";

export async function getTodayCheckinStatus(
  supabase: SupabaseClient,
  profile: Profile
): Promise<{ athleteId: string | null; done: boolean }> {
  if (profile.role !== "athlete") return { athleteId: null, done: true };
  const { data: myAthlete } = await supabase
    .from("athletes")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();
  if (!myAthlete) return { athleteId: null, done: true };

  const today = new Date().toISOString().slice(0, 10);
  const { data: checkin } = await supabase
    .from("health_checkins")
    .select("id")
    .eq("athlete_id", myAthlete.id)
    .eq("checkin_date", today)
    .maybeSingle();

  return { athleteId: myAthlete.id, done: !!checkin };
}
