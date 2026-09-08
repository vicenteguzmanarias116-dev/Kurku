import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { rajdhani, mono } from "../fonts";
import PageHead from "../PageHead";
import WelcomeModal from "../WelcomeModal";

type Load = {
  athlete_id: string;
  full_name: string;
  acute: number;
  chronic: number;
};

function acwrColor(r: number) {
  if (r > 1.5) return "text-red-400"; // sobrecarga
  if (r < 0.8) return "text-amber-400"; // desentrenamiento
  return "text-emerald-400";
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
        <section className="rounded-xl border border-[#FF5A36]/30 bg-[#FF5A36]/[0.06] p-5">
          <span className={`${mono.className} block text-[11px] uppercase tracking-widest text-[#FF5A36]`}>
            Recordatorio · hoy
          </span>
          <ul className="mt-2 space-y-1.5 text-sm">
            {remindersToday.map((e) => (
              <li key={e.id}>
                <Link href={`/calendario/${e.id}`} className="text-white/90 hover:text-[#FF5A36]">
                  🔔{" "}
                  {new Date(e.starts_at).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                  {" — "}
                  {e.title}
                  {e.location && <span className="text-white/40"> · {e.location}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {alerts.length > 0 && (
        <section className="rounded-xl border border-red-400/30 bg-red-400/[0.06] p-5">
          <span className={`${mono.className} block text-[11px] uppercase tracking-widest text-red-400`}>
            Alertas
          </span>
          <ul className="mt-2 space-y-1 text-sm text-red-200">
            {alerts.map((a, i) => (
              <li key={i}>⚠ {a}</li>
            ))}
          </ul>
        </section>
      )}
      <section className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-6">
        <span
          className={`${mono.className} block text-[11px] uppercase tracking-widest text-cyan-300`}
        >
          Rendimiento
        </span>
        <h2
          className={`${rajdhani.className} mt-1 text-2xl font-bold uppercase tracking-tight`}
        >
          Carga de entrenamiento (ACWR)
        </h2>

        <table className="mt-5 w-full max-w-xl text-sm">
          <thead
            className={`${mono.className} text-left text-[11px] uppercase tracking-wider text-white/40`}
          >
            <tr>
              <th className="py-1 font-normal">Atleta</th>
              <th className="font-normal">Agudo</th>
              <th className="font-normal">Crónico</th>
              <th className="font-normal">ACWR</th>
            </tr>
          </thead>
          <tbody>
            {(loads as Load[] | null)?.map((l) => {
              const acwr = l.chronic > 0 ? l.acute / l.chronic : 0;
              return (
                <tr key={l.athlete_id} className="border-t border-white/10">
                  <td className="py-2">{l.full_name}</td>
                  <td className="tabular-nums text-white/70">
                    {l.acute.toFixed(0)}
                  </td>
                  <td className="tabular-nums text-white/70">
                    {l.chronic.toFixed(0)}
                  </td>
                  <td className={`tabular-nums font-semibold ${acwrColor(acwr)}`}>
                    {acwr ? acwr.toFixed(2) : "—"}
                  </td>
                </tr>
              );
            })}
            {!loads?.length && (
              <tr>
                <td colSpan={4} className="py-3 text-white/30">
                  Sin datos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className={`${mono.className} mt-3 text-[10px] uppercase tracking-wider text-white/30`}>
          Verde 0.8–1.5 · Rojo &gt;1.5 sobrecarga · Ámbar &lt;0.8 poca carga
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-6">
        <span
          className={`${mono.className} block text-[11px] uppercase tracking-widest text-cyan-300`}
        >
          Agenda
        </span>
        <h2
          className={`${rajdhani.className} mt-1 text-2xl font-bold uppercase tracking-tight`}
        >
          Próximo en el calendario
        </h2>
        <ul className="mt-5 space-y-3 text-sm">
          {events?.map((e) => (
            <li
              key={e.id}
              className="flex flex-wrap items-baseline gap-x-3 border-t border-white/10 pt-3 first:border-0 first:pt-0"
            >
              <span className={`${mono.className} text-xs uppercase tracking-wider text-cyan-300`}>
                {new Date(e.starts_at).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
              <span className="font-medium">{e.title}</span>
              <span className="text-white/40">
                {e.kind === "regatta" ? "· regata" : ""}
                {e.location ? ` · ${e.location}` : ""}
              </span>
            </li>
          ))}
          {!events?.length && (
            <li className="text-white/30">
              Nada programado.{" "}
              <Link href="/calendario" className="text-cyan-300 hover:underline">
                Añadir
              </Link>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
