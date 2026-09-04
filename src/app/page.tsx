import Image from "next/image";
import Link from "next/link";
import { Rajdhani, JetBrains_Mono } from "next/font/google";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-[#05080D] text-[#EAF2F6]">
      <Image
        src="/hero/peru-aerial.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05080D] via-[#05080D]/85 to-[#05080D]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05080D]/95 via-[#05080D]/55 to-transparent" />
      <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-12">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-[#FF5A36]" />
          <span className={`${rajdhani.className} text-xl font-bold tracking-wide`}>
            KURKU
          </span>
        </div>
        <Link
          href="/login"
          className="cut-corner border border-white/15 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-cyan-300/50 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
        >
          Entrar
        </Link>
      </header>

      <section className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 sm:px-12 lg:py-24">
        <div className="max-w-2xl">
          <span
            className={`${mono.className} cut-corner mb-6 inline-flex items-center gap-2 border border-cyan-400/25 bg-cyan-400/5 px-3 py-1.5 text-[11px] uppercase tracking-widest text-cyan-300`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 motion-safe:animate-pulse" />
            Equipo de vela · en línea
          </span>

          <h1
            className={`${rajdhani.className} text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl`}
          >
            Rumbo al
            <br />
            <span className="text-[#FF5A36]">rendimiento</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-white/50">
            Atletas, carga de entrenamiento, calendario y comunicación del
            equipo — todo en Kurku.
          </p>

          <Link
            href="/login"
            className="cut-corner mt-9 inline-flex items-center gap-2 bg-[#FF5A36] px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
          >
            Entrar al equipo
            <span aria-hidden>→</span>
          </Link>
        </div>

        <p
          className={`${mono.className} absolute bottom-6 right-6 hidden text-[10px] uppercase tracking-wider text-white/30 sm:right-12 lg:block`}
        >
          Flota Perú · ILCA
        </p>
      </section>

      <svg
        className="relative z-10 h-10 w-full text-cyan-400/20"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 20 Q150 0 300 20 T600 20 T900 20 T1200 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </main>
  );
}
