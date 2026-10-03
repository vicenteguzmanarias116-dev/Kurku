"use client";

import { useState } from "react";
import Link from "next/link";
import { rajdhani } from "../fonts";

const LINKS = [
  { href: "/pagina-equipo", label: "Página del equipo", hint: "Avisos y fotos" },
  { href: "/mensajes", label: "Mensajes", hint: "Habla con tu equipo" },
  { href: "/noticias", label: "Noticias", hint: "Novedades de vela" },
  { href: "/cuenta", label: "Mi cuenta", hint: "Tu perfil" },
];

export default function ViewAllToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-2 text-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-medium text-ink-3 underline underline-offset-2 hover:text-ink"
      >
        {open ? "Ocultar" : "Ver todo lo del equipo"}
      </button>

      {open && (
        <div className="mt-4 grid gap-2 text-left sm:grid-cols-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-line bg-surface px-4 py-3 transition hover:border-brand/50"
            >
              <p className={`${rajdhani.className} font-bold text-ink`}>{l.label}</p>
              <p className="text-xs text-ink-3">{l.hint}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
