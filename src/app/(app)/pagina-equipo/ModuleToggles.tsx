"use client";

import { useState } from "react";
import { mono } from "../fonts";
import { OPTIONAL_MODULES } from "../modules";
import { setModules } from "./module-actions";

export default function ModuleToggles({
  initialHidden,
}: {
  initialHidden: string[];
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set(initialHidden));
  const [saving, setSaving] = useState(false);

  async function toggle(key: string) {
    const next = new Set(hidden);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setHidden(next);
    setSaving(true);
    await setModules([...next]);
    setSaving(false);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#0D141E]/80 p-5">
      <div className="mb-1 flex items-center justify-between">
        <span
          className={`${mono.className} block text-[10px] uppercase tracking-widest text-white/40`}
        >
          Herramientas del equipo
        </span>
        {saving && (
          <span className={`${mono.className} text-[10px] uppercase tracking-widest text-cyan-300`}>
            Guardando…
          </span>
        )}
      </div>
      <p className="mb-4 text-xs text-white/40">
        Apaga las que tu equipo no usa. Desaparecen del menú para todos.
      </p>

      <ul className="space-y-1">
        {OPTIONAL_MODULES.map((m) => {
          const on = !hidden.has(m.key);
          return (
            <li key={m.key}>
              <button
                type="button"
                onClick={() => toggle(m.key)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/5"
              >
                <span>{m.label}</span>
                <span
                  className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                    on ? "bg-[#FF5A36]" : "bg-white/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                      on ? "left-4" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
