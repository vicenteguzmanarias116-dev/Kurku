import { requireUser, isStaff } from "@/lib/auth";
import { addSession } from "./actions";

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
      <h2 className="text-lg font-semibold">Entrenamientos</h2>

      {staff && (
        <details className="rounded border border-zinc-200 p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Añadir sesión manual
          </summary>
          <form
            action={addSession}
            className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"
          >
            <select name="athlete_id" required className="rounded border border-zinc-300 px-2 py-1.5">
              <option value="">Atleta…</option>
              {athletes?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name}
                </option>
              ))}
            </select>
            <input name="session_date" type="date" required className="rounded border border-zinc-300 px-2 py-1.5" />
            <input name="minutes" type="number" placeholder="min" className="rounded border border-zinc-300 px-2 py-1.5" />
            <input name="distance_m" type="number" placeholder="metros" className="rounded border border-zinc-300 px-2 py-1.5" />
            <input name="rpe" type="number" min={1} max={10} placeholder="RPE 1-10" className="rounded border border-zinc-300 px-2 py-1.5" />
            <input name="tacks" type="number" placeholder="viradas" className="rounded border border-zinc-300 px-2 py-1.5" />
            <input name="gybes" type="number" placeholder="trasluchadas" className="rounded border border-zinc-300 px-2 py-1.5" />
            <button className="rounded bg-zinc-900 px-3 py-1.5 text-white">Guardar</button>
          </form>
          <p className="mt-2 text-xs text-zinc-400">
            Importar GPX / FIT / TCX de relojes e instrumentos: siguiente fase.
          </p>
        </details>
      )}

      <table className="w-full text-sm">
        <thead className="text-left text-zinc-500">
          <tr>
            <th className="py-1">Fecha</th>
            <th>Atleta</th>
            <th>Origen</th>
            <th>Min</th>
            <th>Dist</th>
            <th>RPE</th>
            <th>Vir/Tras</th>
          </tr>
        </thead>
        <tbody>
          {(sessions as Row[] | null)?.map((s) => (
            <tr key={s.id} className="border-t border-zinc-100">
              <td className="py-1.5">{s.session_date}</td>
              <td>{s.athletes?.full_name ?? "—"}</td>
              <td className="text-zinc-400">{s.source}</td>
              <td>{s.duration_s ? Math.round(s.duration_s / 60) : "—"}</td>
              <td>{s.distance_m ? `${(s.distance_m / 1000).toFixed(1)} km` : "—"}</td>
              <td>{s.rpe ?? "—"}</td>
              <td>
                {s.tacks ?? "—"}/{s.gybes ?? "—"}
              </td>
            </tr>
          ))}
          {!sessions?.length && (
            <tr>
              <td colSpan={7} className="py-3 text-zinc-400">
                Sin sesiones todavía.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
