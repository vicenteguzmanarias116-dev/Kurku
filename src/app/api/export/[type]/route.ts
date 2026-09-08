import { NextResponse } from "next/server";
import { requireUser, isStaff } from "@/lib/auth";

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => escape(row[h])).join(","));
  return lines.join("\n");
}

function csvResponse(filename: string, rows: Record<string, unknown>[]) {
  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const { supabase, profile } = await requireUser();
  if (!isStaff(profile)) {
    return NextResponse.json({ error: "Solo staff." }, { status: 403 });
  }
  const teamId = profile!.team_id;

  switch (type) {
    case "atletas": {
      const { data } = await supabase
        .from("athletes")
        .select("full_name, boat_class, birthdate, weight_kg, active")
        .eq("team_id", teamId)
        .order("full_name");
      return csvResponse("atletas.csv", data ?? []);
    }
    case "entrenamientos": {
      const { data } = await supabase
        .from("training_sessions")
        .select("session_date, source, duration_s, distance_m, rpe, tacks, gybes, athletes(full_name)")
        .eq("team_id", teamId)
        .order("session_date", { ascending: false });
      const rows = (data ?? []).map((r) => ({
        fecha: r.session_date,
        atleta: (r.athletes as unknown as { full_name: string } | null)?.full_name ?? "",
        origen: r.source,
        minutos: r.duration_s ? Math.round(r.duration_s / 60) : "",
        distancia_m: r.distance_m ?? "",
        rpe: r.rpe ?? "",
        viradas: r.tacks ?? "",
        trasluchadas: r.gybes ?? "",
      }));
      return csvResponse("entrenamientos.csv", rows);
    }
    case "salud": {
      const { data } = await supabase
        .from("health_checkins")
        .select("checkin_date, sleep_hours, sleep_quality, mood, soreness_overall, muscle_pain, athletes(full_name)")
        .eq("team_id", teamId)
        .order("checkin_date", { ascending: false });
      const rows = (data ?? []).map((r) => ({
        fecha: r.checkin_date,
        atleta: (r.athletes as unknown as { full_name: string } | null)?.full_name ?? "",
        horas_sueno: r.sleep_hours ?? "",
        calidad_sueno: r.sleep_quality ?? "",
        animo: r.mood ?? "",
        dolor_general: r.soreness_overall ?? "",
        zonas_con_dolor: Object.keys(r.muscle_pain ?? {}).join("; "),
      }));
      return csvResponse("salud.csv", rows);
    }
    case "lesiones": {
      const { data } = await supabase
        .from("injuries")
        .select("reported_date, body_part, severity, status, expected_return, description, athletes(full_name)")
        .eq("team_id", teamId)
        .order("reported_date", { ascending: false });
      const rows = (data ?? []).map((r) => ({
        fecha: r.reported_date,
        atleta: (r.athletes as unknown as { full_name: string } | null)?.full_name ?? "",
        zona: r.body_part,
        gravedad: r.severity ?? "",
        estado: r.status,
        retorno_estimado: r.expected_return ?? "",
        detalle: r.description ?? "",
      }));
      return csvResponse("lesiones.csv", rows);
    }
    default:
      return NextResponse.json({ error: "Tipo de reporte inválido." }, { status: 400 });
  }
}
