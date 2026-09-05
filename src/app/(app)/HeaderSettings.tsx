"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { mono } from "./fonts";

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
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
          open
            ? "border-cyan-300 bg-cyan-300/10 text-cyan-300"
            : "border-white/15 text-white/50 hover:border-cyan-300/60 hover:text-cyan-300"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.51.12.99.44 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
      </button>

      {open && (
        <div className="cut-corner absolute right-0 top-full z-30 mt-2 w-56 border border-cyan-400/20 bg-[#0D141E] py-2 shadow-xl shadow-black/50">
          <div className="border-b border-white/10 px-4 py-2">
            <p className={`${mono.className} text-[10px] uppercase tracking-widest text-white/40`}>
              Ajustes
            </p>
          </div>
          <Link
            href="/pagina-equipo?editar=1"
            onClick={() => setOpen(false)}
            className={`${mono.className} block px-4 py-2 text-xs uppercase tracking-wider text-white/60 hover:bg-white/5 hover:text-white`}
          >
            Personalizar página del equipo
          </Link>
        </div>
      )}
    </div>
  );
}
