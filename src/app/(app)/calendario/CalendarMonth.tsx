"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import EventDialog, { type EventLite } from "./EventDialog";
import { PLAN_LABEL } from "./planTypes";
import { chipClass } from "./eventColors";

type Day = { key: string; num: number; inMonth: boolean; isToday: boolean };

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function CalendarMonth({
  days,
  events,
  canCreate,
  athletes,
}: {
  days: Day[];
  events: EventLite[];
  canCreate: boolean;
  athletes: { id: string; full_name: string }[];
}) {
  const [anchor, setAnchor] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);
  const dragging = anchor !== null;
  const lastAnchor = useRef<string | null>(null);
  const handledByPointer = useRef(false);

  const sel = useMemo(() => {
    if (!anchor || !hover) return null;
    return anchor <= hover ? { from: anchor, to: hover } : { from: hover, to: anchor };
  }, [anchor, hover]);

  useEffect(() => {
    if (!dragging) return;
    const up = () => {
      if (sel) {
        lastAnchor.current = anchor;
        setRange(sel);
      }
      setAnchor(null);
      setHover(null);
    };
    const release = () => setTimeout(() => (handledByPointer.current = false), 0);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointerup", release);
    };
  }, [dragging, sel, anchor]);

  const byDay = useMemo(() => {
    const m = new Map<string, EventLite[]>();
    for (const e of events) {
      const k = e.starts_at.slice(0, 10);
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(e);
    }
    return m;
  }, [events]);

  function onPointerDown(e: React.PointerEvent, key: string) {
    if (!canCreate || e.button !== 0 || e.pointerType === "touch") return;
    handledByPointer.current = true;
    const from = e.shiftKey && lastAnchor.current ? lastAnchor.current : key;
    setAnchor(from);
    setHover(key);
  }

  // táctil y teclado (Enter): un solo día; en el diálogo se amplía con "Hasta"
  function onClick(key: string) {
    if (handledByPointer.current) {
      handledByPointer.current = false;
      return;
    }
    if (canCreate) setRange({ from: key, to: key });
  }

  return (
    <>
      <div className="cal-fade overflow-x-auto rounded-xl border border-line bg-surface p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-px text-center text-xs text-ink-3">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid select-none grid-cols-7 gap-px bg-line text-sm">
          {days.map((d) => {
            // días de otros meses: casilla vacía, sin número, eventos ni click
            if (!d.inMonth) {
              return <div key={d.key} aria-hidden className="min-h-[90px] bg-sunken sm:min-h-[110px]" />;
            }
            const dayEvents = byDay.get(d.key) ?? [];
            const selected = sel && d.key >= sel.from && d.key <= sel.to;
            return (
              <div
                key={d.key}
                onPointerDown={(e) => onPointerDown(e, d.key)}
                onPointerEnter={() => dragging && setHover(d.key)}
                className={`relative min-h-[90px] p-1.5 transition-colors duration-100 sm:min-h-[110px] ${
                  selected ? "bg-brand-soft ring-1 ring-inset ring-brand" : "bg-surface"
                } ${canCreate && !selected ? "hover:bg-sunken" : ""}`}
              >
                {canCreate && (
                  <button
                    type="button"
                    onClick={() => onClick(d.key)}
                    aria-label={`Crear evento el ${d.key}`}
                    className="absolute inset-0 cursor-cell focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-strong"
                  />
                )}
                <span
                  className={`pointer-events-none relative text-xs ${
                    d.isToday ? "rounded bg-brand-strong px-1 text-white" : "text-ink-3"
                  }`}
                >
                  {d.num}
                </span>
                <div className="pointer-events-none relative mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((e) => (
                    <Chip key={e.id} e={e} />
                  ))}
                  {dayEvents.length > 3 && <p className="text-[10px] text-ink-3">+{dayEvents.length - 3} más</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {canCreate && (
        <EventDialog
          range={range}
          athletes={athletes}
          onClose={() => setRange(null)}
          onSaved={() => setRange(null)}
        />
      )}
    </>
  );
}

function Chip({ e }: { e: EventLite }) {
  const body = (
    <>
      {!e.all_day && `${e.starts_at.slice(11, 16)} `}
      {e.title}
      {e.plan_type && <span className="ml-1 opacity-70">· {PLAN_LABEL[e.plan_type]}</span>}
    </>
  );
  const cls = `pointer-events-auto relative block truncate rounded px-1.5 py-1 text-[11px] leading-tight transition hover:brightness-95 ${chipClass(e.color, e.kind)}`;
  return (
    <Link href={`/calendario/${e.id}`} onPointerDown={(ev) => ev.stopPropagation()} className={cls}>
      {body}
    </Link>
  );
}
