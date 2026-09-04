"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { rajdhani, mono } from "./fonts";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="cut-corner relative w-full max-w-md border border-cyan-400/20 bg-[#0D141E] p-8 text-[#EAF2F6]">
        <button
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-white/40 hover:text-white"
        >
          ✕
        </button>
        <span
          className={`${mono.className} block text-[11px] uppercase tracking-widest text-cyan-300`}
        >
          Equipo creado
        </span>
        <h2
          className={`${rajdhani.className} mt-1 text-3xl font-bold uppercase leading-none`}
        >
          Bienvenido a Kurku
        </h2>
        <p className="mt-4 text-sm text-white/60">
          Gracias por darle una casa a tu equipo. Ya puedes sumar atletas,
          registrar entrenamientos y armar tu calendario.
        </p>
        <button
          onClick={() => setOpen(false)}
          className="cut-corner mt-6 w-full bg-[#FF5A36] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154]"
        >
          Empezar
        </button>
      </div>
    </div>
  );
}
