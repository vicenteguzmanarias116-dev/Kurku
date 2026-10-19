"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { rajdhani } from "../fonts";
import { Card, Button } from "../ui";
import { saveRoutine } from "./actions";
import { cleanRoutine } from "./template";
import { WEEKDAY_SHORT, WEEKDAY_LABEL, type Days, type DayPlan, type Exercise, type InfoSection } from "./types";

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // lunes..domingo
const EMPTY_DAY: DayPlan = { kind: "rest", title: "Descanso" };
const EMPTY_EX: Exercise = { name: "", sets_reps: "", note: "", weighted: true };
const KINDS: { value: DayPlan["kind"]; label: string }[] = [
  { value: "gym", label: "Gym" },
  { value: "other", label: "Otra actividad" },
  { value: "rest", label: "Descanso" },
];

// campo que parece texto y se vuelve input al pasar el mouse o enfocar
const FIELD =
  "w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1 outline-none transition placeholder:text-ink-3/70 hover:border-line focus:border-brand focus:bg-surface";

export default function RoutineEditor({
  athleteId,
  athleteName,
  initial,
  isNew = false,
}: {
  athleteId: string;
  athleteName: string;
  isNew?: boolean;
  initial: { title: string; subtitle: string; days: Days; info: InfoSection[] };
}) {
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [days, setDays] = useState<Days>(initial.days);
  const [info, setInfo] = useState<InfoSection[]>(initial.info);
  const [current, setCurrent] = useState(new Date().getDay());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const snapshot = JSON.stringify({ title, subtitle, days, info });
  // rutina nueva (plantilla): se puede guardar de inmediato
  const savedSnapshot = useRef(isNew ? "" : snapshot);
  const dirty = snapshot !== savedSnapshot.current;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const day = (n: number): DayPlan => days[String(n)] ?? EMPTY_DAY;
  const setDay = (n: number, patch: Partial<DayPlan>) =>
    setDays((prev) => ({ ...prev, [String(n)]: { ...(prev[String(n)] ?? EMPTY_DAY), ...patch } }));

  const d = day(current);
  const exercises = d.exercises ?? [];
  const setExercises = (list: Exercise[]) => setDay(current, { exercises: list });
  const updateExercise = (i: number, patch: Partial<Exercise>) =>
    setExercises(exercises.map((ex, x) => (x === i ? { ...ex, ...patch } : ex)));
  const moveExercise = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= exercises.length) return;
    const list = [...exercises];
    [list[i], list[j]] = [list[j], list[i]];
    setExercises(list);
  };

  const updateSection = (i: number, patch: Partial<InfoSection>) =>
    setInfo((prev) => prev.map((s, x) => (x === i ? { ...s, ...patch } : s)));

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        const clean = cleanRoutine(days, info);
        await saveRoutine(athleteId, { title, subtitle, ...clean });
        savedSnapshot.current = snapshot;
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo guardar.");
      }
    });
  }

  return (
    <div>
      <Link href="/rutina" className="text-sm text-ink-3 hover:text-brand-text">
        ← Rutinas
      </Link>

      <div className="mt-2">
        <input
          aria-label="Título de la rutina"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${FIELD} ${rajdhani.className} !px-0 text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl`}
        />
        <input
          aria-label="Subtítulo"
          placeholder="Subtítulo (opcional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className={`${FIELD} !px-0 mt-1 text-sm text-ink-2`}
        />
        <p className="mt-1 text-xs text-ink-3">
          Editando la rutina de {athleteName}. Así la ve el atleta; solo él y el staff la ven.
        </p>
        {isNew && (
          <p className="mt-3 rounded-lg bg-info-soft px-3 py-2 text-sm text-info-text">
            Plantilla nueva: elige cada día, llena los ejercicios o la actividad y guarda. Las filas que dejes
            vacías no se guardan.
          </p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {WEEK_ORDER.map((n) => {
          const dd = days[String(n)];
          const label = dd ? (dd.kind === "gym" ? "Gym" : dd.kind === "rest" ? "Libre" : dd.title) : "—";
          return (
            <button
              key={n}
              type="button"
              onClick={() => setCurrent(n)}
              aria-pressed={n === current}
              aria-label={WEEKDAY_LABEL[n]}
              className={`rounded-xl border py-2.5 text-center transition ${
                n === current
                  ? "border-brand-strong bg-brand-strong text-white"
                  : "border-line bg-surface text-ink hover:border-brand/50"
              }`}
            >
              <span className={`${rajdhani.className} block text-lg font-bold leading-none`}>{WEEKDAY_SHORT[n]}</span>
              <span className={`mt-1 block truncate px-1 text-[10px] ${n === current ? "text-white/80" : "text-ink-3"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-3">Editando el {WEEKDAY_LABEL[current].toLowerCase()}.</p>

      <Card className="mt-5">
        <div role="radiogroup" aria-label="Tipo de día" className="mb-3 inline-flex rounded-lg border border-line p-0.5 text-xs font-medium">
          {KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              role="radio"
              aria-checked={d.kind === k.value}
              onClick={() => setDay(current, { kind: k.value })}
              className={`rounded-md px-3 py-1.5 transition ${
                d.kind === k.value ? "bg-brand-soft text-brand-text" : "text-ink-3 hover:text-ink"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>

        <input
          aria-label="Título del día"
          placeholder="Título del día"
          value={d.title}
          onChange={(e) => setDay(current, { title: e.target.value })}
          className={`${FIELD} ${rajdhani.className} !px-0 text-2xl font-bold text-ink`}
        />
        {d.kind === "gym" ? (
          <input
            aria-label="Enfoque"
            placeholder="Enfoque (opcional)"
            value={d.focus ?? ""}
            onChange={(e) => setDay(current, { focus: e.target.value })}
            className={`${FIELD} !px-0 mt-1 text-sm text-ink-2`}
          />
        ) : (
          <input
            aria-label="Notas"
            placeholder="Notas (opcional)"
            value={d.notes ?? ""}
            onChange={(e) => setDay(current, { notes: e.target.value })}
            className={`${FIELD} !px-0 mt-1 text-sm text-ink-2`}
          />
        )}

        {d.kind === "gym" && (
          <>
            <ol className="mt-4 divide-y divide-line">
              {exercises.map((ex, i) => (
                <li key={i} className="py-3.5 first:pt-0">
                  <div className="grid grid-cols-[34px_1fr_auto] items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-line-strong font-bold text-ink-3">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <input
                        aria-label={`Nombre del ejercicio ${i + 1}`}
                        placeholder="Nombre del ejercicio"
                        value={ex.name}
                        onChange={(e) => updateExercise(i, { name: e.target.value })}
                        className={`${FIELD} text-sm font-semibold text-ink`}
                      />
                      <input
                        aria-label={`Nota del ejercicio ${i + 1}`}
                        placeholder="Nota (opcional)"
                        value={ex.note ?? ""}
                        onChange={(e) => updateExercise(i, { note: e.target.value })}
                        className={`${FIELD} text-xs text-ink-3`}
                      />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <input
                        aria-label={`Series y repeticiones del ejercicio ${i + 1}`}
                        placeholder="4 × 8"
                        value={ex.sets_reps}
                        onChange={(e) => updateExercise(i, { sets_reps: e.target.value })}
                        className={`${FIELD} ${rajdhani.className} w-28 text-right text-lg font-bold text-brand-text`}
                      />
                      <div className="flex items-center gap-0.5">
                        <label className="mr-1 flex cursor-pointer items-center gap-1 text-xs text-ink-2">
                          <input
                            type="checkbox"
                            checked={ex.weighted !== false}
                            onChange={(e) => updateExercise(i, { weighted: e.target.checked })}
                          />
                          Peso
                        </label>
                        <IconBtn label="Subir" disabled={i === 0} onClick={() => moveExercise(i, -1)}>
                          ↑
                        </IconBtn>
                        <IconBtn label="Bajar" disabled={i === exercises.length - 1} onClick={() => moveExercise(i, 1)}>
                          ↓
                        </IconBtn>
                        <IconBtn label="Quitar" danger onClick={() => setExercises(exercises.filter((_, x) => x !== i))}>
                          ×
                        </IconBtn>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => setExercises([...exercises, { ...EMPTY_EX }])}>
              + Agregar ejercicio
            </Button>
          </>
        )}
      </Card>

      <div className="mt-8 space-y-0 divide-y divide-line border-y border-line">
        {info.map((sec, i) => (
          <details key={i} className="group py-1" open={sec.title === "Nueva sección"}>
            <summary className={`${rajdhani.className} flex cursor-pointer list-none items-center justify-between py-3 text-lg font-bold text-ink`}>
              {sec.title || "Sin título"}
              <span className="text-brand-text transition group-open:rotate-45">+</span>
            </summary>
            <div className="mb-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <input
                  aria-label="Título de la sección"
                  value={sec.title}
                  onChange={(e) => updateSection(i, { title: e.target.value })}
                  className={`${FIELD} text-sm font-semibold`}
                />
                <Button variant="ghost" size="sm" onClick={() => setInfo((p) => p.filter((_, x) => x !== i))}>
                  Quitar sección
                </Button>
              </div>
              {sec.items.map((it, j) => (
                <div key={j} className="flex items-start gap-2">
                  <span className="mt-1.5 text-ink-3">•</span>
                  <textarea
                    aria-label={`Punto ${j + 1}`}
                    rows={1}
                    value={it}
                    onChange={(e) => updateSection(i, { items: sec.items.map((x, y) => (y === j ? e.target.value : x)) })}
                    className={`${FIELD} resize-y text-sm text-ink-2`}
                  />
                  <IconBtn
                    label="Quitar punto"
                    danger
                    onClick={() => updateSection(i, { items: sec.items.filter((_, y) => y !== j) })}
                  >
                    ×
                  </IconBtn>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => updateSection(i, { items: [...sec.items, ""] })}>
                + Punto
              </Button>
            </div>
          </details>
        ))}
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={() => setInfo((p) => [...p, { title: "Nueva sección", items: [""] }])}
      >
        + Sección (Objetivo, Reglas…)
      </Button>

      <div className="sticky bottom-20 z-10 mt-8 flex items-center gap-3 rounded-xl border border-line bg-surface p-3 shadow-lg lg:bottom-4">
        <Button variant="primary" onClick={save} disabled={pending || !dirty}>
          {pending ? "Guardando…" : "Guardar rutina"}
        </Button>
        <span className="text-xs" aria-live="polite">
          {error ? (
            <span className="text-bad-text">{error}</span>
          ) : dirty ? (
            <span className="text-warn-text">Cambios sin guardar</span>
          ) : saved ? (
            <span className="font-medium text-ok-text">Guardado ✓</span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md text-ink-3 transition hover:bg-sunken disabled:opacity-30 ${
        danger ? "hover:text-bad-text" : "hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
