"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { rajdhani } from "./fonts";

export default function WelcomeModal({ show }: { show: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(show);

  useEffect(() => {
    if (show) {
      // limpia el ?welcome=1 de la URL para que no vuelva a salir al refrescar
      router.replace("/dashboard");
    }
  }, [show, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6">
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-7 text-ink shadow-lg">
        <button
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-ink-3 hover:text-ink"
        >
          ✕
        </button>
        <p className="text-sm text-brand-text">Equipo creado</p>
        <h2 className={`${rajdhani.className} mt-1 text-2xl font-bold`}>
          Bienvenido a Kurku
        </h2>
        <p className="mt-3 text-sm text-ink-2">
          Gracias por darle una casa a tu equipo. Ya puedes sumar atletas,
          registrar entrenamientos y armar tu calendario.
        </p>
        <button
          onClick={() => setOpen(false)}
          className="mt-6 w-full rounded-lg bg-brand-strong px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand"
        >
          Empezar
        </button>
      </div>
    </div>
  );
}
