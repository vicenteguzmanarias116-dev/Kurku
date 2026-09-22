"use client";

import { useState } from "react";
import MuscleMap from "./MuscleMap";
import { Card, Field, Input, Textarea, Button } from "../ui";
import { SLEEP, MOOD, SORE } from "./scale";

export default function DemoCheckinForm() {
  const [sleepHours, setSleepHours] = useState("");
  const [sleepQuality, setSleepQuality] = useState(4);
  const [mood, setMood] = useState(4);
  const [soreness, setSoreness] = useState(1);
  const [notes, setNotes] = useState("");
  const [musclePain, setMusclePain] = useState<Record<string, number>>({});

  return (
    <Card>
      <div className="mb-4 rounded-lg border border-brand/40 bg-brand-soft px-3 py-2 text-xs text-brand-text">
        Vista previa — así lo ve un atleta. Esto no se guarda (tu cuenta admin
        no tiene una ficha de atleta propia).
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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

        <Button type="submit" variant="primary" disabled>
          Guardar check-in de hoy (deshabilitado en la demo)
        </Button>
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
