"use client";

import { useState, useTransition } from "react";
import { rajdhani } from "../fonts";
import { Card, Field, Input, Textarea, Select, Button } from "../ui";
import { saveRoutine } from "./actions";
import { WEEKDAY_LABEL, type Days, type DayPlan, type Exercise, type InfoSection } from "./types";

const EMPTY_DAY: DayPlan = { kind: "rest", title: "Descanso" };
const EMPTY_EX: Exercise = { name: "", sets_reps: "", note: "", weighted: true };

export default function RoutineEditor({
  athleteId,
  athleteName,
  initial,
}: {
  athleteId: string;
  athleteName: string;
  initial: { title: string; subtitle: string; days: Days; info: InfoSection[] };
}) {
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [days, setDays] = useState<Days>(initial.days);
  const [info, setInfo] = useState<InfoSection[]>(initial.info);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function day(n: number): DayPlan {
    return days[String(n)] ?? EMPTY_DAY;
  }
  function setDay(n: number, patch: Partial<DayPlan>) {
    setDays((prev) => ({ ...prev, [String(n)]: { ...day(n), ...patch } }));
  }
  function setExercises(n: number, exercises: Exercise[]) {
    setDay(n, { exercises });
  }
  function addExercise(n: number) {
    setExercises(n, [...(day(n).exercises ?? []), { ...EMPTY_EX }]);
  }
  function updateExercise(n: number, i: number, patch: Partial<Exercise>) {
    const list = [...(day(n).exercises ?? [])];
    list[i] = { ...list[i], ...patch };
    setExercises(n, list);
  }
  function removeExercise(n: number, i: number) {
    setExercises(n, (day(n).exercises ?? []).filter((_, x) => x !== i));
  }

  function addInfo() {
    setInfo((prev) => [...prev, { title: "Nueva sección", items: [""] }]);
  }
  function updateInfoTitle(i: number, t: string) {
    setInfo((prev) => prev.map((s, x) => (x === i ? { ...s, title: t } : s)));
  }
  function updateInfoItem(i: number, j: number, v: string) {
    setInfo((prev) =>
      prev.map((s, x) => (x === i ? { ...s, items: s.items.map((it, y) => (y === j ? v : it)) } : s)),
    );
  }
  function addInfoItem(i: number) {
    setInfo((prev) => prev.map((s, x) => (x === i ? { ...s, items: [...s.items, ""] } : s)));
  }
  function removeInfoItem(i: number, j: number) {
    setInfo((prev) => prev.map((s, x) => (x === i ? { ...s, items: s.items.filter((_, y) => y !== j) } : s)));
  }
  function removeInfo(i: number) {
    setInfo((prev) => prev.filter((_, x) => x !== i));
  }

  function save() {
    startTransition(async () => {
      await saveRoutine(athleteId, { title, subtitle, days, info });
      setSavedAt(Date.now());
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`${rajdhani.className} text-2xl font-bold text-ink`}>
          Rutina de {athleteName}
        </h1>
        <p className="mt-1 text-sm text-ink-3">
          Solo el atleta y vos ven esto. Se guarda todo junto con el botón de abajo.
        </p>
      </div>

      <Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Título">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Subtítulo (opcional)">
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </Field>
        </div>
      </Card>

      {WEEKDAY_LABEL.map((label, n) => {
        const d = day(n);
        return (
          <Card key={n}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className={`${rajdhani.className} text-lg font-bold text-ink`}>{label}</h2>
              <Select
                value={d.kind}
                onChange={(e) => setDay(n, { kind: e.target.value as DayPlan["kind"] })}
                className="w-auto"
              >
                <option value="gym">Gym (con ejercicios)</option>
                <option value="other">Otra actividad</option>
                <option value="rest">Descanso</option>
              </Select>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Título del día">
                <Input value={d.title} onChange={(e) => setDay(n, { title: e.target.value })} />
              </Field>
              {d.kind === "gym" && (
                <Field label="Enfoque (opcional)">
                  <Input value={d.focus ?? ""} onChange={(e) => setDay(n, { focus: e.target.value })} />
                </Field>
              )}
              {d.kind !== "gym" && (
                <Field label="Notas (opcional)">
                  <Input value={d.notes ?? ""} onChange={(e) => setDay(n, { notes: e.target.value })} />
                </Field>
              )}
            </div>

            {d.kind === "gym" && (
              <div className="mt-4 space-y-3">
                {(d.exercises ?? []).map((ex, i) => (
                  <div key={i} className="rounded-lg border border-line p-3">
                    <div className="grid gap-2 sm:grid-cols-[2fr_1fr_2fr_auto]">
                      <Input
                        placeholder="Nombre del ejercicio"
                        value={ex.name}
                        onChange={(e) => updateExercise(n, i, { name: e.target.value })}
                      />
                      <Input
                        placeholder="Series × reps (4 × 8)"
                        value={ex.sets_reps}
                        onChange={(e) => updateExercise(n, i, { sets_reps: e.target.value })}
                      />
                      <Input
                        placeholder="Nota (opcional)"
                        value={ex.note ?? ""}
                        onChange={(e) => updateExercise(n, i, { note: e.target.value })}
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeExercise(n, i)}>
                        Quitar
                      </Button>
                    </div>
                    <label className="mt-2 flex items-center gap-2 text-xs text-ink-2">
                      <input
                        type="checkbox"
                        checked={ex.weighted !== false}
                        onChange={(e) => updateExercise(n, i, { weighted: e.target.checked })}
                      />
                      Con peso (muestra el registro de kg/reps)
                    </label>
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={() => addExercise(n)}>
                  + Agregar ejercicio
                </Button>
              </div>
            )}
          </Card>
        );
      })}

      <Card>
        <h2 className={`${rajdhani.className} text-lg font-bold text-ink`}>
          Secciones informativas (Objetivo, Reglas, etc.)
        </h2>
        <div className="mt-3 space-y-4">
          {info.map((sec, i) => (
            <div key={i} className="rounded-lg border border-line p-3">
              <div className="flex items-center gap-2">
                <Input value={sec.title} onChange={(e) => updateInfoTitle(i, e.target.value)} />
                <Button variant="ghost" size="sm" onClick={() => removeInfo(i)}>
                  Quitar sección
                </Button>
              </div>
              <div className="mt-2 space-y-1.5">
                {sec.items.map((it, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Textarea
                      rows={1}
                      value={it}
                      onChange={(e) => updateInfoItem(i, j, e.target.value)}
                      className="resize-none"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeInfoItem(i, j)}>
                      ×
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={() => addInfoItem(i)}>
                  + Punto
                </Button>
              </div>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addInfo}>
            + Sección
          </Button>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <Button variant="primary" onClick={save} disabled={pending}>
          {pending ? "Guardando…" : "Guardar rutina"}
        </Button>
        {savedAt && <span className="text-xs font-medium text-ok-text">Guardado ✓</span>}
      </div>
    </div>
  );
}
