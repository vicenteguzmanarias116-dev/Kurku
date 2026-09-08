"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { rajdhani, mono } from "./fonts";

export default function HealthReminderModal({ show }: { show: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  // no molestar si ya está en /salud llenándolo, o si ya lo cerró esta sesión
  if (!show || dismissed || pathname.startsWith("/salud")) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="cut-corner relative w-full max-w-md border border-[#FF5A36]/30 bg-[#0D141E] p-8 text-[#EAF2F6]">
        <button
          onClick={() => setDismissed(true)}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-white/40 hover:text-white"
        >
          ✕
        </button>
        <span className={`${mono.className} block text-[11px] uppercase tracking-widest text-[#FF5A36]`}>
          Check-in de hoy
        </span>
        <h2 className={`${rajdhani.className} mt-1 text-3xl font-bold uppercase leading-none`}>
          ¿Cómo está tu cuerpo hoy?
        </h2>
        <p className="mt-4 text-sm text-white/60">
          Todavía no llenaste tu check-in de salud de hoy: sueño, ánimo y si
          hay algún músculo con fatiga o dolor. Toma menos de un minuto.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setDismissed(true)}
            className={`${mono.className} border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/50 hover:text-white`}
          >
            Más tarde
          </button>
          <button
            onClick={() => router.push("/salud")}
            className="cut-corner flex-1 bg-[#FF5A36] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]"
          >
            Llenar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
