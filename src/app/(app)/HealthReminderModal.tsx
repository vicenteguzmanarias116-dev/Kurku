"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { rajdhani } from "./fonts";

export default function HealthReminderModal({ show }: { show: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  // no molestar si ya está en /salud llenándolo, o si ya lo cerró esta sesión
  if (!show || dismissed || pathname.startsWith("/salud")) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6">
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-7 text-ink shadow-lg">
        <button
          onClick={() => setDismissed(true)}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-ink-3 hover:text-ink"
        >
          ✕
        </button>
        <p className="text-sm text-ink-3">Check-in de hoy</p>
        <h2 className={`${rajdhani.className} mt-1 text-2xl font-bold`}>
          ¿Cómo está tu cuerpo hoy?
        </h2>
        <p className="mt-3 text-sm text-ink-2">
          Todavía no llenaste tu check-in de salud de hoy: sueño, ánimo y si hay
          algún músculo con fatiga o dolor. Toma menos de un minuto.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setDismissed(true)}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-sunken hover:text-ink"
          >
            Más tarde
          </button>
          <button
            onClick={() => router.push("/salud")}
            className="flex-1 rounded-lg bg-brand-strong px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand"
          >
            Llenar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
