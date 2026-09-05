import Link from "next/link";
import HeroBackground from "./HeroBackground";
import Reveal from "./Reveal";
import { display, mono } from "./fonts";

type FeatureIcon =
  | "users"
  | "activity"
  | "calendar"
  | "message"
  | "video"
  | "heart"
  | "layers";

/** Ubicación explícita en el bento grid de 4 columnas (solo desde lg:). */
type BentoSlot = {
  col: string; // ej. "lg:col-start-1 lg:col-span-2"
  row: string; // ej. "lg:row-start-1 lg:row-span-2"
};

const FEATURES: {
  title: string;
  body: string;
  live: boolean;
  icon: FeatureIcon;
  slot: BentoSlot;
}[] = [
  {
    title: "Atletas y equipo",
    body: "Ficha de cada regatista: clase de barco, peso, historial.",
    live: true,
    icon: "users",
    slot: {
      col: "lg:col-start-1 lg:col-span-2",
      row: "lg:row-start-1 lg:row-span-2",
    },
  },
  {
    title: "Carga y monitoreo",
    body: "Registro de sesiones y ratio ACWR agudo/crónico por atleta.",
    live: true,
    icon: "activity",
    slot: {
      col: "lg:col-start-3 lg:col-span-2",
      row: "lg:row-start-1 lg:row-span-1",
    },
  },
  {
    title: "Planificación y calendario",
    body: "Entrenamientos y regatas del equipo en un solo lugar.",
    live: true,
    icon: "calendar",
    slot: {
      col: "lg:col-start-3 lg:col-span-1",
      row: "lg:row-start-2 lg:row-span-1",
    },
  },
  {
    title: "Comunicación",
    body: "Anuncios del staff directo a todo el equipo.",
    live: true,
    icon: "message",
    slot: {
      col: "lg:col-start-4 lg:col-span-1",
      row: "lg:row-start-2 lg:row-span-1",
    },
  },
  {
    title: "Análisis de vídeo",
    body: "Sube y anota vídeo de entrenamiento y regatas.",
    live: false,
    slot: {
      col: "lg:col-start-1 lg:col-span-2",
      row: "lg:row-start-3 lg:row-span-1",
    },
    icon: "video",
  },
  {
    title: "Gestión de lesiones",
    body: "Seguimiento de lesiones y vuelta al agua.",
    live: false,
    icon: "heart",
    slot: {
      col: "lg:col-start-3 lg:col-span-1",
      row: "lg:row-start-3 lg:row-span-1",
    },
  },
  {
    title: "Colecciones",
    body: "Guarda y comparte sesiones, ejercicios y recursos del equipo.",
    live: false,
    icon: "layers",
    slot: {
      col: "lg:col-start-4 lg:col-span-1",
      row: "lg:row-start-3 lg:row-span-1",
    },
  },
];

const ICON_PATHS: Record<FeatureIcon, React.ReactNode> = {
  users: (
    // velero ILCA: mástil, vela y casco
    <>
      <path d="M12 2v14" />
      <path d="M12 4l7 9h-7z" />
      <path d="M6 16h12l-1.6 4H7.6z" />
      <path d="M3 20.5c2.2 1.2 4.4 1.2 6.5 0s4.3-1.2 6.5 0 4.3 1.2 6.5 0" />
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
    // banderín de señales náuticas
    <>
      <path d="M6 3v18" />
      <path d="M6 4.5l10 3.5-10 3.5z" />
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
    // ancla: "guarda" tus sesiones y recursos
    <>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 7.5V21" />
      <path d="M4.5 11.5H2a10 10 0 0 0 20 0h-2.5" />
    </>
  ),
};

function FeatureIconSvg({
  icon,
  live,
  big = false,
}: {
  icon: FeatureIcon;
  live: boolean;
  big?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-colors duration-300 ${big ? "h-7 w-7" : "h-6 w-6"} ${
        live
          ? "text-[#FF5A36] group-hover:text-[#ff7154]"
          : "text-[#FF5A36]/30 group-hover:text-[#FF5A36]/50"
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
        <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5A36]/70 to-transparent" />

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
              className="cut-corner bg-[#FF5A36] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#05080D] transition-all hover:scale-[1.03] hover:bg-[#ff7154] hover:shadow-lg hover:shadow-[#FF5A36]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
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
                  className="cut-corner inline-flex items-center gap-2 bg-[#FF5A36] px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition-all hover:scale-[1.03] hover:bg-[#ff7154] hover:shadow-lg hover:shadow-[#FF5A36]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
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
        </section>

        <svg
          className="relative z-10 h-10 w-full text-[#FF5A36]/20"
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
            className={`${mono.className} inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#FF5A36]`}
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3 -translate-y-px"
              aria-hidden
            >
              <path d="M3 1v14" stroke="currentColor" strokeWidth="1.3" />
              <path d="M3 2l10 3-10 3z" fill="currentColor" />
            </svg>
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

          <svg
            className="mt-8 h-6 w-full max-w-xs text-[#FF5A36]/25"
            viewBox="0 0 300 24"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0 12c15 0 15-8 30-8s15 8 30 8 15-8 30-8 15 8 30 8 15-8 30-8 15 8 30 8 15-8 30-8 15 8 30 8 15-8 30-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Reveal>

        <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(150px,1fr)] lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const flagship = i === 0;
            return (
              <Reveal
                key={f.title}
                delay={(i % 4) * 80}
                className={`${f.slot.col} ${f.slot.row} h-full`}
              >
                <div
                  className={`hud-frame cut-corner group relative flex h-full flex-col overflow-hidden border p-5 transition-all duration-300 hover:-translate-y-1 ${
                    f.live
                      ? "border-[#FF5A36]/25 bg-white/[0.04] text-[#FF5A36] hover:border-[#FF5A36]/60 hover:bg-white/[0.07] hover:shadow-[0_0_24px_-6px_rgba(255,90,54,0.35)]"
                      : "border-dashed border-[#FF5A36]/15 bg-white/[0.015] text-[#FF5A36]/50 hover:border-[#FF5A36]/35 hover:bg-white/[0.03]"
                  }`}
                >
                  <span
                    className={`${mono.className} pointer-events-none absolute -right-1 -top-1 text-5xl font-bold text-white/[0.04] transition-colors duration-300 group-hover:text-white/[0.07]`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-start justify-between">
                    <div
                      className={`flex items-center justify-center border ${
                        flagship ? "h-14 w-14" : "h-11 w-11"
                      } ${
                        f.live
                          ? "border-[#FF5A36]/30 bg-[#FF5A36]/[0.08]"
                          : "border-[#FF5A36]/15 bg-[#FF5A36]/[0.03]"
                      }`}
                    >
                      <FeatureIconSvg icon={f.icon} live={f.live} big={flagship} />
                    </div>

                    <span
                      className={`${mono.className} inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${
                        f.live ? "text-[#FF5A36]" : "text-[#FF5A36]/50"
                      }`}
                    >
                      {f.live ? (
                        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#FF5A36]" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full border border-[#FF5A36]/40" />
                      )}
                      {f.live ? "Disponible" : "Próximamente"}
                    </span>
                </div>

                  <h3
                    className={`${display.className} relative mt-4 font-bold uppercase leading-tight text-[#EAF2F6] ${
                      flagship ? "text-3xl" : "text-xl"
                    }`}
                  >
                    {f.title}
                  </h3>
                  <p
                    className={`relative mt-2 text-white/50 ${
                      flagship ? "max-w-xs text-base" : "text-sm"
                    }`}
                  >
                    {f.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10 sm:px-12">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#FF5A36]" />
            <span
              className={`${display.className} text-base font-bold tracking-tight`}
            >
              KURKU
            </span>
          </div>

          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Kurku. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
