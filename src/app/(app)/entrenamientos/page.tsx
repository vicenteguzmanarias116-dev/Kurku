import { requireUser, isStaff } from "@/lib/auth";
import { addSession } from "./actions";
import PageHead from "../PageHead";
import ExportButton from "../ExportButton";
import { Card, Select, Input, Button, Empty } from "../ui";

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
      <div className="flex items-end justify-between gap-4">
        <PageHead eyebrow="Carga · ACWR" title="Entrenamientos" />
        {staff && (
          <div className="mb-7 shrink-0">
            <ExportButton type="entrenamientos" />
          </div>
        )}
      </div>

      {staff && (
        <details className="rounded-xl border border-line bg-surface p-5">
          <summary className="cursor-pointer text-sm font-medium text-brand-text">
            Añadir sesión manual
          </summary>
          <form
            action={addSession}
            className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"
          >
            <Select name="athlete_id" required>
              <option value="">Atleta…</option>
              {athletes?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name}
                </option>
              ))}
            </Select>
            <Input name="session_date" type="date" required />
            <Input name="minutes" type="number" placeholder="min" />
            <Input name="distance_m" type="number" placeholder="metros" />
            <Input name="rpe" type="number" min={1} max={10} placeholder="RPE 1-10" />
            <Input name="tacks" type="number" placeholder="viradas" />
            <Input name="gybes" type="number" placeholder="trasluchadas" />
            <Button type="submit" variant="primary" size="sm">
              Guardar
            </Button>
          </form>
          <p className="mt-3 text-xs text-ink-3">
            Importar GPX / FIT / TCX de relojes e instrumentos: siguiente fase.
          </p>
        </details>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="text-left text-xs text-ink-3">
            <tr>
              <th className="py-1 font-medium">Fecha</th>
              <th className="font-medium">Atleta</th>
              <th className="font-medium">Origen</th>
              <th className="font-medium">Min</th>
              <th className="font-medium">Dist</th>
              <th className="font-medium">RPE</th>
              <th className="font-medium">Vir/Tras</th>
            </tr>
          </thead>
          <tbody>
            {(sessions as Row[] | null)?.map((s) => (
              <tr key={s.id} className="border-t border-line">
                <td className="py-2 tabular-nums text-ink-2">{s.session_date}</td>
                <td>{s.athletes?.full_name ?? "—"}</td>
                <td className="text-ink-3">{s.source}</td>
                <td className="tabular-nums text-ink-2">
                  {s.duration_s ? Math.round(s.duration_s / 60) : "—"}
                </td>
                <td className="tabular-nums text-ink-2">
                  {s.distance_m ? `${(s.distance_m / 1000).toFixed(1)} km` : "—"}
                </td>
                <td className="tabular-nums text-ink-2">{s.rpe ?? "—"}</td>
                <td className="tabular-nums text-ink-2">
                  {s.tacks ?? "—"}/{s.gybes ?? "—"}
                </td>
              </tr>
            ))}
            {!sessions?.length && (
              <tr>
                <td colSpan={7}>
                  <Empty title="Sin sesiones todavía." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
