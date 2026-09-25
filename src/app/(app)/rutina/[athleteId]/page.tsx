import { notFound, redirect } from "next/navigation";
import { requireUser, isStaff } from "@/lib/auth";
import RoutineEditor from "../RoutineEditor";
import type { Days, InfoSection } from "../types";

export default async function EditRoutinePage({
  params,
}: {
  params: Promise<{ athleteId: string }>;
}) {
  const { athleteId } = await params;
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) redirect("/rutina");

  const { data: athlete } = await supabase
    .from("athletes")
    .select("id, full_name")
    .eq("id", athleteId)
    .eq("team_id", profile!.team_id)
    .maybeSingle();
  if (!athlete) notFound();

  const { data: routine } = await supabase
    .from("routines")
    .select("title, subtitle, days, info")
    .eq("athlete_id", athleteId)
    .maybeSingle<{ title: string; subtitle: string | null; days: Days; info: InfoSection[] }>();

  return (
    <RoutineEditor
      athleteId={athleteId}
      athleteName={athlete.full_name}
      initial={{
        title: routine?.title ?? "Mi rutina",
        subtitle: routine?.subtitle ?? "",
        days: routine?.days ?? {},
        info: routine?.info ?? [],
      }}
    />
  );
}
