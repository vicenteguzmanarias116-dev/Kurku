import { requireUser, isStaff } from "@/lib/auth";
import { mono, rajdhani } from "../fonts";
import PageHead from "../PageHead";
import { addInjury, setStatus } from "./actions";

type Injury = {
  id: string;
  athlete_id: string;
  body_part: string;
  description: string | null;
  severity: number | null;
  status: "activa" | "recuperando" | "de_alta";
  reported_date: string;
  expected_return: string | null;
  athletes: { full_name: string } | null;
};

const input =
  "border border-white/15 bg-black/30 px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40";

const STATUS_LABEL: Record<Injury["status"], string> = {
  activa: "Activa",
  recuperando: "Recuperando",
  de_alta: "De alta",
};
const STATUS_COLOR: Record<Injury["status"], string> = {
  activa: "text-red-400 border-red-400/40",
  recuperando: "text-amber-400 border-amber-400/40",
  de_alta: "text-emerald-400 border-emerald-400/40",
};

export default async function LesionesPage() {
  const { supabase, profile, user } = await requireUser();
  const staff = isStaff(profile);

  const [{ data: injuries }, { data: athletes }] = await Promise.all([
    supabase
      .from("injuries")
      .select(
        "id, athlete_id, body_part, description, severity, status, reported_date, expected_return, athletes(full_name)",
      )
      .order("reported_date", { ascending: false }),
    staff
      ? supabase.from("athletes").select("id, full_name").eq("active", true).order("full_name")
      : Promise.resolve({ data: null }),
  ]);

  // RLS ya filtra: staff ve todo el equipo, el atleta solo lo suyo.
  const visible = (injuries as unknown as Injury[] | null) ?? [];

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="Prevención"
        title="Lesiones"
        subtitle={staff ? "Registro y seguimiento del equipo." : "Tu historial de lesiones."}
      />

      {staff && (
        <details className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-5">
          <summary className={`${mono.className} cursor-pointer text-xs uppercase tracking-wider text-cyan-300`}>
            Registrar lesión
          </summary>
          <form action={addInjury} className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <select name="athlete_id" required className={input}>
              <option value="">Atleta…</option>
              {athletes?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name}
                </option>
              ))}
            </select>
            <input name="body_part" placeholder="Zona (ej. hombro derecho)" required className={input} />
            <input name="severity" type="number" min={1} max={5} placeholder="Gravedad 1-5" className={input} />
            <input name="reported_date" type="date" className={input} />
            <input name="expected_return" type="date" placeholder="Retorno estimado" className={input} />
            <input name="description" placeholder="Diagnóstico / detalle" className={`${input} col-span-2 sm:col-span-2`} />
            <button className="cut-corner bg-[#FF5A36] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]">
              Guardar
            </button>
          </form>
        </details>
      )}

      <div className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-6">
        {!visible.length ? (
          <p className="text-sm text-white/30">Sin lesiones registradas.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {visible.map((inj) => (
              <li key={inj.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span
                  className={`${mono.className} border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_COLOR[inj.status]}`}
                >
                  {STATUS_LABEL[inj.status]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`${rajdhani.className} font-bold`}>
                    {staff ? `${inj.athletes?.full_name ?? "—"} · ` : ""}
                    {inj.body_part}
                  </span>
                  {inj.description && <span className="text-white/40"> — {inj.description}</span>}
                  <div className={`${mono.className} text-[10px] uppercase tracking-wider text-white/30`}>
                    reportada {inj.reported_date}
                    {inj.expected_return && ` · retorno estimado ${inj.expected_return}`}
                    {inj.severity && ` · gravedad ${inj.severity}/5`}
                  </div>
                </span>
                {staff && inj.status !== "de_alta" && (
                  <form action={setStatus} className="flex gap-1.5">
                    <input type="hidden" name="id" value={inj.id} />
                    {inj.status === "activa" && (
                      <button
                        name="status"
                        value="recuperando"
                        className="border border-amber-400/40 px-2 py-1 text-xs text-amber-400 hover:bg-amber-400/10"
                      >
                        marcar recuperando
                      </button>
                    )}
                    <button
                      name="status"
                      value="de_alta"
                      className="border border-emerald-400/40 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-400/10"
                    >
                      dar de alta
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
