"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PasswordForm({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setStatus("sending");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/auth/reset`,
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-xs text-cyan-300">
        Te enviamos un link a {email} para elegir una contraseña nueva.
      </p>
    );
  }

  return (
    <div>
      {error && <p className="mb-2 text-xs text-[#FF5A36]">{error}</p>}
      <button
        onClick={send}
        disabled={status === "sending"}
        className="cut-corner border-2 border-cyan-300/60 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-cyan-300 transition hover:bg-cyan-300 hover:text-[#05080D] disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Cambiar contraseña"}
      </button>
    </div>
  );
}
