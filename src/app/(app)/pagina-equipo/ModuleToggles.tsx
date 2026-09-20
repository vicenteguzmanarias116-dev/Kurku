"use client";

import { useState } from "react";
import { OPTIONAL_MODULES } from "../modules";
import { setModules } from "./module-actions";
import { Card } from "../ui";

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
    <Card>
      <div className="mb-1 flex items-center justify-between">
        <span className="block text-xs font-medium text-ink-2">Herramientas del equipo</span>
        {saving && <span className="text-xs text-brand-text">Guardando…</span>}
      </div>
      <p className="mb-4 text-xs text-ink-3">
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
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-ink-2 transition hover:bg-sunken"
              >
                <span>{m.label}</span>
                <span
                  className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                    on ? "bg-brand-strong" : "bg-line-strong"
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
    </Card>
  );
}
