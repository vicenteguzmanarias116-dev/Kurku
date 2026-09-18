"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HeaderSettings() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ajustes"
        title="Ajustes"
        className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
          open
            ? "bg-brand-soft text-brand-text"
            : "text-ink-3 hover:bg-sunken hover:text-ink"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.51.12.99.44 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-surface py-1.5 shadow-lg">
          <div className="border-b border-line px-4 py-2.5">
            <p className="text-xs text-ink-3">Ajustes</p>
          </div>
          <Link
            href="/pagina-equipo?editar=1"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-ink-2 hover:bg-sunken hover:text-ink"
          >
            Personalizar página del equipo
          </Link>
          <Link
            href="/equipo/miembros"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-ink-2 hover:bg-sunken hover:text-ink"
          >
            Miembros
          </Link>
        </div>
      )}
    </div>
  );
}
