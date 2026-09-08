"use client";

import { useState, useTransition } from "react";
import MuscleMap from "./MuscleMap";
import { saveCheckin } from "./actions";
import { mono } from "../fonts";

type Existing = {
  sleep_hours: number | null;
  sleep_quality: number | null;
  mood: number | null;
  soreness_overall: number | null;
  notes: string | null;
  muscle_pain: Record<string, number> | null;
} | null;

const scaleInput =
  "w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40";

export default function CheckinForm({
  athleteId,
  existing,
}: {
  athleteId: string;
  existing: Existing;
}) {
  const [sleepHours, setSleepHours] = useState(existing?.sleep_hours?.toString() ?? "");
  const [sleepQuality, setSleepQuality] = useState(existing?.sleep_quality ?? 3);
  const [mood, setMood] = useState(existing?.mood ?? 3);
  const [soreness, setSoreness] = useState(existing?.soreness_overall ?? 1);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [musclePain, setMusclePain] = useState<Record<string, number>>(
    existing?.muscle_pain ?? {},
  );
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(false);
    startTransition(async () => {
      await saveCheckin({
        athlete_id: athleteId,
        sleep_hours: sleepHours ? Number(sleepHours) : null,
        sleep_quality: sleepQuality,
        mood,
        soreness_overall: soreness,
        notes: notes || null,
        muscle_pain: musclePain,
      });
      setDone(true);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-xl border border-white/10 bg-[#0D141E]/80 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={`${mono.className} mb-1 block text-[11px] uppercase tracking-wider text-white/40`}>
            Horas de sueño
          </span>
          <input
            type="number"
            step="0.5"
            min={0}
            max={16}
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            className={scaleInput}
          />
        </label>

        <ScaleField label="Calidad del sueño (1-5)" value={sleepQuality} onChange={setSleepQuality} />
        <ScaleField label="Ánimo (1-5)" value={mood} onChange={setMood} />
        <ScaleField label="Fatiga/dolor general (1-5)" value={soreness} onChange={setSoreness} />
      </div>

      <div>
        <span className={`${mono.className} mb-2 block text-[11px] uppercase tracking-wider text-white/40`}>
          Mapa de dolor muscular
        </span>
        <MuscleMap value={musclePain as never} onChange={(v) => setMusclePain(v as never)} />
      </div>

      <label className="block">
        <span className={`${mono.className} mb-1 block text-[11px] uppercase tracking-wider text-white/40`}>
          Notas (opcional)
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={`${scaleInput} resize-y`}
        />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="cut-corner bg-[#FF5A36] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Guardar check-in de hoy"}
        </button>
        {done && <span className="text-xs text-cyan-300">Guardado ✓</span>}
      </div>
    </form>
  );
}

function ScaleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className={`${mono.className} mb-1 block text-[11px] uppercase tracking-wider text-white/40`}>
        {label}
      </span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => onChange(n)}
            className={`h-8 w-8 border text-sm transition ${
              value === n
                ? "border-[#FF5A36] bg-[#FF5A36] text-[#05080D]"
                : "border-white/15 text-white/50 hover:border-white/40"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </label>
  );
}
