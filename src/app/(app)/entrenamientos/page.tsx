import { requireUser, isStaff } from "@/lib/auth";
import { addSession } from "./actions";
import { mono } from "../fonts";
import PageHead from "../PageHead";

type Row = {
  id: string;
  session_date: string;
  source: string;
  duration_s: number | null;
  distance_m: number | null;
  rpe: number | null;
  tacks: number | null;
  gybes: number | null;
  athletes: { full_name: string } | null;
};

const input =
  "border border-white/15 bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40";

export default async function EntrenamientosPage() {
  const { supabase, profile } = await requireUser();
  const staff = isStaff(profile);

  const [{ data: sessions }, { data: athletes }] = await Promise.all([
    supabase
      .from("training_sessions")
      .select(
        "id, session_date, source, duration_s, distance_m, rpe, tacks, gybes, athletes(full_name)",
      )
      .order("session_date", { ascending: false })
      .limit(100),
    supabase.from("athletes").select("id, full_name").eq("active", true).order("full_name"),
  ]);

  return (
    <div className="space-y-6">
      <PageHead eyebrow="Carga · ACWR" title="Entrenamientos" />

      {staff && (
        <details className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-5">
          <summary
            className={`${mono.className} cursor-pointer text-xs uppercase tracking-wider text-cyan-300`}
          >
            Añadir sesión manual
          </summary>
          <form
            action={addSession}
            className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"
          >
            <select name="athlete_id" required className={input}>
              <option value="">Atleta…</option>
              {athletes?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name}
                </option>
              ))}
            </select>
            <input name="session_date" type="date" required className={input} />
            <input name="minutes" type="number" placeholder="min" className={input} />
            <input name="distance_m" type="number" placeholder="metros" className={input} />
            <input name="rpe" type="number" min={1} max={10} placeholder="RPE 1-10" className={input} />
            <input name="tacks" type="number" placeholder="viradas" className={input} />
            <input name="gybes" type="number" placeholder="trasluchadas" className={input} />
            <button className="cut-corner bg-[#FF5A36] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]">
              Guardar
            </button>
          </form>
          <p className={`${mono.className} mt-3 text-[10px] uppercase tracking-wider text-white/30`}>
            Importar GPX / FIT / TCX de relojes e instrumentos: siguiente fase.
          </p>
        </details>
      )}

      <div className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-6">
        <table className="w-full text-sm">
          <thead
            className={`${mono.className} text-left text-[11px] uppercase tracking-wider text-white/40`}
          >
            <tr>
              <th className="py-1 font-normal">Fecha</th>
              <th className="font-normal">Atleta</th>
              <th className="font-normal">Origen</th>
              <th className="font-normal">Min</th>
              <th className="font-normal">Dist</th>
              <th className="font-normal">RPE</th>
              <th className="font-normal">Vir/Tras</th>
            </tr>
          </thead>
          <tbody>
            {(sessions as Row[] | null)?.map((s) => (
              <tr key={s.id} className="border-t border-white/10">
                <td className="py-2 tabular-nums text-white/70">{s.session_date}</td>
                <td>{s.athletes?.full_name ?? "—"}</td>
                <td className="text-white/30">{s.source}</td>
                <td className="tabular-nums text-white/70">
                  {s.duration_s ? Math.round(s.duration_s / 60) : "—"}
                </td>
                <td className="tabular-nums text-white/70">
                  {s.distance_m ? `${(s.distance_m / 1000).toFixed(1)} km` : "—"}
                </td>
                <td className="tabular-nums text-white/70">{s.rpe ?? "—"}</td>
                <td className="tabular-nums text-white/70">
                  {s.tacks ?? "—"}/{s.gybes ?? "—"}
                </td>
              </tr>
            ))}
            {!sessions?.length && (
              <tr>
                <td colSpan={7} className="py-3 text-white/30">
                  Sin sesiones todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
