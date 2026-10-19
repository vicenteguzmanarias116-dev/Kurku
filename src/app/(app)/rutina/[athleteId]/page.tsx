import { notFound, redirect } from "next/navigation";
import { requireUser, isStaff } from "@/lib/auth";
import RoutineEditor from "../RoutineEditor";
import type { Days, InfoSection } from "../types";
import { ROUTINE_TEMPLATE } from "../template";

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

  // sin rutina, o rutina vacía (sin ejercicios ni secciones): se ofrece la plantilla
  const hasContent =
    !!routine &&
    (routine.info?.length > 0 ||
      Object.values(routine.days ?? {}).some((d) => d?.kind === "gym" && (d.exercises?.length ?? 0) > 0));
  const isNew = !hasContent;

  return (
    <RoutineEditor
      athleteId={athleteId}
      athleteName={athlete.full_name}
      isNew={isNew}
      initial={
        isNew
          ? { ...ROUTINE_TEMPLATE, title: routine?.title ?? ROUTINE_TEMPLATE.title }
          : {
              title: routine.title,
              subtitle: routine.subtitle ?? "",
              days: routine.days,
              info: routine.info ?? [],
            }
      }
    />
  );
}
