import { requireUser, isStaff } from "@/lib/auth";
import { rajdhani } from "../fonts";
import PageHead from "../PageHead";
import { addInjury, setStatus } from "./actions";
import ExportButton from "../ExportButton";
import { Card, Select, Input, Button, Badge, Empty } from "../ui";

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

const STATUS_LABEL: Record<Injury["status"], string> = {
  activa: "Activa",
  recuperando: "Recuperando",
  de_alta: "De alta",
};
const STATUS_TONE: Record<Injury["status"], "bad" | "warn" | "ok"> = {
  activa: "bad",
  recuperando: "warn",
  de_alta: "ok",
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
      <div className="flex items-end justify-between gap-4">
        <PageHead
          eyebrow="Prevención"
          title="Lesiones"
          subtitle={staff ? "Registro y seguimiento del equipo." : "Tu historial de lesiones."}
        />
        {staff && (
          <div className="mb-7 shrink-0">
            <ExportButton type="lesiones" />
          </div>
        )}
      </div>

      {staff && (
        <details className="rounded-xl border border-line bg-surface p-5">
          <summary className="cursor-pointer text-sm font-medium text-brand-text">
            Registrar lesión
          </summary>
          <form action={addInjury} className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Select name="athlete_id" required>
              <option value="">Atleta…</option>
              {athletes?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name}
                </option>
              ))}
            </Select>
            <Input name="body_part" placeholder="Zona (ej. hombro derecho)" required />
            <Input name="severity" type="number" min={1} max={5} placeholder="Gravedad 1-5" />
            <Input name="reported_date" type="date" />
            <Input name="expected_return" type="date" placeholder="Retorno estimado" />
            <Input name="description" placeholder="Diagnóstico / detalle" className="col-span-2 sm:col-span-2" />
            <Button type="submit" variant="primary" size="sm">
              Guardar
            </Button>
          </form>
        </details>
      )}

      <Card>
        {!visible.length ? (
          <Empty title="Sin lesiones registradas." />
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((inj) => (
              <li key={inj.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Badge tone={STATUS_TONE[inj.status]}>{STATUS_LABEL[inj.status]}</Badge>
                <span className="min-w-0 flex-1">
                  <span className={`${rajdhani.className} font-bold text-ink`}>
                    {staff ? `${inj.athletes?.full_name ?? "—"} · ` : ""}
                    {inj.body_part}
                  </span>
                  {inj.description && <span className="text-ink-2"> — {inj.description}</span>}
                  <div className="text-xs text-ink-3">
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
                        className="rounded-lg border border-warn/40 px-2 py-1 text-xs text-warn-text hover:bg-warn-soft"
                      >
                        marcar recuperando
                      </button>
                    )}
                    <button
                      name="status"
                      value="de_alta"
                      className="rounded-lg border border-ok/40 px-2 py-1 text-xs text-ok-text hover:bg-ok-soft"
                    >
                      dar de alta
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
