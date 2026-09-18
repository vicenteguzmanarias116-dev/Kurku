import { requireUser, isStaff } from "@/lib/auth";
import PageHead from "../PageHead";
import CheckinForm from "./CheckinForm";
import ExportButton from "../ExportButton";
import { Card, CardHeader, Empty } from "../ui";

type CheckinRow = {
  athlete_id: string;
  sleep_hours: number | null;
  sleep_quality: number | null;
  mood: number | null;
  soreness_overall: number | null;
  notes: string | null;
  muscle_pain: Record<string, number> | null;
  athletes: { full_name: string } | null;
};

export default async function SaludPage() {
  const { supabase, user, profile } = await requireUser();
  const staff = isStaff(profile);
  const today = new Date().toISOString().slice(0, 10);

  const { data: myAthlete } = await supabase
    .from("athletes")
    .select("id, full_name")
    .eq("profile_id", user.id)
    .maybeSingle();

  const { data: myCheckin } = myAthlete
    ? await supabase
        .from("health_checkins")
        .select("sleep_hours, sleep_quality, mood, soreness_overall, notes, muscle_pain")
        .eq("athlete_id", myAthlete.id)
        .eq("checkin_date", today)
        .maybeSingle()
    : { data: null };

  const { data: teamToday } = staff
    ? await supabase
        .from("health_checkins")
        .select(
          "athlete_id, sleep_hours, sleep_quality, mood, soreness_overall, notes, muscle_pain, athletes(full_name)",
        )
        .eq("checkin_date", today)
    : { data: null };

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="Bienestar"
        title="Salud"
        subtitle="Check-in diario: sueño, ánimo y mapa de dolor muscular."
      />

      {myAthlete && (
        <CheckinForm athleteId={myAthlete.id} existing={myCheckin as CheckinRow | null} />
      )}

      {!myAthlete && !staff && (
        <p className="text-sm text-ink-3">
          Tu cuenta no está vinculada a un atleta todavía.
        </p>
      )}

      {staff && (
        <Card>
          <CardHeader title="Equipo hoy" action={<ExportButton type="salud" label="Exportar historial CSV" />} />
          {!teamToday?.length ? (
            <Empty title="Nadie llenó el check-in todavía." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="text-left text-xs text-ink-3">
                  <tr>
                    <th className="py-1 font-medium">Atleta</th>
                    <th className="font-medium">Sueño</th>
                    <th className="font-medium">Ánimo</th>
                    <th className="font-medium">Dolor gral.</th>
                    <th className="font-medium">Zonas con dolor</th>
                  </tr>
                </thead>
                <tbody>
                  {(teamToday as unknown as CheckinRow[]).map((c) => {
                    const painCount = Object.values(c.muscle_pain ?? {}).length;
                    return (
                      <tr key={c.athlete_id} className="border-t border-line">
                        <td className="py-2">{c.athletes?.full_name ?? "—"}</td>
                        <td className="text-ink-2">
                          {c.sleep_hours ?? "—"}h · {c.sleep_quality ?? "—"}/5
                        </td>
                        <td className="text-ink-2">{c.mood ?? "—"}/5</td>
                        <td className="text-ink-2">{c.soreness_overall ?? "—"}/5</td>
                        <td className={painCount ? "text-brand-text" : "text-ink-3"}>
                          {painCount || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
