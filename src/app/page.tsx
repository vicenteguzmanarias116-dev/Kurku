import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-950 text-white">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-lg font-semibold">Kurku</span>
        <Link
          href="/login"
          className="rounded-full border border-white/20 px-4 py-1.5 text-sm hover:bg-white/10"
        >
          Entrar
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <span className="mb-5 rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
          Hecho para equipos de vela · más deportes pronto
        </span>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
          Tu equipo, sus datos, un solo lugar
        </h1>
        <p className="mt-5 max-w-lg text-lg text-zinc-400">
          Atletas, carga de entrenamiento, calendario y comunicación del
          equipo — todo en Kurku.
        </p>
        <Link
          href="/login"
          className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
        >
          Entrar al equipo
        </Link>
      </section>
    </main>
  );
}
