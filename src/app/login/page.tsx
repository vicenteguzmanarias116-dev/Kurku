"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold">Kurku</h1>
        {sent ? (
          <p className="text-sm text-zinc-600">
            Te enviamos un enlace de acceso a <strong>{email}</strong>. Revisá tu
            correo.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-zinc-300 px-3 py-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-zinc-900 px-3 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Enviando…" : "Entrar con enlace"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
