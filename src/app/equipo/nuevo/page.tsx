import Link from "next/link";
import { Rajdhani, JetBrains_Mono } from "next/font/google";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createTeam } from "./actions";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default async function NuevoEquipoPage() {
  const { profile } = await requireUser();
  if (profile?.team_id) redirect("/dashboard");

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#05080D] px-6 py-16 text-[#EAF2F6]">
      <div className="radar-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <Link
        href="/"
        className={`${rajdhani.className} relative z-10 mb-10 flex items-center gap-2 text-xl font-bold tracking-wide`}
      >
        <span className="h-2.5 w-2.5 bg-[#FF5A36]" />
        KURKU
      </Link>

      <div className="cut-corner relative z-10 w-full max-w-lg border border-cyan-400/20 bg-[#0D141E]/80 p-8 backdrop-blur">
        <span
          className={`${mono.className} mb-2 block text-[11px] uppercase tracking-widest text-cyan-300`}
        >
          Un paso más
        </span>
        <h1
          className={`${rajdhani.className} mb-1 text-3xl font-bold uppercase leading-none`}
        >
          Crea tu equipo
        </h1>
        <p className="mb-6 text-sm text-white/50">
          Quedas como admin. Después invitas al resto del staff y a los
          atletas.
        </p>

        <form action={createTeam} className="space-y-4">
          <Field name="name" label="Nombre del equipo" required />
          <Field name="location" label="Ubicación" placeholder="Lima, Perú" />
          <Field
            name="logo_url"
            label="Escudo / logo (URL)"
            placeholder="https://…"
          />
          <label className="block text-sm">
            <span className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}>
              Descripción
            </span>
            <textarea
              name="description"
              rows={3}
              placeholder="A qué se dedica el equipo, categorías, historia…"
              className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
            />
          </label>

          <button
            type="submit"
            className="cut-corner w-full bg-[#FF5A36] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
          >
            Crear equipo
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span
        className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}
      >
        {label}
      </span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
      />
    </label>
  );
}
