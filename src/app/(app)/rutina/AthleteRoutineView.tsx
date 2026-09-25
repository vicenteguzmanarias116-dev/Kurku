"use client";

import { useMemo, useState, useTransition } from "react";
import { rajdhani } from "../fonts";
import { Card, Button } from "../ui";
import { toggleCheck, logWeight, deleteLog, completeSession } from "./actions";
import { WEEKDAY_SHORT, WEEKDAY_LABEL, type Days, type InfoSection, type LogEntry } from "./types";

const todayIdx = () => new Date().getDay();
const keyOf = (weekday: number, i: number) => `${weekday}-${i}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short" });

export default function AthleteRoutineView({
  title,
  subtitle,
  days,
  info,
  initialChecks,
  initialLogs,
}: {
  title: string;
  subtitle: string | null;
  days: Days;
  info: InfoSection[];
  initialChecks: Record<number, number[]>;
  initialLogs: Record<string, LogEntry[]>;
}) {
  const [current, setCurrent] = useState(todayIdx());
  const [checks, setChecks] = useState(initialChecks);
  const [logs, setLogs] = useState(initialLogs);
  const [openLog, setOpenLog] = useState<string | null>(null);
  const [kg, setKg] = useState("");
  const [reps, setReps] = useState("");
  const [pending, startTransition] = useTransition();
  const [sessionMsg, setSessionMsg] = useState<string | null>(null);

  const day = days[String(current)];
  const doneIdx = checks[current] ?? [];

  const weekOrder = useMemo(() => [1, 2, 3, 4, 5, 6, 0], []); // lunes..domingo

  function toggle(i: number) {
    const next = doneIdx.includes(i) ? doneIdx.filter((x) => x !== i) : [...doneIdx, i];
    setChecks((prev) => ({ ...prev, [current]: next }));
    startTransition(() => toggleCheck(current, i));
  }

  function openLogFor(i: number) {
    const k = keyOf(current, i);
    if (openLog === k) {
      setOpenLog(null);
      return;
    }
    const last = logs[k]?.[0];
    setKg(last?.kg != null ? String(last.kg) : "");
    setReps(last?.reps != null ? String(last.reps) : "");
    setOpenLog(k);
  }

  function saveLog(i: number) {
    const k = kg ? parseFloat(kg) : NaN;
    const r = reps ? parseInt(reps, 10) : NaN;
    if (!(k >= 0) || !(r > 0)) return;
    const entry: LogEntry = { id: `tmp-${Date.now()}`, kg: k, reps: r, logged_at: new Date().toISOString() };
    const key = keyOf(current, i);
    setLogs((prev) => ({ ...prev, [key]: [entry, ...(prev[key] ?? [])].slice(0, 20) }));
    startTransition(() => logWeight(current, i, k, r));
  }

  function removeLog(key: string, id: string) {
    setLogs((prev) => ({ ...prev, [key]: (prev[key] ?? []).filter((l) => l.id !== id) }));
    if (!id.startsWith("tmp-")) startTransition(() => deleteLog(id));
  }

  function finishSession() {
    if (!day || day.kind !== "gym") return;
    startTransition(async () => {
      await completeSession(day.title);
      setSessionMsg("¡Avisado! Tu coach ya lo sabe.");
      setTimeout(() => setSessionMsg(null), 4000);
    });
  }

  const progress = day?.exercises?.length ? (doneIdx.length / day.exercises.length) * 100 : 0;

  return (
    <div>
      <div className="mb-1">
        <h1 className={`${rajdhani.className} text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl`}>
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-ink-2">{subtitle}</p>}
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {weekOrder.map((n) => {
          const d = days[String(n)];
          const label = d ? (d.kind === "gym" ? "Gym" : d.kind === "rest" ? "Libre" : d.title) : "—";
          return (
            <button
              key={n}
              type="button"
              onClick={() => setCurrent(n)}
              aria-pressed={n === current}
              className={`rounded-xl border py-2.5 text-center transition ${
                n === current
                  ? "border-brand-strong bg-brand-strong text-white"
                  : "border-line bg-surface text-ink hover:border-brand/50"
              }`}
            >
              <span className={`${rajdhani.className} block text-lg font-bold leading-none`}>
                {WEEKDAY_SHORT[n]}
              </span>
              <span className={`mt-1 block truncate px-1 text-[10px] ${n === current ? "text-white/80" : "text-ink-3"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-3">
        {current === todayIdx() ? `Hoy es ${WEEKDAY_LABEL[current].toLowerCase()}.` : `Viendo el ${WEEKDAY_LABEL[current].toLowerCase()}.`}
      </p>

      {!day && (
        <Card className="mt-5">
          <p className="text-sm text-ink-2">Nada planeado para este día.</p>
        </Card>
      )}

      {day && day.kind !== "gym" && (
        <Card className="mt-5">
          <h2 className={`${rajdhani.className} text-2xl font-bold text-ink`}>{day.title}</h2>
          {day.notes && <p className="mt-1.5 text-sm text-ink-2">{day.notes}</p>}
        </Card>
      )}

      {day && day.kind === "gym" && (
        <Card className="mt-5">
          <h2 className={`${rajdhani.className} text-2xl font-bold text-ink`}>{day.title}</h2>
          {day.focus && <p className="mt-1 text-sm text-ink-2">{day.focus}</p>}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sunken">
            <div className="h-full rounded-full bg-brand-strong transition-all" style={{ width: `${progress}%` }} />
          </div>

          <ol className="mt-4 divide-y divide-line">
            {(day.exercises ?? []).map((ex, i) => {
              const isDone = doneIdx.includes(i);
              const key = keyOf(current, i);
              const hist = logs[key] ?? [];
              const last = hist[0];
              const weighted = ex.weighted !== false;
              const isOpen = openLog === key;
              return (
                <li key={i} className="py-3.5 first:pt-0">
                  <div className="grid grid-cols-[34px_1fr_auto] items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-pressed={isDone}
                      aria-label={`Marcar ${ex.name}`}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-bold transition ${
                        isDone ? "border-ok-text bg-ok-text text-white" : "border-line-strong text-ink-3"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${isDone ? "text-ink-3 line-through" : "text-ink"}`}>
                        {ex.name}
                      </p>
                      {ex.note && <p className="mt-0.5 text-xs text-ink-3">{ex.note}</p>}
                      {last && (
                        <p className="mt-0.5 text-xs font-medium text-brand-text">
                          Última: {last.kg} kg × {last.reps} ({fmtDate(last.logged_at)})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`${rajdhani.className} whitespace-nowrap text-lg font-bold text-brand-text`}>
                        {ex.sets_reps}
                      </p>
                      {weighted && (
                        <button
                          type="button"
                          onClick={() => openLogFor(i)}
                          className={`mt-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition ${
                            isOpen ? "border-brand bg-brand-soft text-brand-text" : "border-line text-ink-2 hover:border-brand/50"
                          }`}
                        >
                          Peso
                        </button>
                      )}
                    </div>
                  </div>

                  {weighted && isOpen && (
                    <div className="ml-11 mt-3 rounded-xl bg-sunken p-3">
                      <div className="flex flex-wrap items-end gap-2">
                        <label className="flex flex-col gap-1 text-xs text-ink-3">
                          Kg
                          <input
                            type="number"
                            step="0.5"
                            min={0}
                            value={kg}
                            onChange={(e) => setKg(e.target.value)}
                            className="w-20 rounded-lg border border-line-strong bg-surface px-2 py-1.5 text-sm text-ink outline-none focus:border-brand"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs text-ink-3">
                          Reps
                          <input
                            type="number"
                            min={1}
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            className="w-20 rounded-lg border border-line-strong bg-surface px-2 py-1.5 text-sm text-ink outline-none focus:border-brand"
                          />
                        </label>
                        <Button variant="primary" size="sm" onClick={() => saveLog(i)} disabled={pending}>
                          Guardar
                        </Button>
                      </div>
                      {hist.length > 0 && (
                        <ul className="mt-2.5 space-y-1 text-xs">
                          {hist.slice(0, 5).map((h) => (
                            <li key={h.id} className="flex items-center justify-between border-t border-line pt-1 first:border-0 first:pt-0">
                              <span className="text-ink-3">{fmtDate(h.logged_at)}</span>
                              <span className="text-ink-2">
                                {h.kg} kg × {h.reps}{" "}
                                <button
                                  type="button"
                                  onClick={() => removeLog(key, h.id)}
                                  className="ml-1.5 text-ink-3 underline hover:text-bad-text"
                                >
                                  borrar
                                </button>
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-5 flex items-center gap-3">
            <Button variant="primary" onClick={finishSession} disabled={pending}>
              Terminé la sesión de hoy
            </Button>
            {sessionMsg && <span className="text-xs font-medium text-ok-text">{sessionMsg}</span>}
          </div>
        </Card>
      )}

      {info.length > 0 && (
        <div className="mt-8 space-y-0 divide-y divide-line border-y border-line">
          {info.map((sec) => (
            <details key={sec.title} className="group py-1">
              <summary className={`${rajdhani.className} flex cursor-pointer list-none items-center justify-between py-3 text-lg font-bold text-ink`}>
                {sec.title}
                <span className="text-brand-text transition group-open:rotate-45">+</span>
              </summary>
              <ul className="mb-3 ml-5 list-disc space-y-1.5 text-sm text-ink-2">
                {sec.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-ink-3">
        Toca el número para marcar un ejercicio. Toca «Peso» para registrar lo que levantaste.
      </p>
    </div>
  );
}
