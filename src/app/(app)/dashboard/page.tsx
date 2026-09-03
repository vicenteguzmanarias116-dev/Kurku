import Link from "next/link";
import { requireUser } from "@/lib/auth";

type Load = {
  athlete_id: string;
  full_name: string;
  acute: number;
  chronic: number;
};

function acwrColor(r: number) {
  if (r > 1.5) return "text-red-600"; // sobrecarga
  if (r < 0.8) return "text-amber-600"; // desentrenamiento
  return "text-green-600";
}

export default async function Dashboard() {
  const { supabase } = await requireUser();

  const [{ data: loads }, { data: events }] = await Promise.all([
    supabase.from("v_athlete_load").select("*").order("full_name"),
    supabase
      .from("events")
      .select("id, title, kind, starts_at, location")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(5),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-2 text-lg font-semibold">Carga de entrenamiento (ACWR)</h2>
        <table className="w-full max-w-xl text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="py-1">Atleta</th>
              <th>Agudo</th>
              <th>Crónico</th>
              <th>ACWR</th>
            </tr>
          </thead>
          <tbody>
            {(loads as Load[] | null)?.map((l) => {
              const acwr = l.chronic > 0 ? l.acute / l.chronic : 0;
              return (
                <tr key={l.athlete_id} className="border-t border-zinc-100">
                  <td className="py-1">{l.full_name}</td>
                  <td>{l.acute.toFixed(0)}</td>
                  <td>{l.chronic.toFixed(0)}</td>
                  <td className={acwrColor(acwr)}>
                    {acwr ? acwr.toFixed(2) : "—"}
                  </td>
                </tr>
              );
            })}
            {!loads?.length && (
              <tr>
                <td colSpan={4} className="py-2 text-zinc-400">
                  Sin datos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="mt-1 text-xs text-zinc-400">
          Verde 0.8–1.5 · Rojo &gt;1.5 sobrecarga · Ámbar &lt;0.8 poca carga.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Próximo en el calendario</h2>
        <ul className="space-y-1 text-sm">
          {events?.map((e) => (
            <li key={e.id}>
              <span className="text-zinc-500">
                {new Date(e.starts_at).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>{" "}
              — {e.title}{" "}
              <span className="text-zinc-400">
                {e.kind === "regatta" ? "· regata" : ""}
                {e.location ? ` · ${e.location}` : ""}
              </span>
            </li>
          ))}
          {!events?.length && (
            <li className="text-zinc-400">
              Nada programado. <Link href="/calendario" className="underline">Añadir</Link>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
