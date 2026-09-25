import { requireUser, isStaff } from "@/lib/auth";
import PageHead from "../PageHead";
import { Card, Empty, LinkButton } from "../ui";
import AthleteRoutineView from "./AthleteRoutineView";
import type { Days, InfoSection, LogEntry } from "./types";

function weekStart(d = new Date()) {
  const day = (d.getDay() + 6) % 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  return monday.toISOString().slice(0, 10);
}

export default async function RutinaPage() {
  const { supabase, user, profile } = await requireUser();
  const staff = isStaff(profile);

  if (staff) {
    const { data: athletes } = await supabase
      .from("athletes")
      .select("id, full_name, boat_class")
      .order("full_name");

    return (
      <div className="space-y-6">
        <PageHead eyebrow="Físico" title="Rutina" subtitle="Armá la rutina semanal de cada atleta." />
        <Card>
          {!athletes?.length ? (
            <Empty title="Todavía no hay atletas en el equipo." />
          ) : (
            <ul className="divide-y divide-line">
              {athletes.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{a.full_name}</p>
                    {a.boat_class && <p className="text-xs text-ink-3">{a.boat_class}</p>}
                  </div>
                  <LinkButton href={`/rutina/${a.id}`} size="sm">
                    Editar rutina
                  </LinkButton>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    );
  }

  const { data: athlete } = await supabase
    .from("athletes")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!athlete) {
    return (
      <div className="space-y-6">
        <PageHead eyebrow="Físico" title="Rutina" />
        <Card>
          <Empty title="Tu cuenta no está vinculada a un atleta todavía." />
        </Card>
      </div>
    );
  }

  const { data: routine } = await supabase
    .from("routines")
    .select("title, subtitle, days, info")
    .eq("athlete_id", athlete.id)
    .maybeSingle<{ title: string; subtitle: string | null; days: Days; info: InfoSection[] }>();

  if (!routine) {
    return (
      <div className="space-y-6">
        <PageHead eyebrow="Físico" title="Rutina" />
        <Card>
          <Empty title="Tu coach todavía no armó tu rutina." hint="Cuando la publique, va a aparecer acá." />
        </Card>
      </div>
    );
  }

  const ws = weekStart();
  const [{ data: checkRows }, { data: logRows }] = await Promise.all([
    supabase
      .from("routine_checks")
      .select("weekday, done_indexes")
      .eq("athlete_id", athlete.id)
      .eq("week_start", ws),
    supabase
      .from("exercise_logs")
      .select("id, weekday, exercise_index, kg, reps, logged_at")
      .eq("athlete_id", athlete.id)
      .order("logged_at", { ascending: false })
      .limit(500),
  ]);

  const initialChecks: Record<number, number[]> = {};
  (checkRows ?? []).forEach((r) => {
    initialChecks[r.weekday] = r.done_indexes ?? [];
  });

  const initialLogs: Record<string, LogEntry[]> = {};
  (logRows ?? []).forEach((r) => {
    const key = `${r.weekday}-${r.exercise_index}`;
    (initialLogs[key] ??= []).push({ id: r.id, kg: r.kg, reps: r.reps, logged_at: r.logged_at });
  });

  return (
    <AthleteRoutineView
      title={routine.title}
      subtitle={routine.subtitle}
      days={routine.days ?? {}}
      info={routine.info ?? []}
      initialChecks={initialChecks}
      initialLogs={initialLogs}
    />
  );
}
