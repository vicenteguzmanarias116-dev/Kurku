import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { mono } from "../fonts";
import PageHead from "../PageHead";
import WelcomeModal from "../WelcomeModal";
import { Card, CardHeader, Empty } from "../ui";

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

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [
    { data: loads },
    { data: events },
    { data: painToday },
    { data: activeInjuries },
    { data: myAthlete },
    { data: todayEvents },
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
    profile?.role === "athlete"
      ? supabase.from("athletes").select("id").eq("profile_id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("events")
      .select("id, title, kind, starts_at, location, athlete_id")
      .gte("starts_at", `${today}T00:00:00`)
      .lt("starts_at", `${tomorrow}T00:00:00`)
      .order("starts_at"),
  ]);

  // recordatorio de "sesiones de hoy": para todos si es de todo el equipo,
  // o solo si te lo asignaron a vos puntualmente.
  const myAthleteId = (myAthlete as { id: string } | null)?.id;
  const remindersToday = (todayEvents ?? []).filter(
    (e) => !e.athlete_id || e.athlete_id === myAthleteId,
  );

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
      <WelcomeModal show={welcome === "1"} />
      <PageHead eyebrow="Flota · ILCA" title="Panel" />

      {remindersToday.length > 0 && (
        <Card className="border-brand/30 bg-brand-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-text">
            Recordatorio · hoy
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {remindersToday.map((e) => (
              <li key={e.id}>
                <Link href={`/calendario/${e.id}`} className="text-ink hover:text-brand-text">
                  🔔{" "}
                  {new Date(e.starts_at).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                  {" — "}
                  {e.title}
                  {e.location && <span className="text-ink-3"> · {e.location}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

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
