"use client";

import { useEffect, useState } from "react";
import { JetBrains_Mono } from "next/font/google";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const BASE = { rumbo: 214, viento: 12.4, vmg: 4.2 };

export default function HeroTelemetry() {
  const [d, setD] = useState(BASE);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const id = setInterval(() => {
      setD({
        rumbo: Math.round(BASE.rumbo + (Math.random() * 6 - 3) + 360) % 360,
        viento: +(BASE.viento + (Math.random() * 1.2 - 0.6)).toFixed(1),
        vmg: +(BASE.vmg + (Math.random() * 0.6 - 0.3)).toFixed(1),
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`${mono.className} cut-corner w-full max-w-[240px] border border-cyan-400/25 bg-[#0D141E]/90 px-5 py-4 text-[13px] text-[#EAF2F6] shadow-[0_0_30px_-10px_rgba(47,230,255,0.35)] backdrop-blur`}
    >
      <div className="mb-2.5 flex items-center justify-between text-[11px] uppercase tracking-wider text-cyan-300/80">
        <span>Telemetría · ILCA 6</span>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 motion-safe:animate-pulse" />
      </div>
      <dl className="space-y-1.5">
        <Row label="Rumbo" value={`${d.rumbo}°`} />
        <Row label="Viento" value={`${d.viento} kn`} />
        <Row label="VMG" value={`${d.vmg} kn`} />
      </dl>
      <p className="mt-3 text-[10px] uppercase tracking-wider text-white/30">
        Vista previa · datos de ejemplo
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-1.5 first:border-0 first:pt-0">
      <dt className="text-white/50">{label}</dt>
      <dd className="tabular-nums text-cyan-200">{value}</dd>
    </div>
  );
}
