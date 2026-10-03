import Link from "next/link";
import { requireUser, isStaff } from "@/lib/auth";
import { mono, rajdhani } from "../fonts";
import PageHead from "../PageHead";
import WelcomeModal from "../WelcomeModal";
import { Card, CardHeader, Empty } from "../ui";
import { getTodayCheckinStatus } from "../today";
import ViewAllToggle from "./ViewAllToggle";

type Load = {
  athlete_id: string;
  full_name: string;
  acute: number;
  chronic: number;
};

function acwrColor(r: number) {
  if (r > 1.5) return "text-bad-text"; // sobrecarga
  if (r < 0.8) return "text-warn-text"; // desentrenamiento
  return "text-ok-text";
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { supabase, user, profile } = await requireUser();
  const { welcome } = await searchParams;

  if (!isStaff(profile)) {
    return <AthleteHome supabase={supabase} user={user} profile={profile!} welcome={welcome === "1"} />;
  }

  const today = new Date().toISOString().slice(0, 10);
  const [
    { data: loads },
    { data: events },
    { data: painToday },
    { data: activeInjuries },
  ] = await Promise.all([
    supabase.from("v_athlete_load").select("*").order("full_name"),
    supabase
      .from("events")
      .select("id, title, kind, starts_at, location")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(5),
    supabase
      .from("health_checkins")
      .select("muscle_pain, athletes(full_name)")
      .eq("checkin_date", today),
    supabase.from("injuries").select("id, body_part, athletes(full_name)").eq("status", "activa"),
  ]);

  type PainRow = { muscle_pain: Record<string, number> | null; athletes: { full_name: string } | null };
  const alerts: string[] = [];
  for (const l of (loads as Load[] | null) ?? []) {
    const r = l.chronic > 0 ? l.acute / l.chronic : 0;
    if (r > 1.5) alerts.push(`${l.full_name}: sobrecarga (ACWR ${r.toFixed(2)})`);
  }
  for (const p of (painToday as unknown as PainRow[] | null) ?? []) {
    const worst = Math.max(0, ...Object.values(p.muscle_pain ?? {}));
    if (worst >= 3) alerts.push(`${p.athletes?.full_name ?? "—"}: dolor fuerte reportado hoy`);
  }
  for (const inj of (activeInjuries as unknown as { athletes: { full_name: string } | null; body_part: string }[] | null) ?? []) {
    alerts.push(`${inj.athletes?.full_name ?? "—"}: lesión activa (${inj.body_part})`);
  }

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Flota · ILCA" title="Panel" />

      {alerts.length > 0 && (
        <Card className="border-bad/30 bg-bad-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-bad-text">
            Alertas
          </p>
          <ul className="mt-2 space-y-1 text-sm text-bad-text">
            {alerts.map((a, i) => (
              <li key={i}>⚠ {a}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <CardHeader title="Carga de entrenamiento (ACWR)" hint="Rendimiento" />

        <div className="max-w-xl overflow-x-auto">
          <table className="w-full min-w-[360px] text-sm">
            <thead className="text-left text-xs text-ink-3">
              <tr>
                <th className="py-1 font-medium">Atleta</th>
                <th className="font-medium">Agudo</th>
                <th className="font-medium">Crónico</th>
                <th className="font-medium">ACWR</th>
              </tr>
            </thead>
            <tbody>
              {(loads as Load[] | null)?.map((l) => {
                const acwr = l.chronic > 0 ? l.acute / l.chronic : 0;
                return (
                  <tr key={l.athlete_id} className="border-t border-line">
                    <td className="py-2">{l.full_name}</td>
                    <td className={`${mono.className} tabular-nums text-ink-2`}>
                      {l.acute.toFixed(0)}
                    </td>
                    <td className={`${mono.className} tabular-nums text-ink-2`}>
                      {l.chronic.toFixed(0)}
                    </td>
                    <td className={`${mono.className} tabular-nums font-semibold ${acwrColor(acwr)}`}>
                      {acwr ? acwr.toFixed(2) : "—"}
                    </td>
                  </tr>
                );
              })}
              {!loads?.length && (
                <tr>
                  <td colSpan={4} className="py-3 text-ink-3">
                    Sin datos todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-3">
          Verde 0.8–1.5 · Rojo &gt;1.5 sobrecarga · Ámbar &lt;0.8 poca carga
        </p>
      </Card>

      <Card>
        <CardHeader title="Próximo en el calendario" hint="Agenda" />
        {!events?.length ? (
          <Empty
            title="Nada programado."
            action={
              <Link href="/calendario" className="text-sm text-brand-text hover:underline">
                Añadir
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3 text-sm">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-baseline gap-x-3 border-t border-line pt-3 first:border-0 first:pt-0"
              >
                <span className="text-xs font-medium text-ink-3">
                  {new Date(e.starts_at).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <span className="font-medium text-ink">{e.title}</span>
                <span className="text-ink-3">
                  {e.kind === "regatta" ? "· regata" : ""}
                  {e.location ? ` · ${e.location}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

async function AthleteHome({
  supabase,
  user,
  profile,
  welcome,
}: {
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"];
  user: Awaited<ReturnType<typeof requireUser>>["user"];
  profile: NonNullable<Awaited<ReturnType<typeof requireUser>>["profile"]>;
  welcome: boolean;
}) {
  const { data: myAthlete } = await supabase
    .from("athletes")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();
  const myAthleteId = myAthlete?.id;

  const weekday = new Date().getDay();
  const dow = (new Date().getDay() + 6) % 7;
  const monday = new Date();
  monday.setDate(monday.getDate() - dow);
  const weekStart = monday.toISOString().slice(0, 10);

  const [checkin, { data: routine }, { data: checkRow }, { data: nextEvents }] = await Promise.all([
    getTodayCheckinStatus(supabase, profile),
    myAthleteId
      ? supabase.from("routines").select("title, days").eq("athlete_id", myAthleteId).maybeSingle()
      : Promise.resolve({ data: null }),
    myAthleteId
      ? supabase
          .from("routine_checks")
          .select("done_indexes")
          .eq("athlete_id", myAthleteId)
          .eq("week_start", weekStart)
          .eq("weekday", weekday)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("events")
      .select("id, title, kind, starts_at, athlete_id")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(5),
  ]);

  type RoutineDay = {
    kind: "gym" | "other" | "rest";
    title: string;
    focus?: string;
    notes?: string;
    exercises?: unknown[];
  };
  const todayPlan = (routine?.days as Record<string, RoutineDay> | undefined)?.[String(weekday)];
  const doneCount = checkRow?.done_indexes?.length ?? 0;
  const totalEx = todayPlan?.exercises?.length ?? 0;

  const nextEvent = (
    (nextEvents as { id: string; title: string; kind: string; starts_at: string; athlete_id: string | null }[] | null) ?? []
  ).find((e) => !e.athlete_id || e.athlete_id === myAthleteId);

  const rutinaSub = !todayPlan
    ? "Sin plan para hoy"
    : todayPlan.kind === "gym"
      ? totalEx
        ? `${doneCount} de ${totalEx} hecho`
        : todayPlan.title
      : todayPlan.title;

  const calSub = nextEvent
    ? `${nextEvent.kind === "regatta" ? "Regata" : "Entreno"} · ${new Date(nextEvent.starts_at).toLocaleDateString("es-PE", { day: "numeric", month: "short" })} · ${nextEvent.title}`
    : "Nada próximo";

  const saludSub = myAthleteId
    ? checkin.done
      ? "Hoy: listo ✓"
      : "Falta llenar hoy"
    : "No vinculado a atleta";

  return (
    <div className="space-y-6">
      <WelcomeModal show={welcome} />
      <PageHead eyebrow={new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })} title="Hoy" />

      <div className="grid gap-4 sm:grid-cols-3">
        <BigTile href="/rutina" emoji="🏋️" title="Mi rutina" subtitle={rutinaSub} />
        <BigTile href="/calendario" emoji="📅" title="Mi calendario" subtitle={calSub} />
        <BigTile href="/salud" emoji="❤️" title="Mi salud" subtitle={saludSub} highlight={myAthleteId ? !checkin.done : false} />
      </div>

      <ViewAllToggle />
    </div>
  );
}

function BigTile({
  href,
  emoji,
  title,
  subtitle,
  highlight,
}: {
  href: string;
  emoji: string;
  title: string;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} className="block">
      <Card
        className={`h-full text-center transition hover:border-brand/50 ${
          highlight ? "border-brand/40 bg-brand-soft" : ""
        }`}
      >
        <span className="text-4xl" aria-hidden>
          {emoji}
        </span>
        <p className={`${rajdhani.className} mt-2 text-xl font-bold text-ink`}>{title}</p>
        <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
      </Card>
    </Link>
  );
}
