import Link from "next/link";
import { display as rajdhani, mono } from "../../fonts";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeamForm from "./TeamForm";

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

        <TeamForm />
      </div>
    </main>
  );
}
