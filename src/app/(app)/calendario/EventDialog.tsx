"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { rajdhani } from "../fonts";
import { Field, Input, Select, Textarea, Button } from "../ui";
import { PLAN_TYPES } from "./planTypes";
import { addEvents } from "./actions";

export type EventLite = {
  id: string;
  title: string;
  kind: string;
  starts_at: string;
  plan_type: string | null;
};

const dayCount = (from: string, to: string) =>
  Math.max(0, Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000) + 1);

const longDate = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });

export default function EventDialog({
  range,
  athletes,
  onClose,
  onSaved,
}: {
  range: { from: string; to: string } | null;
  athletes: { id: string; full_name: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (range) {
      setFrom(range.from);
      setTo(range.to);
      setError(null);
      if (!dlg.open) dlg.showModal();
    } else if (dlg.open) {
      dlg.close();
    }
  }, [range]);

  const n = from && to ? dayCount(from, to) : 0;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      const res = await addEvents(data);
      if (res.error) return setError(res.error);
      form.reset();
      onSaved();
    });
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="cal-dialog m-auto w-[calc(100%-2rem)] max-w-lg rounded-[14px] border border-line bg-surface p-0 text-ink shadow-xl"
    >
      {range && (
        <form onSubmit={submit} className="max-h-[90vh] space-y-3 overflow-y-auto p-5 text-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className={`${rajdhani.className} text-xl font-bold`}>Nuevo evento</h2>
              <p className="text-sm capitalize text-ink-3">
                {from && to && from !== to ? `${longDate(from)} → ${longDate(to)}` : from && longDate(from)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="-m-2 rounded-lg p-2 text-ink-3 hover:bg-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-strong"
            >
              ✕
            </button>
          </div>

          <Input name="title" placeholder="Añade un título" required autoFocus />

          <div className="grid grid-cols-3 gap-3">
            <Field label="Desde">
              <Input name="date_from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} required />
            </Field>
            <Field label="Hasta">
              <Input name="date_to" type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} required />
            </Field>
            <Field label="Hora">
              <Input name="time" type="time" defaultValue="09:00" required />
            </Field>
          </div>
          {n > 1 && (
            <p className="rounded-lg bg-info-soft px-3 py-2 text-info-text">
              Se creará el mismo evento en {n} días seguidos.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <Select name="kind">
                <option value="training">Entrenamiento</option>
                <option value="regatta">Regata</option>
                <option value="other">Otro</option>
              </Select>
            </Field>
            <Field label="Tipo de plan">
              <Select name="plan_type">
                <option value="">Ninguno</option>
                {PLAN_TYPES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.emoji} {p.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Para">
              <Select name="athlete_id">
                <option value="">Todo el equipo</option>
                {athletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.full_name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Lugar">
              <Input name="location" placeholder="Opcional" />
            </Field>
          </div>

          <Textarea
            name="plan_items"
            placeholder={"Detalle de la sesión, una línea por ejercicio:\nSentadilla 4x10\nZancadas 3x12"}
            rows={3}
            className="resize-y"
          />
          <Input name="description" placeholder="Notas" />

          {error && <p role="alert" className="text-bad-text">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Guardando…" : n > 1 ? `Guardar en ${n} días` : "Guardar"}
            </Button>
          </div>
        </form>
      )}
    </dialog>
  );
}
