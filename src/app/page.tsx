import Link from "next/link";
import HeroBackground from "./HeroBackground";
import Reveal from "./Reveal";
import { display, mono } from "./fonts";

type FeatureIcon =
  | "users"
  | "activity"
  | "calendar"
  | "message"
  | "compass"
  | "video"
  | "heart"
  | "layers";

const FEATURES: {
  title: string;
  body: string;
  live: boolean;
  icon: FeatureIcon;
}[] = [
  {
    title: "Atletas y equipo",
    body: "Ficha de cada regatista: clase de barco, peso, historial.",
    live: true,
    icon: "users",
  },
  {
    title: "Carga y monitoreo",
    body: "Registro de sesiones y ratio ACWR agudo/crónico por atleta.",
    live: true,
    icon: "activity",
  },
  {
    title: "Planificación y calendario",
    body: "Entrenamientos y regatas del equipo en un solo lugar.",
    live: true,
    icon: "calendar",
  },
  {
    title: "Comunicación",
    body: "Anuncios del staff directo a todo el equipo.",
    live: true,
    icon: "message",
  },
  {
    title: "Tácticas y diagramas",
    body: "Dibuja maniobras y estrategias de regata.",
    live: false,
    icon: "compass",
  },
  {
    title: "Análisis de vídeo",
    body: "Sube y anota vídeo de entrenamiento y regatas.",
    live: false,
    icon: "video",
  },
  {
    title: "Gestión de lesiones",
    body: "Seguimiento de lesiones y vuelta al agua.",
    live: false,
    icon: "heart",
  },
  {
    title: "Colecciones",
    body: "Guarda y comparte sesiones, ejercicios y recursos del equipo.",
    live: false,
    icon: "layers",
  },
];

const ICON_PATHS: Record<FeatureIcon, React.ReactNode> = {
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  activity: <path d="M22 12h-4l-3 9-6-18-3 9H2" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  message: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
    </>
  ),
  video: (
    <>
      <rect x="2" y="5" width="14" height="14" rx="2" />
      <path d="m22 8-6 4 6 4z" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </>
  ),
};

function FeatureIconSvg({ icon, live }: { icon: FeatureIcon; live: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-6 w-6 transition-colors duration-300 ${
        live
          ? "text-cyan-300 group-hover:text-cyan-200"
          : "text-white/30 group-hover:text-white/50"
      }`}
      aria-hidden
    >
      {ICON_PATHS[icon]}
    </svg>
  );
}

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
            <span className={`${display.className} text-xl font-bold tracking-tight`}>
              KURKU
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#funciones"
              className={`${mono.className} cut-corner hidden border-2 border-[#FF5A36] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#FF5A36] transition hover:bg-[#FF5A36] hover:text-[#05080D] sm:inline focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-4`}
            >
              Ver funciones
            </a>
            <Link
              href="/login"
              className="cut-corner bg-[#FF5A36] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
            >
              Entrar
            </Link>
          </div>
        </header>

        <section className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 sm:px-12 lg:py-24">
          <div className="max-w-3xl">
            <Reveal>
              <h1
                className={`${display.className} text-[2.6rem] font-bold uppercase leading-[0.9] tracking-tight sm:text-8xl lg:text-[7.5rem]`}
              >
                Rumbo al
                <br />
                <span className="text-[#FF5A36]">rendimiento</span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-6 max-w-md text-lg text-white/50">
                Atletas, carga de entrenamiento, calendario y comunicación del
                equipo — todo en Kurku.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/login"
                  className="cut-corner inline-flex items-center gap-2 bg-[#FF5A36] px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:scale-[1.03] hover:bg-[#ff7154] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
                >
                  Entrar al equipo
                  <span aria-hidden>→</span>
                </Link>
                <a
                  href="#funciones"
                  className={`${mono.className} cut-corner border-2 border-[#FF5A36] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#FF5A36] transition hover:bg-[#FF5A36] hover:text-[#05080D] sm:hidden`}
                >
                  Ver funciones
                </a>
              </div>
            </Reveal>
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

      <section
        id="funciones"
        className="radar-grid relative px-6 py-20 sm:px-12 lg:py-28"
      >
        <Reveal>
          <span
            className={`${mono.className} block text-[11px] uppercase tracking-widest text-cyan-300`}
          >
            Hoja de ruta
          </span>
          <h2
            className={`${display.className} mt-2 max-w-xl text-4xl font-bold uppercase leading-none sm:text-5xl`}
          >
            Lo que Kurku va a ofrecer
          </h2>
          <p className="mt-4 max-w-lg text-white/50">
            Empezamos con vela. Esto es lo que ya funciona y lo que viene
            después.
          </p>
        </Reveal>

        <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 80}>
              <div
                className={`hud-frame cut-corner group relative h-full overflow-hidden border p-5 transition-all duration-300 hover:-translate-y-1 ${
                  f.live
                    ? "border-cyan-300/25 bg-white/[0.04] text-cyan-300 hover:border-cyan-300/60 hover:bg-white/[0.07] hover:shadow-[0_0_24px_-6px_rgba(103,232,249,0.35)]"
                    : "border-dashed border-white/10 bg-white/[0.015] text-white/40 hover:border-white/25 hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`${mono.className} pointer-events-none absolute -right-1 -top-1 text-5xl font-bold text-white/[0.04] transition-colors duration-300 group-hover:text-white/[0.07]`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center border ${
                      f.live
                        ? "border-cyan-300/30 bg-cyan-300/[0.06]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <FeatureIconSvg icon={f.icon} live={f.live} />
                  </div>

                  <span
                    className={`${mono.className} inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${
                      f.live ? "text-cyan-300" : "text-white/35"
                    }`}
                  >
                    {f.live ? (
                      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full border border-white/30" />
                    )}
                    {f.live ? "Disponible" : "Próximamente"}
                  </span>
                </div>

                <h3
                  className={`${display.className} relative mt-4 text-xl font-bold uppercase leading-tight text-[#EAF2F6]`}
                >
                  {f.title}
                </h3>
                <p className="relative mt-2 text-sm text-white/50">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
