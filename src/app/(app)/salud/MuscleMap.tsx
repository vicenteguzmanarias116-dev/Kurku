"use client";

import { useState } from "react";
import { FRONT, BACK, SILHOUETTE, type Zone } from "./muscles";

type Level = 0 | 1 | 2 | 3;

const COLORS: Record<Level, string> = {
  0: "#F1F3F5",
  1: "#eab308", // leve
  2: "#f97316", // moderado
  3: "#ef4444", // fuerte
};
const STROKE: Record<Level, string> = {
  0: "#98A2B3",
  1: "#eab308",
  2: "#f97316",
  3: "#ef4444",
};

function Figure({
  zones,
  value,
  onToggle,
}: {
  zones: Zone[];
  value: Record<string, Level>;
  onToggle: (id: string) => void;
}) {
  return (
    <svg viewBox="0 0 200 260" className="mx-auto h-72 w-auto">
      <path d={SILHOUETTE} fill="#F6F7F9" stroke="#E4E7EB" strokeWidth={1} pointerEvents="none" />
      {zones.map((z) => {
        const level = (value[z.id] ?? 0) as Level;
        return (
          <ellipse
            key={z.id}
            cx={z.cx}
            cy={z.cy}
            rx={z.rx}
            ry={z.ry}
            fill={COLORS[level]}
            stroke={STROKE[level]}
            strokeWidth={1.5}
            role="button"
            tabIndex={0}
            aria-label={`${z.label}: ${level === 0 ? "sin dolor" : `nivel ${level}`}`}
            className="cursor-pointer outline-none transition-colors duration-150 hover:brightness-125 focus-visible:stroke-brand-strong"
            onClick={() => onToggle(z.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle(z.id);
              }
            }}
          >
            <title>{z.label}</title>
          </ellipse>
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
  const [side, setSide] = useState<"front" | "back">("front");

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
      <div className="mb-3 flex gap-1 border-b border-line">
        {(["front", "back"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={`px-3 py-2 text-sm font-medium transition ${
              side === s ? "border-b-2 border-brand-strong text-ink" : "text-ink-3 hover:text-ink"
            }`}
          >
            {s === "front" ? "Frente" : "Espalda"}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-sunken p-4">
        <Figure zones={side === "front" ? FRONT : BACK} value={value} onToggle={toggle} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-2">
        <Legend color={COLORS[1]} label="Fatiga leve" />
        <Legend color={COLORS[2]} label="Fatiga moderada" />
        <Legend color={COLORS[3]} label="Dolor fuerte" />
        <span className="text-ink-3">Click para marcar, click de nuevo para subir el nivel.</span>
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
