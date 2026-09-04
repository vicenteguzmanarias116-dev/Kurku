import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { rajdhani, mono } from "../fonts";

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
    <div className="space-y-6">
      <section className="cut-corner border border-cyan-400/20 bg-[#0D141E] p-6">
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

      <section className="cut-corner border border-cyan-400/20 bg-[#0D141E] p-6">
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
