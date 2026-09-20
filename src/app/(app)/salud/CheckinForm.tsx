"use client";

import { useState, useTransition } from "react";
import MuscleMap from "./MuscleMap";
import { saveCheckin } from "./actions";
import { Card, Field, Input, Textarea, Button } from "../ui";
import { SLEEP, MOOD, SORE } from "./scale";

type Existing = {
  sleep_hours: number | null;
  sleep_quality: number | null;
  mood: number | null;
  soreness_overall: number | null;
  notes: string | null;
  muscle_pain: Record<string, number> | null;
} | null;

export default function CheckinForm({
  athleteId,
  existing,
}: {
  athleteId: string;
  existing: Existing;
}) {
  const [sleepHours, setSleepHours] = useState(existing?.sleep_hours?.toString() ?? "");
  const [sleepQuality, setSleepQuality] = useState(existing?.sleep_quality ?? 4);
  const [mood, setMood] = useState(existing?.mood ?? 4);
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
    <Card>
      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Horas de sueño">
            <Input
              type="number"
              step="0.5"
              min={0}
              max={16}
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
            />
          </Field>

          <ScaleField label="Calidad del sueño" words={SLEEP} value={sleepQuality} onChange={setSleepQuality} />
          <ScaleField label="Ánimo" words={MOOD} value={mood} onChange={setMood} />
          <ScaleField label="Fatiga/dolor general" words={SORE} value={soreness} onChange={setSoreness} />
        </div>

        <Field label="Mapa de dolor muscular">
          <MuscleMap value={musclePain as never} onChange={(v) => setMusclePain(v as never)} />
        </Field>

        <Field label="Notas (opcional)">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="resize-y" />
        </Field>

        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Guardando…" : "Guardar check-in de hoy"}
          </Button>
          {done && <span className="text-xs text-ok-text">Guardado ✓</span>}
        </div>
      </form>
    </Card>
  );
}

function ScaleField({
  label,
  words,
  value,
  onChange,
}: {
  label: string;
  words: string[];
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => onChange(n)}
            aria-label={words[n - 1]}
            className={`h-8 flex-1 rounded-lg border text-xs font-medium transition ${
              value === n
                ? "border-brand-strong bg-brand-strong text-white"
                : "border-line-strong text-ink-2 hover:border-ink-3"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-2">{words[value - 1]}</p>
    </Field>
  );
}
