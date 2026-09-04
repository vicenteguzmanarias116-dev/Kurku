import Link from "next/link";
import { Rajdhani, JetBrains_Mono } from "next/font/google";
import HeroBackground from "./HeroBackground";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const FEATURES: { title: string; body: string; live: boolean }[] = [
  {
    title: "Atletas y equipo",
    body: "Ficha de cada regatista: clase de barco, peso, historial.",
    live: true,
  },
  {
    title: "Carga y monitoreo",
    body: "Registro de sesiones y ratio ACWR agudo/crónico por atleta.",
    live: true,
  },
  {
    title: "Planificación y calendario",
    body: "Entrenamientos y regatas del equipo en un solo lugar.",
    live: true,
  },
  {
    title: "Comunicación",
    body: "Anuncios del staff directo a todo el equipo.",
    live: true,
  },
  {
    title: "Tácticas y diagramas",
    body: "Dibuja maniobras y estrategias de regata.",
    live: false,
  },
  {
    title: "Análisis de vídeo",
    body: "Sube y anota vídeo de entrenamiento y regatas.",
    live: false,
  },
  {
    title: "Gestión de lesiones",
    body: "Seguimiento de lesiones y vuelta al agua.",
    live: false,
  },
  {
    title: "Colecciones",
    body: "Guarda y comparte sesiones, ejercicios y recursos del equipo.",
    live: false,
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-[#05080D] text-[#EAF2F6]">
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <HeroBackground />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#05080D_0%,rgba(5,8,13,0.8)_30%,rgba(5,8,13,0.35)_52%,rgba(5,8,13,0)_68%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05080D]/70 via-transparent to-transparent" />
        <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

        <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-12">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-[#FF5A36]" />
            <span
              className={`${rajdhani.className} text-xl font-bold tracking-wide`}
            >
              KURKU
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="#funciones"
              className={`${mono.className} hidden text-xs uppercase tracking-wider text-white/60 transition hover:text-cyan-300 sm:inline focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-4`}
            >
              Ver funciones
            </a>
            <Link
              href="/login"
              className="cut-corner border border-white/15 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-cyan-300/50 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
            >
              Entrar
            </Link>
          </div>
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

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="cut-corner inline-flex items-center gap-2 bg-[#FF5A36] px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
              >
                Entrar al equipo
                <span aria-hidden>→</span>
              </Link>
              <a
                href="#funciones"
                className={`${mono.className} text-xs uppercase tracking-wider text-white/50 underline decoration-white/20 underline-offset-4 transition hover:text-cyan-300 hover:decoration-cyan-300 sm:hidden`}
              >
                Ver funciones ↓
              </a>
            </div>
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
      </div>

      <section id="funciones" className="px-6 py-20 sm:px-12 lg:py-28">
        <span
          className={`${mono.className} block text-[11px] uppercase tracking-widest text-cyan-300`}
        >
          Hoja de ruta
        </span>
        <h2
          className={`${rajdhani.className} mt-2 max-w-xl text-3xl font-bold uppercase leading-none sm:text-4xl`}
        >
          Lo que Kurku va a ofrecer
        </h2>
        <p className="mt-4 max-w-lg text-white/50">
          Empezamos con vela. Esto es lo que ya funciona y lo que viene
          después.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="cut-corner border border-white/10 bg-white/[0.03] p-5"
            >
              <span
                className={`${mono.className} inline-block text-[10px] uppercase tracking-wider ${
                  f.live ? "text-cyan-300" : "text-white/35"
                }`}
              >
                {f.live ? "Disponible" : "Próximamente"}
              </span>
              <h3
                className={`${rajdhani.className} mt-2 text-xl font-bold uppercase leading-tight`}
              >
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-white/50">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
