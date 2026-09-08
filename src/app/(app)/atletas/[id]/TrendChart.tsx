import { mono } from "../../fonts";

type Row = {
  checkin_date: string;
  sleep_quality: number | null;
  mood: number | null;
  soreness_overall: number | null;
  muscle_pain: Record<string, number> | null;
};

const SERIES: { key: keyof Row; label: string; color: string }[] = [
  { key: "sleep_quality", label: "Sueño", color: "#67e8f9" },
  { key: "mood", label: "Ánimo", color: "#a3a3a3" },
  { key: "soreness_overall", label: "Dolor gral.", color: "#FF5A36" },
];

const W = 560;
const H = 120;
const PAD = 8;

function pathFor(values: (number | null)[], color: string) {
  const n = values.length;
  if (n < 2) return null;
  const step = (W - PAD * 2) / (n - 1);
  const points: string[] = [];
  values.forEach((v, i) => {
    if (v == null) return;
    const x = PAD + i * step;
    const y = H - PAD - ((v - 1) / 4) * (H - PAD * 2); // escala 1-5
    points.push(`${points.length ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
  });
  if (!points.length) return null;
  return <path key={color} d={points.join(" ")} fill="none" stroke={color} strokeWidth={2} />;
}

/** Últimos `days` check-ins de salud del atleta, como gráfico de tendencia. */
export default function TrendChart({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/30">Sin check-ins de salud todavía.</p>;
  }

  const painCounts = rows.map((r) => Object.values(r.muscle_pain ?? {}).length);
  const maxPain = Math.max(1, ...painCounts);
  const barW = (W - PAD * 2) / rows.length;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full">
        {/* líneas guía 1-5 */}
        {[1, 3, 5].map((v) => {
          const y = H - PAD - ((v - 1) / 4) * (H - PAD * 2);
          return (
            <line key={v} x1={PAD} x2={W - PAD} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
          );
        })}
        {SERIES.map((s) => pathFor(rows.map((r) => r[s.key] as number | null), s.color))}
        {/* barras de zonas con dolor, abajo */}
        {painCounts.map((c, i) => {
          const h = (c / maxPain) * 18;
          return (
            <rect
              key={i}
              x={PAD + i * barW + barW * 0.2}
              y={H + 4 + (18 - h)}
              width={barW * 0.6}
              height={h}
              fill="rgba(255,90,54,0.35)"
            />
          );
        })}
      </svg>
      <div className={`${mono.className} mt-2 flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-wider text-white/40`}>
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 bg-[#FF5A36]/35" />
          Zonas con dolor
        </span>
        <span className="ml-auto text-white/25">
          {rows[0]?.checkin_date} → {rows[rows.length - 1]?.checkin_date}
        </span>
      </div>
    </div>
  );
}
