"use client";

import { useState } from "react";
import Link from "next/link";
import { Rajdhani, JetBrains_Mono } from "next/font/google";
import { createClient } from "@/lib/supabase/client";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

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

      <div className="cut-corner relative z-10 w-full max-w-sm border border-cyan-400/20 bg-[#0D141E]/80 p-8 backdrop-blur">
        <span
          className={`${mono.className} mb-2 block text-[11px] uppercase tracking-widest text-cyan-300`}
        >
          Acceso del equipo
        </span>
        <h1
          className={`${rajdhani.className} mb-6 text-3xl font-bold uppercase leading-none`}
        >
          Entrar a Kurku
        </h1>

        {sent ? (
          <p className="text-sm text-white/60">
            Enviamos un enlace de acceso a{" "}
            <strong className="text-white">{email}</strong>. Revisa tu correo
            para entrar.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
            />
            <button
              type="submit"
              disabled={loading}
              className="cut-corner w-full bg-[#FF5A36] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
            >
              {loading ? "Enviando…" : "Entrar con enlace"}
            </button>
            {error && (
              <p
                className={`${mono.className} text-xs text-[#FF5A36]`}
              >
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
