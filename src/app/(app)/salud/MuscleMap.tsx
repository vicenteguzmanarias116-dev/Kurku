"use client";

type Level = 0 | 1 | 2 | 3;

const COLORS: Record<Level, string> = {
  0: "rgba(255,255,255,0.06)",
  1: "#eab308", // leve
  2: "#f97316", // moderado
  3: "#ef4444", // fuerte
};
const STROKE: Record<Level, string> = {
  0: "rgba(255,255,255,0.15)",
  1: "#eab308",
  2: "#f97316",
  3: "#ef4444",
};

/** Bloques de un muñeco simplificado: no es anatomía real, son zonas
 * clickeables reconocibles (torso, brazos, piernas...) en dos vistas. */
const FRONT: { id: string; label: string; x: number; y: number; w: number; h: number; rx?: number }[] = [
  { id: "cuello", label: "Cuello", x: 90, y: 42, w: 20, h: 14 },
  { id: "hombro_izq", label: "Hombro izquierdo", x: 48, y: 58, w: 26, h: 18, rx: 8 },
  { id: "hombro_der", label: "Hombro derecho", x: 126, y: 58, w: 26, h: 18, rx: 8 },
  { id: "pecho", label: "Pecho", x: 76, y: 58, w: 48, h: 34, rx: 6 },
  { id: "biceps_izq", label: "Bíceps izquierdo", x: 38, y: 78, w: 18, h: 40, rx: 8 },
  { id: "biceps_der", label: "Bíceps derecho", x: 144, y: 78, w: 18, h: 40, rx: 8 },
  { id: "abdomen", label: "Abdomen", x: 80, y: 94, w: 40, h: 38, rx: 6 },
  { id: "antebrazo_izq", label: "Antebrazo izquierdo", x: 34, y: 120, w: 16, h: 36, rx: 7 },
  { id: "antebrazo_der", label: "Antebrazo derecho", x: 150, y: 120, w: 16, h: 36, rx: 7 },
  { id: "cuadriceps_izq", label: "Cuádriceps izquierdo", x: 78, y: 134, w: 22, h: 56, rx: 8 },
  { id: "cuadriceps_der", label: "Cuádriceps derecho", x: 100, y: 134, w: 22, h: 56, rx: 8 },
  { id: "rodilla_izq", label: "Rodilla izquierda", x: 79, y: 192, w: 20, h: 12, rx: 5 },
  { id: "rodilla_der", label: "Rodilla derecha", x: 101, y: 192, w: 20, h: 12, rx: 5 },
  { id: "tibial_izq", label: "Tibial izquierdo", x: 80, y: 206, w: 18, h: 46, rx: 6 },
  { id: "tibial_der", label: "Tibial derecho", x: 102, y: 206, w: 18, h: 46, rx: 6 },
];

const BACK: typeof FRONT = [
  { id: "trapecio", label: "Trapecio", x: 78, y: 44, w: 44, h: 20, rx: 6 },
  { id: "espalda_alta", label: "Espalda alta", x: 76, y: 64, w: 48, h: 32, rx: 6 },
  { id: "triceps_izq", label: "Tríceps izquierdo", x: 38, y: 78, w: 18, h: 40, rx: 8 },
  { id: "triceps_der", label: "Tríceps derecho", x: 144, y: 78, w: 18, h: 40, rx: 8 },
  { id: "espalda_baja", label: "Espalda baja", x: 80, y: 96, w: 40, h: 34, rx: 6 },
  { id: "antebrazo_izq_b", label: "Antebrazo izquierdo", x: 34, y: 120, w: 16, h: 36, rx: 7 },
  { id: "antebrazo_der_b", label: "Antebrazo derecho", x: 150, y: 120, w: 16, h: 36, rx: 7 },
  { id: "gluteo_izq", label: "Glúteo izquierdo", x: 78, y: 130, w: 22, h: 26, rx: 8 },
  { id: "gluteo_der", label: "Glúteo derecho", x: 100, y: 130, w: 22, h: 26, rx: 8 },
  { id: "isquios_izq", label: "Isquiotibial izquierdo", x: 78, y: 156, w: 22, h: 40, rx: 8 },
  { id: "isquios_der", label: "Isquiotibial derecho", x: 100, y: 156, w: 22, h: 40, rx: 8 },
  { id: "gemelo_izq", label: "Gemelo izquierdo", x: 80, y: 206, w: 18, h: 46, rx: 6 },
  { id: "gemelo_der", label: "Gemelo derecho", x: 102, y: 206, w: 18, h: 46, rx: 6 },
];

function Figure({
  zones,
  value,
  onToggle,
}: {
  zones: typeof FRONT;
  value: Record<string, Level>;
  onToggle: (id: string) => void;
}) {
  return (
    <svg viewBox="0 0 200 260" className="mx-auto h-72 w-auto">
      {/* silueta decorativa, no clickeable */}
      <circle cx={100} cy={26} r={16} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
      {zones.map((z) => {
        const level = (value[z.id] ?? 0) as Level;
        return (
          <rect
            key={z.id}
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            rx={z.rx ?? 4}
            fill={COLORS[level]}
            stroke={STROKE[level]}
            strokeWidth={1.5}
            className="cursor-pointer transition-colors duration-150 hover:brightness-125"
            onClick={() => onToggle(z.id)}
          >
            <title>{z.label}</title>
          </rect>
        );
      })}
    </svg>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export default function MuscleMap({
  value,
  onChange,
}: {
  value: Record<string, Level>;
  onChange: (next: Record<string, Level>) => void;
}) {
  function toggle(id: string) {
    const current = (value[id] ?? 0) as Level;
    const next = ((current + 1) % 4) as Level;
    const copy = { ...value };
    if (next === 0) delete copy[id];
    else copy[id] = next;
    onChange(copy);
  }

  const allZones = [...FRONT, ...BACK];
  const label = (id: string) => allZones.find((z) => z.id === id)?.label ?? id;
  const painEntries = Object.entries(value).filter(([, l]) => l > 0);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-white/10 bg-black/20 p-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-center text-[11px] uppercase tracking-wider text-white/30">
            Frente
          </p>
          <Figure zones={FRONT} value={value} onToggle={toggle} />
        </div>
        <div>
          <p className="mb-1 text-center text-[11px] uppercase tracking-wider text-white/30">
            Espalda
          </p>
          <Figure zones={BACK} value={value} onToggle={toggle} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/50">
        <Legend color={COLORS[1]} label="Fatiga leve" />
        <Legend color={COLORS[2]} label="Fatiga moderada" />
        <Legend color={COLORS[3]} label="Dolor fuerte" />
        <span className="text-white/30">Click para marcar, click de nuevo para subir el nivel.</span>
      </div>

      {painEntries.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {painEntries.map(([id, level]) => (
            <li
              key={id}
              className="flex items-center gap-1.5 border px-2 py-1 text-xs"
              style={{ borderColor: STROKE[level as Level], color: COLORS[level as Level] }}
            >
              {label(id)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
