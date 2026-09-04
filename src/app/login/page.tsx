"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Rajdhani, JetBrains_Mono } from "next/font/google";
import { createClient } from "@/lib/supabase/client";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function forgotPassword() {
    if (!email) {
      setError("Escribe tu correo arriba primero.");
      return;
    }
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback`,
    });
    if (error) setError(error.message);
    else setForgotSent(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) setError(error.message);
      else {
        router.push("/dashboard");
        router.refresh();
      }
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (data.session) {
      // confirmación de correo desactivada: ya queda logueado
      router.push("/equipo/nuevo");
      router.refresh();
    } else {
      setCheckEmail(true);
    }
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
        {!checkEmail && (
          <div className="mb-6 flex border border-white/15">
            {(
              [
                ["login", "Iniciar sesión"],
                ["signup", "Crear cuenta"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`${mono.className} flex-1 px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
                  mode === m
                    ? "bg-[#FF5A36] text-[#05080D]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <span
          className={`${mono.className} mb-2 block text-[11px] uppercase tracking-widest text-cyan-300`}
        >
          {mode === "login" ? "Acceso del equipo" : "Coaches y staff"}
        </span>
        <h1
          className={`${rajdhani.className} mb-6 text-3xl font-bold uppercase leading-none`}
        >
          {mode === "login" ? "Entrar a Kurku" : "Crea tu cuenta"}
        </h1>

        {checkEmail ? (
          <p className="text-sm text-white/60">
            Te enviamos un correo a{" "}
            <strong className="text-white">{email}</strong> para confirmar tu
            cuenta. Ábrelo y vuelve a entrar con tu correo y contraseña.
          </p>
        ) : forgotSent ? (
          <p className="text-sm text-white/60">
            Te enviamos un enlace a{" "}
            <strong className="text-white">{email}</strong> para elegir una
            contraseña nueva.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                required
                placeholder="Tu nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
              />
            )}
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
            />
            <button
              type="submit"
              disabled={loading}
              className="cut-corner w-full bg-[#FF5A36] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#05080D] transition hover:bg-[#ff7154] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 focus-visible:outline-offset-2"
            >
              {loading
                ? "Un momento…"
                : mode === "login"
                  ? "Entrar"
                  : "Crear cuenta"}
            </button>
            {mode === "signup" && (
              <p className="text-xs text-white/35">
                Después de crear tu cuenta armas el equipo: nombre, escudo,
                descripción y ubicación.
              </p>
            )}
            {mode === "login" && (
              <button
                type="button"
                onClick={forgotPassword}
                className={`${mono.className} text-xs uppercase tracking-wider text-white/40 hover:text-cyan-300`}
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
            {error && (
              <p className={`${mono.className} text-xs text-[#FF5A36]`}>
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
