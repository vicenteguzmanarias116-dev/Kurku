"use client";

import { useState } from "react";
import { mono } from "../fonts";
import { createClient } from "@/lib/supabase/client";

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setPassword("");
      setStatus("done");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span
          className={`${mono.className} mb-1 block text-xs uppercase tracking-wider text-white/50`}
        >
          Nueva contraseña
        </span>
        <input
          type="password"
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40"
        />
      </label>

      {status === "done" && (
        <p className="text-xs text-cyan-300">Contraseña actualizada.</p>
      )}
      {error && (
        <p className={`${mono.className} text-xs text-[#FF5A36]`}>{error}</p>
      )}

      <button
        disabled={status === "saving"}
        className="cut-corner border-2 border-cyan-300/60 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-cyan-300 transition hover:bg-cyan-300 hover:text-[#05080D] disabled:opacity-60"
      >
        {status === "saving" ? "Guardando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
