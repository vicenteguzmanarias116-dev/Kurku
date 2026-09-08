import { requireUser, isStaff } from "@/lib/auth";
import { mono } from "../fonts";
import PageHead from "../PageHead";
import CheckinForm from "./CheckinForm";
import ExportButton from "../ExportButton";

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
        <p className="text-sm text-white/30">
          Tu cuenta no está vinculada a un atleta todavía.
        </p>
      )}

      {staff && (
        <div className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className={`${mono.className} block text-[11px] uppercase tracking-widest text-cyan-300`}>
              Equipo hoy
            </span>
            <ExportButton type="salud" label="Exportar historial CSV" />
          </div>
          {!teamToday?.length ? (
            <p className="text-sm text-white/30">Nadie llenó el check-in todavía.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className={`${mono.className} text-left text-[11px] uppercase tracking-wider text-white/40`}>
                <tr>
                  <th className="py-1 font-normal">Atleta</th>
                  <th className="font-normal">Sueño</th>
                  <th className="font-normal">Ánimo</th>
                  <th className="font-normal">Dolor gral.</th>
                  <th className="font-normal">Zonas con dolor</th>
                </tr>
              </thead>
              <tbody>
                {(teamToday as unknown as CheckinRow[]).map((c) => {
                  const painCount = Object.values(c.muscle_pain ?? {}).length;
                  return (
                    <tr key={c.athlete_id} className="border-t border-white/10">
                      <td className="py-2">{c.athletes?.full_name ?? "—"}</td>
                      <td className="text-white/70">
                        {c.sleep_hours ?? "—"}h · {c.sleep_quality ?? "—"}/5
                      </td>
                      <td className="text-white/70">{c.mood ?? "—"}/5</td>
                      <td className="text-white/70">{c.soreness_overall ?? "—"}/5</td>
                      <td className={painCount ? "text-[#FF5A36]" : "text-white/30"}>
                        {painCount || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
